import React, { useState } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';
import { ANIMAL_COLLECTION } from '../domain/polymorphismSim';
import type { DemoComponentProps } from '../types/wiki';
import { CodeBlock } from '../components/CodeBlock';

export function PolymorphismDemo({ examples }: DemoComponentProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [callMode, setCallMode] = useState<'override' | 'overload'>('override');
  const [executedIndices, setExecutedIndices] = useState<number[]>([0]);
  const [mobileView, setMobileView] = useState<'state' | 'code'>('state');

  const activeAnimal = ANIMAL_COLLECTION[selectedIndex] ?? ANIMAL_COLLECTION[0];

  const handleSelectAnimal = (idx: number) => {
    setSelectedIndex(idx);
    setExecutedIndices((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
  };

  const handleNextStep = () => {
    const next = (selectedIndex + 1) % ANIMAL_COLLECTION.length;
    handleSelectAnimal(next);
  };

  const handleRunAll = () => {
    setExecutedIndices(ANIMAL_COLLECTION.map((_, idx) => idx));
    setSelectedIndex(ANIMAL_COLLECTION.length - 1);
  };

  const handleReset = () => {
    setSelectedIndex(0);
    setCallMode('override');
    setExecutedIndices([0]);
  };

  return (
    <section
      aria-label="多型互動概念模擬"
      className="my-6 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#E5E7EB] pb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">
            互動概念模擬：動物發聲（共同型別 List&lt;Animal&gt; 與動態分派）
          </h3>
          <p className="mt-1 text-sm text-[#4B5563]">
            本區為 TypeScript 概念模擬（非瀏覽器執行 C#）。點選集合中的不同物件，觀察宣告型別相同但實際執行的 override 版本。
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

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#3458A4] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2B4887]"
          >
            <SkipForward className="h-4 w-4" />
            <span>巡迴下一個 Animal</span>
          </button>
          <button
            type="button"
            onClick={handleRunAll}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1F2937] hover:bg-[#F3F4F6]"
          >
            <Play className="h-4 w-4" />
            <span>一次呼叫全部物件</span>
          </button>
        </div>

        <div className="flex rounded-lg bg-[#E2E8F0]/70 p-1" role="group" aria-label="呼叫模式比較">
          <button
            type="button"
            onClick={() => setCallMode('override')}
            className={`min-h-[34px] rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              callMode === 'override' ? 'bg-white text-[#3458A4] shadow-xs' : 'text-[#4B5563]'
            }`}
          >
            animal.Speak()（Override 動態分派）
          </button>
          <button
            type="button"
            onClick={() => setCallMode('overload')}
            className={`min-h-[34px] rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              callMode === 'overload' ? 'bg-white text-[#247C74] shadow-xs' : 'text-[#4B5563]'
            }`}
          >
            animal.Speak(2)（Overload 多載）
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
          觀察物件與派發
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
          {/* Collection Items */}
          <div>
            <div className="mb-2 text-xs font-semibold text-[#4B5563]">
              點選 List&lt;Animal&gt; 中的物件元素：
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {ANIMAL_COLLECTION.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectAnimal(idx)}
                    className={`rounded-lg border p-3 text-left transition-colors ${
                      isSelected
                        ? 'border-[#3458A4] bg-[#3458A4]/5'
                        : 'border-[#E5E7EB] bg-white hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-[#4B5563]">
                      <span className="font-mono">[{idx}] 宣告：{item.declaredType}</span>
                      <span className="font-mono font-semibold text-[#247C74]">
                        實際：{item.runtimeType}
                      </span>
                    </div>
                    <div className="mt-1 text-sm font-bold text-[#111827]">{item.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dispatch Explanation */}
          <div className="rounded-lg border border-[#3458A4]/30 bg-[#F8FAFC] p-4 text-sm">
            <div className="text-xs font-semibold text-[#3458A4]">
              {callMode === 'override'
                ? `執行期動態分派 → ${activeAnimal.runtimeType}.Speak()`
                : `編譯期選擇多載簽章 → Animal.Speak(int) 再內部動態呼叫 Speak()`}
            </div>
            <p className="mt-1.5 leading-relaxed text-[#374151]">
              {callMode === 'override'
                ? activeAnimal.dispatchNote
                : 'Overload（多載）在編譯期就依參數型別與數量決定呼叫 Speak(int)；而 Speak(int) 內部轉呼叫 virtual Speak() 時，才會於執行期再次動態派發到對應動物。'}
            </p>
          </div>

          {/* Simulated Output */}
          <div className="rounded-lg border border-[#1E293B] bg-[#111827] p-4 font-mono text-xs text-[#E2E8F0]">
            <div className="mb-2 text-[#94A3B8]">模擬執行輸出（已呼叫項目）</div>
            <div className="space-y-1">
              {executedIndices.map((idx) => {
                const item = ANIMAL_COLLECTION[idx];
                return (
                  <div key={item.id} className={idx === selectedIndex ? 'text-[#93C5FD]' : ''}>
                    {callMode === 'override' ? item.soundOutput : item.overloadOutput}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`min-w-0 lg:col-span-6 ${mobileView === 'state' ? 'hidden lg:block' : ''}`}>
          <CodeBlock
            files={examples}
            activeFileName="AnimalChorus.cs"
            highlightLines={
              callMode === 'override'
                ? activeAnimal.overrideLineRange
                : [11, 12, ...activeAnimal.overrideLineRange]
            }
            title={`實際分派目標：${activeAnimal.runtimeType}`}
          />
        </div>
      </div>
    </section>
  );
}
