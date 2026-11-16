import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import {
  LOGGER_OPTIONS,
  type DiArchitectureMode,
  type FileProcessOutcome,
  type LoggerImplKind,
  simulateFileProcessingDI,
} from '../domain/dependencyInjectionSim';
import type { DemoComponentProps } from '../types/wiki';
import { CodeBlock } from '../components/CodeBlock';

export function DependencyInjectionDemo({ examples }: DemoComponentProps) {
  const [mode, setMode] = useState<DiArchitectureMode>('constructor-di');
  const [loggerKind, setLoggerKind] = useState<LoggerImplKind>('console');
  const [fileName, setFileName] = useState('orders_2026.csv');
  const [lineCountInput, setLineCountInput] = useState('120');
  const [mobileView, setMobileView] = useState<'state' | 'code'>('state');
  const [history, setHistory] = useState<FileProcessOutcome[]>(() => [
    simulateFileProcessingDI('constructor-di', 'console', 'orders_2026.csv', 120),
  ]);

  const parsedLines = Number.parseInt(lineCountInput, 10);
  const effectiveLines = Number.isNaN(parsedLines) ? 0 : parsedLines;
  const currentPreview = simulateFileProcessingDI(mode, loggerKind, fileName, effectiveLines);

  const handleRunProcess = (e: React.FormEvent) => {
    e.preventDefault();
    const outcome = simulateFileProcessingDI(mode, loggerKind, fileName, effectiveLines);
    setHistory((prev) => [outcome, ...prev].slice(0, 6));
  };

  const handleSwitchLogger = (nextKind: LoggerImplKind) => {
    setLoggerKind(nextKind);
    const outcome = simulateFileProcessingDI(mode, nextKind, fileName, effectiveLines);
    setHistory((prev) => [outcome, ...prev].slice(0, 6));
  };

  const handleSwitchMode = (nextMode: DiArchitectureMode) => {
    setMode(nextMode);
    const outcome = simulateFileProcessingDI(nextMode, loggerKind, fileName, effectiveLines);
    setHistory((prev) => [outcome, ...prev].slice(0, 6));
  };

  const handleReset = () => {
    setMode('constructor-di');
    setLoggerKind('console');
    setFileName('orders_2026.csv');
    setLineCountInput('120');
    setHistory([simulateFileProcessingDI('constructor-di', 'console', 'orders_2026.csv', 120)]);
  };

  return (
    <section
      aria-label="依賴注入互動概念模擬"
      className="my-6 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#E5E7EB] pb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">
            互動概念模擬：檔案處理服務替換紀錄方式（建構式注入實驗）
          </h3>
          <p className="mt-1 text-sm text-[#4B5563]">
            本區為 TypeScript 概念模擬（非瀏覽器執行 C#）。比較在類別內部寫死 <code className="font-mono">new</code> 與透過建構式注入 <code className="font-mono">IProcessingLogger</code> 的行為與修改差異。
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

      {/* Mode & Logger Controls */}
      <div className="mt-4 space-y-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#4B5563]">1. 依賴建立方式：</span>
          <div className="flex flex-wrap gap-1.5 rounded-lg bg-[#E2E8F0]/70 p-1">
            <button
              type="button"
              onClick={() => handleSwitchMode('constructor-di')}
              className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                mode === 'constructor-di'
                  ? 'bg-white text-[#247C74] shadow-xs'
                  : 'text-[#4B5563]'
              }`}
            >
              建構式注入：FileProcessor(IProcessingLogger logger)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('hardcoded')}
              className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                mode === 'hardcoded' ? 'bg-white text-[#B91C1C] shadow-xs' : 'text-[#4B5563]'
              }`}
            >
              硬編碼反例：內部寫死 new ConsoleAuditLogger()
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#4B5563]">2. 選擇欲注入的紀錄實作：</span>
          <div className="flex flex-wrap gap-2">
            {(['console', 'file', 'null'] as LoggerImplKind[]).map((kind) => {
              const meta = LOGGER_OPTIONS[kind];
              const isSelected = loggerKind === kind;
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => handleSwitchLogger(kind)}
                  className={`min-h-[36px] rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'border-[#3458A4] bg-[#3458A4]/10 text-[#3458A4]'
                      : 'border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
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
          組裝狀態與執行紀錄
        </button>
        <button
          type="button"
          onClick={() => setMobileView('code')}
          className={`flex-1 rounded-md py-2 text-xs font-semibold ${
            mobileView === 'code' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#4B5563]'
          }`}
        >
          對應 C# 程式
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:items-start">
        <div className={`space-y-4 lg:col-span-6 ${mobileView === 'code' ? 'hidden lg:block' : ''}`}>
          {/* Process File Form */}
          <form
            onSubmit={handleRunProcess}
            className="rounded-lg border border-[#E5E7EB] bg-white p-4 space-y-3"
          >
            <div className="text-xs font-semibold text-[#4B5563]">
              3. 輸入待處理檔案並觀察規則與紀錄結果
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs text-[#4B5563]" htmlFor="di-file-name">
                  檔案名稱
                </label>
                <input
                  id="di-file-name"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="輸入空白可測試驗證失敗情境"
                  className="mt-1 min-h-[38px] w-full rounded-lg border border-[#D1D5DB] px-3 py-1.5 font-mono text-xs text-[#111827] focus:border-[#3458A4] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#4B5563]" htmlFor="di-line-count">
                  資料行數
                </label>
                <input
                  id="di-line-count"
                  type="number"
                  value={lineCountInput}
                  onChange={(e) => setLineCountInput(e.target.value)}
                  className="mt-1 min-h-[38px] w-full rounded-lg border border-[#D1D5DB] px-3 py-1.5 font-mono text-xs text-[#111827] focus:border-[#3458A4] focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-[#6B7280]">
                {LOGGER_OPTIONS[loggerKind].description}
              </span>
              <button
                type="submit"
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#3458A4] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2B4887]"
              >
                <Play className="h-3.5 w-3.5" />
                <span>執行檔案處理</span>
              </button>
            </div>
          </form>

          {/* Composition & DIP vs DI Diagnostic Box */}
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-xs space-y-2.5">
            <div>
              <span className="font-semibold text-[#4B5563]">組裝端實際寫法（Program.cs）：</span>
              <div className="mt-1 rounded border border-[#E5E7EB] bg-white px-3 py-2 font-mono text-[#111827]">
                {currentPreview.compositionCall}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E5E7EB] pt-2.5">
              <span className="text-[#4B5563]">切換實作時核心處理類別是否需要修改：</span>
              <span
                className={`font-semibold ${
                  currentPreview.mode === 'hardcoded' && currentPreview.fileProcessorChanged
                    ? 'text-[#B91C1C]'
                    : currentPreview.mode === 'hardcoded'
                      ? 'text-[#B91C1C]'
                      : 'text-[#1F6E58]'
                }`}
              >
                {currentPreview.mode === 'hardcoded'
                  ? '必須修改 TightFileProcessor.cs（無法外部抽換）'
                  : 'FileProcessor.cs 零修改（僅替換注入實例）'}
              </span>
            </div>

            <p className="leading-relaxed text-[#374151]">{currentPreview.summary}</p>
            <p className="border-t border-[#E5E7EB] pt-2 leading-relaxed text-[#247C74] font-medium">
              {currentPreview.dipVsDiNote}
            </p>
          </div>

          {/* Runtime Log Trace */}
          <div className="rounded-lg border border-[#1E293B] bg-[#111827] p-4 font-mono text-xs text-[#E2E8F0]">
            <div className="mb-2 flex items-center justify-between text-[#94A3B8]">
              <span>最近一次執行輸出（{history[0]?.loggerClassName}）</span>
              <span>{history[0]?.success ? '狀態：處理成功' : '狀態：驗證攔截'}</span>
            </div>
            {history[0]?.logEntries.length ? (
              <ul className="space-y-1 text-[#F8FAFC]">
                {history[0].logEntries.map((entry, idx) => (
                  <li key={idx}>{entry}</li>
                ))}
              </ul>
            ) : (
              <div className="text-[#94A3B8]">
                （SilentNullLogger 刻意不產生任何主控台或檔案輸出，零副作用完成測試執行）
              </div>
            )}
          </div>
        </div>

        <div className={`min-w-0 lg:col-span-6 ${mobileView === 'state' ? 'hidden lg:block' : ''}`}>
          <CodeBlock
            files={examples}
            activeFileName={currentPreview.csharpFile}
            highlightLines={currentPreview.highlightLines}
            title={
              mode === 'hardcoded'
                ? '硬編碼依賴反例'
                : `建構式注入（${LOGGER_OPTIONS[loggerKind].className}）`
            }
          />
        </div>
      </div>
    </section>
  );
}
