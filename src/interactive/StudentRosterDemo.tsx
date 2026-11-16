import React, { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { createInitialStudentState } from '../domain/studentRosterSim';
import type { DemoComponentProps } from '../types/wiki';
import { CodeBlock } from '../components/CodeBlock';

export function StudentRosterDemo({ examples }: DemoComponentProps) {
  const [scoreA, setScoreA] = useState(78);
  const [scoreB, setScoreB] = useState(54);
  const [updatedScoreB, setUpdatedScoreB] = useState(82);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobileView, setMobileView] = useState<'state' | 'code'>('state');

  const steps = useMemo(
    () => createInitialStudentState(scoreA, scoreB, updatedScoreB),
    [scoreA, scoreB, updatedScoreB]
  );

  const currentStep = steps[stepIndex] ?? steps[0];

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, steps.length]);

  const handleReset = () => {
    setIsPlaying(false);
    setScoreA(78);
    setScoreB(54);
    setUpdatedScoreB(82);
    setStepIndex(0);
  };

  const renderStudentCard = (
    student: typeof currentStep.studentA,
    accentLabel: string
  ) => {
    const isPass = student.score >= 60;
    return (
      <div
        className={`rounded-lg border p-4 transition-colors ${
          student.created
            ? 'border-[#247C74]/40 bg-white'
            : 'border-dashed border-[#D1D5DB] bg-[#F8FAFC]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-mono text-sm font-semibold text-[#111827]">
            {student.varName}
          </div>
          <span className="font-mono text-xs text-[#4B5563]">
            {student.memoryAddr}
          </span>
        </div>

        {student.created ? (
          <div className="mt-3 space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#4B5563]">學號 StudentId</span>
              <span className="font-mono font-medium text-[#111827]">
                {student.studentId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4B5563]">姓名 Name</span>
              <span className="font-medium text-[#111827]">{student.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4B5563]">內部欄位 _score</span>
              <span className="font-mono font-semibold text-[#3458A4] tabular-nums">
                {student.score} 分（{isPass ? '及格' : '需加強'}）
              </span>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xs text-[#6B7280]">
            {accentLabel}：尚未呼叫 <code className="font-mono">new Student(...)</code> 建立實例
          </p>
        )}
      </div>
    );
  };

  return (
    <section
      aria-label="學生名冊互動概念模擬"
      className="my-6 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6"
    >
      {/* Header & Honest Simulation Notice */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#E5E7EB] pb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">
            互動概念模擬：學生名冊（物件獨立狀態觀察）
          </h3>
          <p className="mt-1 text-sm text-[#4B5563]">
            本區為 TypeScript 概念模擬（非瀏覽器執行 C#），用來對照兩位學生物件的狀態變化與右側 C# 程式行號。
          </p>
        </div>
        <span className="font-mono text-xs text-[#3458A4] tabular-nums">
          步驟 {stepIndex + 1} / {steps.length}
        </span>
      </div>

      {/* Controls Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (stepIndex >= steps.length - 1) setStepIndex(0);
              setIsPlaying((p) => !p);
            }}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#3458A4] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2B4887] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isPlaying ? '暫停播放' : '播放步驟'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setStepIndex((p) => Math.max(0, p - 1));
            }}
            disabled={stepIndex === 0}
            className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm font-medium text-[#1F2937] transition-colors hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
          >
            <SkipBack className="h-4 w-4" />
            <span>上一步</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setStepIndex((p) => Math.min(steps.length - 1, p + 1));
            }}
            disabled={stepIndex >= steps.length - 1}
            className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm font-medium text-[#1F2937] transition-colors hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
          >
            <span>下一步</span>
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F3F4F6] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
        >
          <RotateCcw className="h-4 w-4" />
          <span>重置預設</span>
        </button>
      </div>

      {/* Parameter Customization */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="block rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2.5 text-xs">
          <span className="font-medium text-[#374151]">studentA 初始分數（林小安）</span>
          <input
            type="number"
            min={0}
            max={100}
            value={scoreA}
            onChange={(e) => setScoreA(Number(e.target.value) || 0)}
            className="mt-1.5 w-full rounded border border-[#D1D5DB] bg-white px-2.5 py-1.5 font-mono text-sm text-[#111827] tabular-nums focus:border-[#3458A4] focus:outline-none"
          />
        </label>
        <label className="block rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2.5 text-xs">
          <span className="font-medium text-[#374151]">studentB 初始分數（陳以樂）</span>
          <input
            type="number"
            min={0}
            max={100}
            value={scoreB}
            onChange={(e) => setScoreB(Number(e.target.value) || 0)}
            className="mt-1.5 w-full rounded border border-[#D1D5DB] bg-white px-2.5 py-1.5 font-mono text-sm text-[#111827] tabular-nums focus:border-[#3458A4] focus:outline-none"
          />
        </label>
        <label className="block rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2.5 text-xs">
          <span className="font-medium text-[#374151]">studentB.UpdateScore(...) 新分數</span>
          <input
            type="number"
            min={0}
            max={100}
            value={updatedScoreB}
            onChange={(e) => setUpdatedScoreB(Number(e.target.value) || 0)}
            className="mt-1.5 w-full rounded border border-[#D1D5DB] bg-white px-2.5 py-1.5 font-mono text-sm text-[#111827] tabular-nums focus:border-[#3458A4] focus:outline-none"
          />
        </label>
      </div>

      {/* Step selector strip */}
      <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="步驟快速跳轉">
        {steps.map((s) => {
          const active = s.stepIndex === stepIndex;
          return (
            <button
              key={s.stepIndex}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIndex(s.stepIndex);
              }}
              className={`min-h-[34px] rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4] ${
                active
                  ? 'border-[#3458A4] bg-[#3458A4]/10 text-[#3458A4]'
                  : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]'
              }`}
            >
              步驟 {s.stepIndex + 1}
            </button>
          );
        })}
      </div>

      {/* Mobile View Switch */}
      <div className="mt-4 flex gap-1 rounded-lg bg-[#F1F5F9] p-1 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileView('state')}
          className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors ${
            mobileView === 'state' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#4B5563]'
          }`}
        >
          觀察物件狀態
        </button>
        <button
          type="button"
          onClick={() => setMobileView('code')}
          className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors ${
            mobileView === 'code' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#4B5563]'
          }`}
        >
          對應 C# 程式碼
        </button>
      </div>

      {/* Desktop Split View */}
      <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:items-start">
        <div className={`space-y-4 lg:col-span-6 ${mobileView === 'code' ? 'hidden lg:block' : ''}`}>
          {/* Step Explanation */}
          <div className="rounded-lg border border-[#3458A4]/30 bg-[#F8FAFC] p-4">
            <div className="text-xs font-semibold text-[#3458A4]">
              目前步驟說明 · {currentStep.csharpFile}
            </div>
            <div className="mt-1 text-base font-semibold text-[#111827]">
              {currentStep.title}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-[#374151]">
              {currentStep.explanation}
            </p>
          </div>

          {/* Two Independent Objects */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {renderStudentCard(currentStep.studentA, '第一個實例')}
            {renderStudentCard(currentStep.studentB, '第二個實例')}
          </div>

          {/* Console Output */}
          <div className="rounded-lg border border-[#E5E7EB] bg-[#111827] p-4 text-[#E2E8F0]">
            <div className="mb-2 flex items-center justify-between text-xs text-[#94A3B8]">
              <span>模擬輸出結果（Console.WriteLine）</span>
              <span className="tabular-nums">{currentStep.consoleLines.length} 行</span>
            </div>
            {currentStep.consoleLines.length === 0 ? (
              <p className="font-mono text-xs text-[#64748B]">尚無輸出，請點擊「下一步」或「播放步驟」。</p>
            ) : (
              <div className="space-y-1 font-mono text-xs leading-relaxed">
                {currentStep.consoleLines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={`min-w-0 lg:col-span-6 ${mobileView === 'state' ? 'hidden lg:block' : ''}`}>
          <CodeBlock
            files={examples}
            activeFileName={currentStep.csharpFile}
            highlightLines={currentStep.highlightLines}
            title="與目前步驟連動"
          />
        </div>
      </div>
    </section>
  );
}
