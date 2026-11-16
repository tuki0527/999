import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDemoComponent } from '../interactive/registry';
import {
  getConceptById,
  getExamplesForConcept,
  getSourcesForConcept,
} from '../lib/contentLoader';
import type { ConceptDocument } from '../types/wiki';
import { CodeBlock } from './CodeBlock';
import { DiagramViewer } from './DiagramViewer';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SourceCitationList } from './SourceCitationList';

interface LessonViewProps {
  concept: ConceptDocument;
  prevConcept?: ConceptDocument;
  nextConcept?: ConceptDocument;
  isFavorite: boolean;
  isCompleted: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const STATUS_LABEL: Record<ConceptDocument['metadata']['status'], string> = {
  draft: '草稿｜待來源查核',
  verified: '已查核｜來源已整合',
  planned: '規劃中｜待後續補齊',
};

interface ParsedExerciseBlock {
  question: string;
  answer: string | null;
}

function splitExercises(body: string): ParsedExerciseBlock[] {
  // Split by ### 檢查 or ### 練習 headings if multiple checks exist
  const normalized = body.replace(/\r\n/g, '\n').trim();
  const chunks = normalized.split(/(?=^###\s+)/m).filter((c) => c.trim().length > 0);

  return chunks.map((chunk) => {
    const markerA = chunk.indexOf('- **參考解析**');
    const markerB = chunk.indexOf('**參考解析**');
    const splitIdx = markerA >= 0 ? markerA : markerB;
    if (splitIdx > 0) {
      return {
        question: chunk.slice(0, splitIdx).trim(),
        answer: chunk.slice(splitIdx).trim(),
      };
    }
    return { question: chunk.trim(), answer: null };
  });
}

function ExerciseCard({
  block,
  index,
}: {
  block: ParsedExerciseBlock;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
      <div className="max-w-[70ch]">
        <MarkdownRenderer content={block.question} />
      </div>
      {block.answer && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#3458A4]/40 bg-[#3458A4]/5 px-4 py-2 text-sm font-semibold text-[#3458A4] transition-colors hover:bg-[#3458A4]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
          >
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span>{open ? `隱藏檢查 ${index + 1} 解析` : `顯示檢查 ${index + 1} 參考解析`}</span>
          </button>
          {open && (
            <div className="mt-4 max-w-[70ch] border-t border-[#E5E7EB] pt-4">
              <MarkdownRenderer content={block.answer} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function LessonView({
  concept,
  prevConcept,
  nextConcept,
  isFavorite,
  isCompleted,
  onToggleFavorite,
  onToggleComplete,
}: LessonViewProps) {
  const { metadata, sections } = concept;
  const examples = getExamplesForConcept(concept);
  const sources = getSourcesForConcept(concept);
  const DemoComponent = getDemoComponent(metadata.demoId);

  const prereqs = metadata.prerequisites
    .map((id) => getConceptById(id))
    .filter((c): c is ConceptDocument => Boolean(c));

  const related = metadata.relatedIds
    .map((id) => getConceptById(id))
    .filter((c): c is ConceptDocument => Boolean(c));

  const orderStr = String(metadata.order).padStart(2, '0');

  return (
    <article className="mx-auto w-full max-w-4xl">
      {/* Chapter Header */}
      <header className="border-b border-[#E5E7EB] pb-6">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-[#4B5563]">
          <span className="font-mono text-[#3458A4]">第 {orderStr} 章</span>
          <span aria-hidden="true">·</span>
          <span className={metadata.status === 'verified' ? 'text-[#1F6E58] font-semibold' : ''}>
            {STATUS_LABEL[metadata.status]}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {metadata.compileStatus === 'verified' ? 'C# 範例已編譯驗證' : 'C# 範例未本地編譯驗證'}
          </span>
        </div>

        <h1 className="mt-2.5 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl [text-wrap:balance]">
          {metadata.title}
        </h1>
        {metadata.subtitle && (
          <p className="mt-2 text-lg text-[#4B5563]">{metadata.subtitle}</p>
        )}

        {/* Unboxed Metadata & User Actions */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#4B5563]">
            <span>關鍵主題：</span>
            {metadata.tags.map((tag, idx) => (
              <React.Fragment key={tag}>
                {idx > 0 && <span aria-hidden="true">/</span>}
                <span className="font-medium text-[#1F2937]">{tag}</span>
              </React.Fragment>
            ))}
            {prereqs.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  先修：
                  {prereqs.map((p, i) => (
                    <React.Fragment key={p.metadata.id}>
                      {i > 0 && '、'}
                      <Link
                        to={`/wiki/${p.metadata.slug}`}
                        className="text-[#3458A4] hover:underline"
                      >
                        {String(p.metadata.order).padStart(2, '0')} {p.metadata.title}
                      </Link>
                    </React.Fragment>
                  ))}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(metadata.id)}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4] ${
                isFavorite
                  ? 'border-[#3458A4] bg-[#3458A4]/10 text-[#3458A4]'
                  : 'border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F9FAFB]'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>{isFavorite ? '已收藏本章' : '收藏本章'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleComplete(metadata.id)}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#247C74] ${
                isCompleted
                  ? 'border-[#247C74] bg-[#247C74] text-white'
                  : 'border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F9FAFB]'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isCompleted ? '已完成學習' : '標記為已讀完'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Honest Verification Status Notice */}
      {metadata.status === 'verified' && (
        <div className="mt-6 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#4B5563]">
          教材狀態：已依據 <code className="font-mono">sources/registry.json</code> 實讀來源完成知識整合；本環境無 .NET SDK，故程式碼區標示為未本地編譯驗證。
        </div>
      )}

      {/* 9-Section Structured Content */}
      <div className="mt-8 space-y-10">
        {sections.map((section, index) => {
          const isDiagramSection = section.title === '觀念圖解';
          const isExampleSection = section.title === 'C# 範例';
          const isExerciseSection = section.title === '小練習與解析';
          const isSourceSection = section.title === '相關概念及資料來源';

          const exerciseBlocks = isExerciseSection ? splitExercises(section.body) : [];

          return (
            <section key={section.title} className="scroll-mt-24">
              <div className="mb-3 flex items-baseline gap-2.5 border-b border-[#E5E7EB] pb-2">
                <span className="font-mono text-xs font-semibold text-[#3458A4] tabular-nums">
                  {String(index + 1).padStart(2, '0')}.
                </span>
                <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                  {section.title}
                </h2>
              </div>

              {isExerciseSection ? (
                <div className="space-y-4">
                  {exerciseBlocks.map((block, bIdx) => (
                    <ExerciseCard key={bIdx} block={block} index={bIdx} />
                  ))}
                </div>
              ) : (
                <div className="max-w-[72ch]">
                  <MarkdownRenderer content={section.body} />
                </div>
              )}

              {isDiagramSection && <DiagramViewer demoId={metadata.demoId} />}

              {isExampleSection && examples.length > 0 && (
                <div className="mt-5 space-y-6">
                  <CodeBlock
                    files={examples}
                    compileStatus={metadata.compileStatus}
                  />
                  {DemoComponent && <DemoComponent examples={examples} />}
                </div>
              )}

              {isSourceSection && (
                <div className="mt-5 space-y-5">
                  {related.length > 0 && (
                    <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
                      <div className="text-xs font-semibold text-[#4B5563]">
                        關聯學習章節
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-3">
                        {related.map((rel) => (
                          <Link
                            key={rel.metadata.id}
                            to={`/wiki/${rel.metadata.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-sm font-medium text-[#3458A4] transition-colors hover:border-[#3458A4]/50 hover:bg-white"
                          >
                            <span className="font-mono text-xs">
                              {String(rel.metadata.order).padStart(2, '0')}
                            </span>
                            <span>{rel.metadata.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  <SourceCitationList sources={sources} />
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Previous / Next Chapter Footer Navigation */}
      <nav
        aria-label="章節前後切換"
        className="mt-12 grid gap-4 border-t border-[#E5E7EB] pt-6 sm:grid-cols-2"
      >
        {prevConcept ? (
          <Link
            to={`/wiki/${prevConcept.metadata.slug}`}
            className="flex flex-col rounded-xl border border-[#E5E7EB] bg-white p-4 transition-colors hover:border-[#3458A4]/50"
          >
            <span className="inline-flex items-center gap-1 text-xs text-[#4B5563]">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>上一章</span>
            </span>
            <span className="mt-1 text-base font-semibold text-[#111827]">
              {String(prevConcept.metadata.order).padStart(2, '0')}. {prevConcept.metadata.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextConcept ? (
          <Link
            to={`/wiki/${nextConcept.metadata.slug}`}
            className="flex flex-col items-end rounded-xl border border-[#E5E7EB] bg-white p-4 text-right transition-colors hover:border-[#3458A4]/50"
          >
            <span className="inline-flex items-center gap-1 text-xs text-[#4B5563]">
              <span>下一章</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <span className="mt-1 text-base font-semibold text-[#111827]">
              {String(nextConcept.metadata.order).padStart(2, '0')}. {nextConcept.metadata.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
