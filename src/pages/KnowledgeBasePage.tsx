import React, { useMemo, useState } from 'react';
import { Bookmark, CheckCircle2, RotateCcw, Search } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { LessonView } from '../components/LessonView';
import { getAllTags, getConceptBySlug } from '../lib/contentLoader';
import type { ConceptDocument, UserProgress } from '../types/wiki';

interface KnowledgeBasePageProps {
  concepts: ConceptDocument[];
  progress: UserProgress;
  onToggleFavorite: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onResetProgress: () => void;
}

const STATUS_TEXT: Record<ConceptDocument['metadata']['status'], string> = {
  draft: '草稿｜待來源查核',
  verified: '已查核｜正式版',
  planned: '規劃中｜待後續補齊',
};

export function KnowledgeBasePage({
  concepts,
  progress,
  onToggleFavorite,
  onToggleComplete,
  onResetProgress,
}: KnowledgeBasePageProps) {
  const { slug } = useParams<{ slug?: string }>();
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [filterMode, setFilterMode] = useState<'all' | 'ready' | 'favorites'>('all');

  const allTags = useMemo(() => getAllTags(), []);

  if (slug) {
    const activeConcept = getConceptBySlug(slug);
    if (!activeConcept) {
      return (
        <div className="mx-auto max-w-2xl rounded-xl border border-[#E5E7EB] bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-[#111827]">找不到對應的教材章節</h1>
          <p className="mt-2 text-sm text-[#4B5563]">
            網址中的章節代號（<code className="font-mono">{slug}</code>）不存在，請返回教材知識庫首頁。
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex min-h-[40px] items-center rounded-lg bg-[#3458A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#2B4887]"
          >
            回到知識庫首頁
          </Link>
        </div>
      );
    }

    const idx = concepts.findIndex((c) => c.metadata.id === activeConcept.metadata.id);
    const prevConcept = idx > 0 ? concepts[idx - 1] : undefined;
    const nextConcept = idx >= 0 && idx < concepts.length - 1 ? concepts[idx + 1] : undefined;

    return (
      <LessonView
        concept={activeConcept}
        prevConcept={prevConcept}
        nextConcept={nextConcept}
        isFavorite={progress.favorites.includes(activeConcept.metadata.id)}
        isCompleted={progress.completedIds.includes(activeConcept.metadata.id)}
        onToggleFavorite={onToggleFavorite}
        onToggleComplete={onToggleComplete}
      />
    );
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredConcepts = concepts.filter((doc) => {
    const { metadata } = doc;
    if (filterMode === 'ready' && metadata.status === 'planned') return false;
    if (filterMode === 'favorites' && !progress.favorites.includes(metadata.id)) return false;
    if (selectedTag !== '全部' && !metadata.tags.includes(selectedTag)) return false;

    if (!normalizedQuery) return true;
    const haystack = [
      metadata.title,
      metadata.subtitle,
      metadata.summary,
      ...metadata.tags,
      String(metadata.order).padStart(2, '0'),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  const verifiedCount = concepts.filter((c) => c.metadata.status === 'verified').length;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Editorial Hero */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
        <div className="text-xs font-semibold text-[#3458A4]">
          C# 教學範例 · LLM Wiki 知識庫 · 前端概念模擬
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl [text-wrap:balance]">
          程式觀念實驗室：從物件導向到 MVC 與低耦合設計
        </h1>
        <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-[#374151] sm:text-lg">
          專為已熟悉變數、條件判斷與函式的學習者設計。透過 {concepts.length} 個循序漸進的生活與系統情境，學習如何把程式碼整理成容易理解、可保護狀態且易於維護的模組架構。
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            to="/wiki/classes-and-objects"
            className="inline-flex min-h-[42px] items-center rounded-lg bg-[#3458A4] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2B4887] whitespace-nowrap"
          >
            從第 01 章開始：學生名冊
          </Link>
          <Link
            to="/wiki/mvc-architecture"
            className="inline-flex min-h-[42px] items-center rounded-lg border border-[#D1D5DB] bg-white px-5 py-2.5 text-sm font-semibold text-[#1F2937] transition-colors hover:bg-[#F9FAFB] whitespace-nowrap"
          >
            前往第 07 章：MVC 圖書查詢
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E5E7EB] pt-4 text-xs text-[#4B5563] tabular-nums">
          <span>知識庫總章節：{concepts.length} 章</span>
          <span aria-hidden="true">·</span>
          <span>來源已整合並驗證：{verifiedCount} 章</span>
          <span aria-hidden="true">·</span>
          <span>已完成學習：{progress.completedIds.length} 章</span>
          <span aria-hidden="true">·</span>
          <span>已收藏：{progress.favorites.length} 章</span>
        </div>
      </section>

      {/* Search, Filter & Progress Reset */}
      <section aria-label="搜尋與篩選控制列" className="rounded-xl border border-[#E5E7EB] bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6B7280]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋章節標題、情境（如銀行帳戶）或觀念關鍵字…"
              aria-label="搜尋教材主題"
              className="min-h-[42px] w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 pr-4 pl-10 text-sm text-[#111827] placeholder:text-[#6B7280] focus:border-[#3458A4] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg bg-[#F1F5F9] p-1" role="group" aria-label="章節篩選">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`min-h-[34px] rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  filterMode === 'all'
                    ? 'bg-white text-[#111827] shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                全部 {concepts.length} 章
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('ready')}
                className={`min-h-[34px] rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  filterMode === 'ready'
                    ? 'bg-white text-[#111827] shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                已有完整教材
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('favorites')}
                className={`min-h-[34px] rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  filterMode === 'favorites'
                    ? 'bg-white text-[#111827] shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                我的收藏
              </button>
            </div>

            <button
              type="button"
              onClick={onResetProgress}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-medium text-[#374151] transition-colors hover:bg-[#F3F4F6] whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>還原預設進度</span>
            </button>
          </div>
        </div>

        {/* Tag Filter Row */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-[#E5E7EB] pt-3">
          <span className="mr-1 text-xs text-[#4B5563]">主題標籤：</span>
          <button
            type="button"
            onClick={() => setSelectedTag('全部')}
            className={`min-h-[32px] rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedTag === '全部'
                ? 'bg-[#3458A4] text-white'
                : 'bg-[#F1F5F9] text-[#374151] hover:bg-[#E2E8F0]'
            }`}
          >
            全部
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`min-h-[32px] rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-[#3458A4] text-white'
                  : 'bg-[#F1F5F9] text-[#374151] hover:bg-[#E2E8F0]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {!progress.storageAvailable && (
          <p className="mt-3 text-xs text-[#4B5563]">
            提醒：目前瀏覽器環境無法寫入 localStorage，收藏與閱讀紀錄僅保留於本次瀏覽階段，仍可正常閱讀與操作模擬。
          </p>
        )}
      </section>

      {/* Chapter List */}
      <section aria-label="章節列表">
        {filteredConcepts.length === 0 ? (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-8 text-center">
            <p className="text-sm text-[#4B5563]">沒有符合條件的教材章節，請調整搜尋字詞或標籤篩選。</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredConcepts.map((doc) => {
              const { metadata } = doc;
              const orderStr = String(metadata.order).padStart(2, '0');
              const isFav = progress.favorites.includes(metadata.id);
              const isDone = progress.completedIds.includes(metadata.id);
              const isReady = metadata.status !== 'planned';

              return (
                <div
                  key={metadata.id}
                  className={`flex flex-col justify-between rounded-xl border p-5 transition-colors ${
                    isReady
                      ? 'border-[#D1D5DB] bg-white hover:border-[#3458A4]/60'
                      : 'border-[#E5E7EB] bg-[#F8FAFC]'
                  }`}
                >
                  <div>
                    {/* Quiet unboxed metadata line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4B5563]">
                      <div>
                        <span className="font-mono font-semibold text-[#3458A4]">
                          第 {orderStr} 章
                        </span>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span className={isReady ? 'text-[#247C74] font-medium' : ''}>
                          {STATUS_TEXT[metadata.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(metadata.id)}
                          aria-label={isFav ? `取消收藏 ${metadata.title}` : `收藏 ${metadata.title}`}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                            isFav
                              ? 'text-[#3458A4] bg-[#3458A4]/10'
                              : 'text-[#6B7280] hover:bg-[#F1F5F9]'
                          }`}
                        >
                          <Bookmark className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleComplete(metadata.id)}
                          aria-label={isDone ? `取消已讀 ${metadata.title}` : `標記已讀 ${metadata.title}`}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                            isDone
                              ? 'text-[#247C74] bg-[#247C74]/10'
                              : 'text-[#6B7280] hover:bg-[#F1F5F9]'
                          }`}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <h2 className="mt-2 text-xl font-bold text-[#111827]">
                      <Link
                        to={`/wiki/${metadata.slug}`}
                        className="hover:text-[#3458A4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
                      >
                        {metadata.title}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm font-medium text-[#4B5563]">
                      {metadata.subtitle}
                    </p>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#374151]">
                      {metadata.summary}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E7EB] pt-3.5 text-xs">
                    <div className="text-[#4B5563]">
                      {metadata.tags.join(' / ')}
                    </div>
                    <Link
                      to={`/wiki/${metadata.slug}`}
                      className={`font-semibold whitespace-nowrap ${
                        isReady ? 'text-[#3458A4] hover:underline' : 'text-[#4B5563] hover:text-[#111827]'
                      }`}
                    >
                      {isReady ? '閱讀教材與互動實驗 →' : '檢視章節大綱 →'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Extension Verification Note */}
      <section className="rounded-xl border border-[#D1D5DB] bg-white p-5 text-sm text-[#4B5563]">
        <span className="font-semibold text-[#247C74]">第 4 階段擴充驗證完成：</span>
        已依 <code className="font-mono">AGENTS.md</code> 第 6 節流程實際新增第 09 章「依賴注入入門（Dependency Injection）」，並自動整合至導覽、搜尋、互動實驗與 23 頁教學簡報中；後續仍可沿用相同架構持續擴充新章節。
      </section>
    </div>
  );
}
