import React, { useMemo, useState } from 'react';
import { RotateCcw, Search, SkipBack, SkipForward } from 'lucide-react';
import { buildMvcRequestTrace } from '../domain/mvcBooksSim';
import type { DemoComponentProps } from '../types/wiki';
import { CodeBlock } from '../components/CodeBlock';

export function MvcBooksDemo({ examples }: DemoComponentProps) {
  const [draftKeyword, setDraftKeyword] = useState('MVC');
  const [submittedKeyword, setSubmittedKeyword] = useState('MVC');
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'state' | 'code'>('state');

  const trace = useMemo(
    () => buildMvcRequestTrace(submittedKeyword),
    [submittedKeyword]
  );

  const currentStep = trace.steps[stepIndex] ?? trace.steps[0];
  const selectedBook = trace.results.find((b) => b.id === selectedBookId) ?? trace.results[0] ?? null;

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedKeyword(draftKeyword);
    setSelectedBookId(null);
    setStepIndex(0);
  };

  const handleReset = () => {
    setDraftKeyword('MVC');
    setSubmittedKeyword('MVC');
    setSelectedBookId(null);
    setStepIndex(0);
  };

  return (
    <section
      aria-label="MVC 圖書查詢請求流程模擬"
      className="my-6 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#E5E7EB] pb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">
            互動概念模擬：圖書查詢（ASP.NET Core MVC 請求追蹤）
          </h3>
          <p className="mt-1 text-sm text-[#4B5563]">
            本區為 TypeScript 概念模擬（非瀏覽器執行 ASP.NET Core）。輸入關鍵字發送模擬查詢，逐步追蹤 Controller、Model 與 View 的協作。
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] whitespace-nowrap shrink-0"
        >
          <RotateCcw className="h-4 w-4" />
          <span>重置預設</span>
        </button>
      </div>

      {/* Request Form + Quick Keywords */}
      <form
        onSubmit={handleSendRequest}
        className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5"
      >
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              value={draftKeyword}
              onChange={(e) => setDraftKeyword(e.target.value)}
              placeholder="輸入書名或分類（如 C#、MVC、設計、或空白查全部）"
              aria-label="圖書查詢關鍵字"
              className="min-h-[40px] w-full rounded-lg border border-[#D1D5DB] bg-white py-2 pr-3 pl-9 text-sm text-[#111827] focus:border-[#3458A4] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="min-h-[40px] rounded-lg bg-[#3458A4] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2B4887] whitespace-nowrap"
          >
            發送模擬請求
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[#4B5563]">常用測試：</span>
          {['MVC', 'C#', '不存在的書', ''].map((kw) => (
            <button
              key={kw || 'all'}
              type="button"
              onClick={() => {
                setDraftKeyword(kw);
                setSubmittedKeyword(kw);
                setSelectedBookId(null);
                setStepIndex(0);
              }}
              className="min-h-[32px] rounded border border-[#D1D5DB] bg-white px-2.5 py-1 font-medium text-[#374151] hover:bg-[#EFF6FF]"
            >
              {kw === '' ? '全部圖書' : kw}
            </button>
          ))}
        </div>
      </form>

      {/* Step Navigation */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="MVC 請求階段步驟">
          {trace.steps.map((s) => (
            <button
              key={s.stepIndex}
              type="button"
              onClick={() => setStepIndex(s.stepIndex)}
              className={`min-h-[34px] rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                stepIndex === s.stepIndex
                  ? 'border-[#3458A4] bg-[#3458A4] text-white'
                  : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F8FAFC]'
              }`}
            >
              {s.activeLayer}（步驟 {s.stepIndex + 1}）
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0}
            className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-[#D1D5DB] bg-white px-3 py-1 text-xs font-medium text-[#1F2937] disabled:opacity-45"
          >
            <SkipBack className="h-3.5 w-3.5" />
            <span>上一步</span>
          </button>
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.min(trace.steps.length - 1, i + 1))}
            disabled={stepIndex >= trace.steps.length - 1}
            className="inline-flex min-h-[36px] items-center gap-1 rounded-lg bg-[#247C74] px-3 py-1 text-xs font-semibold text-white disabled:opacity-45"
          >
            <span>下一步</span>
            <SkipForward className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Tab */}
      <div className="mt-4 flex gap-1 rounded-lg bg-[#F1F5F9] p-1 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileView('state')}
          className={`flex-1 rounded-md py-2 text-xs font-semibold ${
            mobileView === 'state' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#4B5563]'
          }`}
        >
          請求狀態與 View 畫面
        </button>
        <button
          type="button"
          onClick={() => setMobileView('code')}
          className={`flex-1 rounded-md py-2 text-xs font-semibold ${
            mobileView === 'code' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#4B5563]'
          }`}
        >
          對應 MVC 檔案
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:items-start">
        <div className={`space-y-4 lg:col-span-6 ${mobileView === 'code' ? 'hidden lg:block' : ''}`}>
          {/* Active Step Card */}
          <div className="rounded-lg border border-[#3458A4]/30 bg-[#F8FAFC] p-4">
            <div className="text-xs font-semibold text-[#3458A4]">
              {currentStep.stageName} · 檔案 {currentStep.csharpFile}
            </div>
            <div className="mt-1 text-sm font-bold text-[#111827]">{currentStep.summary}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-[#374151]">{currentStep.detail}</p>
          </div>

          {/* Model Query Result Selection */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#4B5563]">
                {stepIndex >= 2
                  ? `Model 查詢結果（共 ${trace.results.length} 筆）`
                  : '等待抵達 Model 查詢步驟（請點擊「下一步」）'}
              </span>
              <span className="font-mono text-[#6B7280]">keyword=&quot;{submittedKeyword}&quot;</span>
            </div>

            {stepIndex >= 2 && (
              <div className="mt-3 space-y-2">
                {trace.results.length === 0 ? (
                  <p className="text-xs text-[#B91C1C]">
                    找不到符合「{submittedKeyword}」的館藏圖書。
                  </p>
                ) : (
                  trace.results.map((book) => {
                    const isPicked = selectedBook?.id === book.id;
                    return (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => setSelectedBookId(book.id)}
                        className={`w-full rounded border px-3 py-2 text-left text-xs transition-colors ${
                          isPicked
                            ? 'border-[#247C74] bg-[#247C74]/5 text-[#111827]'
                            : 'border-[#E5E7EB] bg-[#F8FAFC] text-[#374151]'
                        }`}
                      >
                        <span className="font-mono font-semibold text-[#3458A4]">{book.id}</span>
                        <span className="mx-1.5">·</span>
                        <span className="font-semibold">{book.title}</span>
                        <span className="ml-2 text-[#6B7280]">
                          （{book.author} / {book.category}）
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Simulated Razor View Output */}
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4">
            <div className="text-xs font-semibold text-[#247C74]">
              模擬瀏覽器呈現結果（Views/Books/Index.cshtml）
            </div>
            {stepIndex < 3 ? (
              <p className="mt-2 text-xs text-[#6B7280]">
                尚未進入第 4 步 View 渲染階段，目前伺服器仍在處理請求。
              </p>
            ) : (
              <div className="mt-2 rounded border border-[#E5E7EB] bg-white p-3 text-xs text-[#1F2937]">
                <div className="font-bold">圖書查詢結果</div>
                {trace.results.length === 0 ? (
                  <p className="mt-1 text-[#4B5563]">找不到符合「{submittedKeyword}」的館藏圖書。</p>
                ) : (
                  <ul className="mt-1.5 list-disc space-y-1 pl-4">
                    {trace.results.map((b) => (
                      <li key={b.id} className={selectedBook?.id === b.id ? 'font-semibold text-[#3458A4]' : ''}>
                        {b.id} · {b.title}（{b.author} / {b.category}）
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={`min-w-0 lg:col-span-6 ${mobileView === 'state' ? 'hidden lg:block' : ''}`}>
          <CodeBlock
            files={examples}
            activeFileName={currentStep.csharpFile}
            highlightLines={currentStep.highlightLines}
            title={`步驟 ${stepIndex + 1}：${currentStep.activeLayer}`}
          />
        </div>
      </div>
    </section>
  );
}
