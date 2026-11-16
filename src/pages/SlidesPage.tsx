import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  List,
  Maximize2,
  Minimize2,
  Printer,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CodeBlock } from '../components/CodeBlock';
import { getExamplesForConcept, getSourceRegistry } from '../lib/contentLoader';
import { buildDeckSlides, type SlidePageData } from '../lib/slidesBuilder';
import type { ConceptDocument, CSharpExampleFile } from '../types/wiki';

interface SlidesPageProps {
  concepts: ConceptDocument[];
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if (target.isContentEditable) return true;
  if (target.closest('[data-disable-slide-keys="true"]')) return true;
  return false;
}

function SlideContentBody({ slide }: { slide: SlidePageData }) {
  const snippetAsExampleFile: CSharpExampleFile[] = slide.snippet
    ? [
        {
          id: slide.snippet.exampleId,
          fileName: `${slide.snippet.fileName}（第 ${slide.snippet.startLine}–${slide.snippet.endLine} 行）`,
          chapterId: slide.chapterId ?? '',
          code: slide.snippet.code,
          scopeKind: 'project-file',
          projectNote: slide.snippet.projectNote,
        },
      ]
    : [];

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs font-semibold text-[#3458A4]">{slide.groupLabel}</div>
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl [text-wrap:balance]">
          {slide.title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[#4B5563] sm:text-base">
          {slide.subtitle}
        </p>
      </div>

      {/* Metadata Traceability Row (shared IDs with Wiki) */}
      {(slide.chapterId || slide.sourceIds || slide.exampleIds) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-[#E5E7EB] py-2.5 text-xs text-[#4B5563]">
          {slide.chapterId && (
            <span>
              主題 ID：<code className="font-mono text-[#111827]">{slide.chapterId}</code>
            </span>
          )}
          {slide.sourceIds && slide.sourceIds.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                來源 ID：<code className="font-mono text-[#111827]">{slide.sourceIds.join(', ')}</code>
              </span>
            </>
          )}
        </div>
      )}

      {/* Roadmap Table */}
      {slide.tableRows && slide.tableRows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-xs font-semibold text-[#4B5563]">
                <th className="px-3 py-2">章節主題</th>
                <th className="px-3 py-2">情境</th>
                <th className="px-3 py-2">核心觀念摘要</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] bg-white">
              {slide.tableRows.map((row) => (
                <tr key={row.col1} className="align-top">
                  <td className="px-3 py-2 font-semibold text-[#111827] whitespace-nowrap">
                    {row.col1}
                  </td>
                  <td className="px-3 py-2 text-[#3458A4] whitespace-nowrap">{row.col2}</td>
                  <td className="px-3 py-2 text-[#374151]">{row.col3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Key Points */}
      {slide.bullets.length > 0 && (
        <ul className="space-y-2.5 text-base leading-relaxed text-[#1F2937]">
          {slide.bullets.map((pt, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1 font-mono text-xs font-semibold text-[#3458A4] tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Exact C# Snippet from examples/csharp */}
      {slide.snippet && snippetAsExampleFile.length > 0 && (
        <div data-disable-slide-keys="true">
          <CodeBlock
            files={snippetAsExampleFile}
            compileStatus={slide.snippet.compileStatus}
            title={`引用範例：${slide.snippet.exampleId}`}
          />
        </div>
      )}

      {/* Callout Box */}
      {slide.calloutTitle && slide.calloutBody && (
        <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-sm">
          <div className="text-xs font-semibold text-[#247C74]">{slide.calloutTitle}</div>
          <p className="mt-1 leading-relaxed text-[#374151]">{slide.calloutBody}</p>
        </div>
      )}
    </div>
  );
}

export function SlidesPage({ concepts }: SlidesPageProps) {
  const registry = useMemo(() => getSourceRegistry(), []);
  const slides = useMemo(
    () => buildDeckSlides(concepts, getExamplesForConcept, registry),
    [concepts, registry]
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [modeNotice, setModeNotice] = useState<string | null>(null);

  const currentSlide = slides[currentIdx] ?? slides[0];
  const progressPct = slides.length > 0 ? Math.round(((currentIdx + 1) / slides.length) * 100) : 0;

  const goPrev = useCallback(() => {
    setCurrentIdx((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIdx((i) => Math.min(slides.length - 1, i + 1));
  }, [slides.length]);

  // Keyboard ArrowLeft / ArrowRight navigation (safely ignores inputs, code copy boxes, modifiers)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      if (isEditableElement(e.target)) return;
      // Do not hijack arrow keys if a modal dialog (e.g. code zoom modal) is open
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goPrev, goNext]);

  // Sync native fullscreen change
  useEffect(() => {
    const onFsChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsNativeFullscreen(active);
      if (active) {
        setFocusMode(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Toggle body class for Focus Mode fallback
  useEffect(() => {
    if (focusMode) {
      document.body.classList.add('slides-focus-mode');
    } else {
      document.body.classList.remove('slides-focus-mode');
    }
    return () => document.body.classList.remove('slides-focus-mode');
  }, [focusMode]);

  const handleToggleFullscreen = async () => {
    setModeNotice(null);
    if (isNativeFullscreen) {
      try {
        await document.exitFullscreen();
      } catch {
        setIsNativeFullscreen(false);
      }
      return;
    }

    if (focusMode) {
      setFocusMode(false);
      return;
    }

    const canRequestFs =
      Boolean(document.fullscreenEnabled) &&
      typeof document.documentElement.requestFullscreen === 'function';

    if (canRequestFs) {
      try {
        await document.documentElement.requestFullscreen();
        return;
      } catch {
        // Fallback to focus mode below
      }
    }

    setFocusMode(true);
    setModeNotice('目前瀏覽器或預覽框架限制原生全螢幕權限，已自動切換為「專注滿版閱讀模式」（隱藏導覽列）。');
  };

  const handlePrint = () => {
    setModeNotice('已觸發列印預覽：版面會自動展開全部 21 頁投影片並隱藏操作按鈕，可直接另存 PDF。');
    try {
      window.print();
    } catch {
      setModeNotice('目前預覽框架限制呼叫列印視窗，請使用瀏覽器選單「列印 / 另存 PDF」或開啟獨立 HTML 簡報列印。');
    }
  };

  const expandedView = isNativeFullscreen || focusMode;

  return (
    <div className={expandedView ? 'mx-auto max-w-5xl py-4' : 'mx-auto max-w-5xl space-y-6'}>
      {/* Intro Header (Hidden in print & fullscreen/focus mode) */}
      {!expandedView && (
        <section className="no-print rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#3458A4]">
                Wiki 單一資料來源轉換 · 共 {slides.length} 頁教學簡報
              </div>
              <h1 className="mt-2 text-2xl font-bold text-[#111827] sm:text-3xl">
                教學簡報（由 Wiki 與 C# 範例即時同步產生）
              </h1>
              <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-[#4B5563]">
                與教材共用相同主題 ID、摘要、來源 ID 與 <code className="font-mono">examples/csharp/</code> 原始碼片段。支援鍵盤左右方向鍵翻頁（輸入框與程式碼編輯區不誤觸）、章節目錄跳轉、全螢幕／專注替代模式與另存 PDF 列印。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="./slides.html"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-2 text-xs font-semibold text-[#1F2937] hover:bg-[#F3F4F6] whitespace-nowrap"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>開啟獨立 HTML 簡報</span>
              </a>
              <a
                href="./slides.html"
                download="concept-lab-slides.html"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#3458A4]/40 bg-[#3458A4]/5 px-3.5 py-2 text-xs font-semibold text-[#3458A4] hover:bg-[#3458A4]/10 whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" />
                <span>下載 HTML 簡報檔</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Presentation Toolbar & Active Slide */}
      {currentSlide && (
        <section
          aria-label="教學簡報檢視器"
          className="no-print rounded-xl border border-[#D1D5DB] bg-white p-5 sm:p-8"
        >
          {/* Top Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-[#4B5563] tabular-nums">
              <span className="font-mono font-semibold text-[#3458A4]">
                第 {currentIdx + 1} / {slides.length} 頁
              </span>
              <span aria-hidden="true">·</span>
              <span>進度 {progressPct}%</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTocOpen((v) => !v)}
                aria-expanded={tocOpen}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F3F4F6]"
              >
                <List className="h-3.5 w-3.5" />
                <span>章節目錄</span>
              </button>

              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F3F4F6]"
              >
                {expandedView ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>離開滿版</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>全螢幕 / 專注檢視</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F3F4F6]"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>列印 / 另存 PDF</span>
              </button>

              {currentSlide.chapterSlug && (
                <Link
                  to={`/wiki/${currentSlide.chapterSlug}`}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#247C74] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1E665F]"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>回到對應完整教材</span>
                </Link>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
            <div
              className="h-full bg-[#3458A4] transition-all duration-150"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {modeNotice && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#374151]">
              <span>{modeNotice}</span>
              <button
                type="button"
                onClick={() => setModeNotice(null)}
                aria-label="關閉提示"
                className="text-[#4B5563] hover:text-[#111827]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Collapsible Slide TOC */}
          {tocOpen && (
            <nav
              aria-label="簡報頁次目錄"
              className="mt-4 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#111827]">
                  簡報頁次目錄（點擊跳轉）
                </span>
                <button
                  type="button"
                  onClick={() => setTocOpen(false)}
                  className="text-xs font-medium text-[#4B5563] hover:text-[#111827]"
                >
                  收合目錄
                </button>
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setCurrentIdx(idx);
                      setTocOpen(false);
                    }}
                    className={`rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                      idx === currentIdx
                        ? 'border-[#3458A4] bg-[#3458A4] font-semibold text-white'
                        : 'border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#EFF6FF]'
                    }`}
                  >
                    <span className="mr-1.5 font-mono tabular-nums">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="line-clamp-1">{s.title}</span>
                  </button>
                ))}
              </div>
            </nav>
          )}

          {/* Active Slide Main Area */}
          <div className="mt-6">
            <SlideContentBody slide={currentSlide} />
          </div>

          {/* Bottom Prev / Next & Keyboard Hint */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E7EB] pt-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentIdx === 0}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-medium text-[#1F2937] hover:bg-[#F3F4F6] disabled:opacity-45"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>上一頁</span>
            </button>

            <span className="text-xs text-[#4B5563]">
              可使用鍵盤 <kbd className="rounded border border-[#D1D5DB] bg-[#F8FAFC] px-1.5 py-0.5 font-mono">←</kbd>{' '}
              <kbd className="rounded border border-[#D1D5DB] bg-[#F8FAFC] px-1.5 py-0.5 font-mono">→</kbd> 切換頁次
            </span>

            <button
              type="button"
              onClick={goNext}
              disabled={currentIdx >= slides.length - 1}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg bg-[#3458A4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2B4887] disabled:opacity-45"
            >
              <span>下一頁</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* Print-Only Full 21-Page Deck (Expands automatically during window.print() / Save as PDF) */}
      <div className="print-only-deck" aria-hidden="true">
        {slides.map((s) => (
          <article key={s.id} className="print-slide-page">
            <div className="mb-3 flex items-center justify-between border-b border-[#E5E7EB] pb-2 text-xs text-[#4B5563]">
              <span>程式觀念實驗室｜教學簡報</span>
              <span className="font-mono">
                第 {s.pageNumber} / {slides.length} 頁
              </span>
            </div>
            <SlideContentBody slide={s} />
          </article>
        ))}
      </div>
    </div>
  );
}
