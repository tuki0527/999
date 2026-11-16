import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  type EngineChoice,
  type VehicleDesignMode,
  evaluateVehicleDesign,
} from '../domain/vehicleDesignSim';
import type { DemoComponentProps } from '../types/wiki';
import { CodeBlock } from '../components/CodeBlock';

export function VehicleDesignDemo({ examples }: DemoComponentProps) {
  const [mode, setMode] = useState<VehicleDesignMode>('inheritance');
  const [engineChoice, setEngineChoice] = useState<EngineChoice>('petrol');
  const [mobileView, setMobileView] = useState<'state' | 'code'>('state');

  const view = evaluateVehicleDesign(mode, engineChoice);

  const handleReset = () => {
    setMode('inheritance');
    setEngineChoice('petrol');
  };

  return (
    <section
      aria-label="繼承與組合互動概念模擬"
      className="my-6 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#E5E7EB] pb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">
            互動概念模擬：交通工具與引擎（is-a 繼承 vs has-a 組合）
          </h3>
          <p className="mt-1 text-sm text-[#4B5563]">
            本區為 TypeScript 概念模擬（非瀏覽器執行 C#）。切換兩種設計方式，觀察類別關係、動力替換彈性與對應 C# 程式。
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

      {/* Mode Switch */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
        <div className="flex flex-wrap gap-1.5 rounded-lg bg-[#E2E8F0]/70 p-1" role="group" aria-label="設計模式切換">
          <button
            type="button"
            onClick={() => setMode('inheritance')}
            className={`min-h-[38px] rounded-md px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              mode === 'inheritance'
                ? 'bg-white text-[#3458A4] shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            方式 A：汽車繼承交通工具（is-a）
          </button>
          <button
            type="button"
            onClick={() => setMode('composition')}
            className={`min-h-[38px] rounded-md px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              mode === 'composition'
                ? 'bg-white text-[#247C74] shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            方式 B：汽車持有引擎（has-a 組合）
          </button>
        </div>

        {mode === 'composition' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#4B5563]">抽換引擎零件：</span>
            <button
              type="button"
              onClick={() => setEngineChoice('petrol')}
              className={`min-h-[36px] rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                engineChoice === 'petrol'
                  ? 'border-[#3458A4] bg-[#3458A4]/10 text-[#3458A4]'
                  : 'border-[#D1D5DB] bg-white text-[#374151]'
              }`}
            >
              1.8L 汽油引擎
            </button>
            <button
              type="button"
              onClick={() => setEngineChoice('electric')}
              className={`min-h-[36px] rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                engineChoice === 'electric'
                  ? 'border-[#247C74] bg-[#247C74]/10 text-[#247C74]'
                  : 'border-[#D1D5DB] bg-white text-[#374151]'
              }`}
            >
              150kW 純電馬達
            </button>
          </div>
        )}
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
          結構關係與取捨
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
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4">
            <div className="font-mono text-xs font-semibold text-[#3458A4]">
              {view.relationshipLabel}
            </div>
            <div className="mt-1 text-base font-bold text-[#111827]">{view.title}</div>

            {/* Visual relationship structure */}
            <div className="mt-3 rounded-lg border border-[#E5E7EB] bg-white p-3.5 text-xs">
              {mode === 'inheritance' ? (
                <div className="space-y-2 font-mono text-[#1F2937]">
                  <div>基底類別：VehicleBase（Brand）</div>
                  <div className="pl-4 text-[#3458A4]">└── 繼承：SedanByInheritance（HorsePower 寫死在型別）</div>
                </div>
              ) : (
                <div className="space-y-2 font-mono text-[#1F2937]">
                  <div>組合類別：CarWithComposition（Brand + _engine）</div>
                  <div className="pl-4 text-[#247C74]">
                    └── 持有介面 IPowerUnit → 目前實作：{engineChoice === 'petrol' ? 'PetrolEngine' : 'ElectricMotor'}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 text-sm">
            <div className="font-semibold text-[#111827]">選擇理由</div>
            <p className="mt-1 leading-relaxed text-[#374151]">{view.rationale}</p>
            <div className="mt-3 font-semibold text-[#111827]">設計取捨與代價</div>
            <p className="mt-1 leading-relaxed text-[#374151]">{view.tradeOff}</p>
          </div>

          <div className="rounded-lg border border-[#1E293B] bg-[#111827] p-4 font-mono text-xs text-[#E2E8F0]">
            <div className="mb-1 text-[#94A3B8]">模擬輸出（Console.WriteLine）</div>
            <div>{view.outputLine}</div>
          </div>
        </div>

        <div className={`min-w-0 lg:col-span-6 ${mobileView === 'state' ? 'hidden lg:block' : ''}`}>
          <CodeBlock
            files={examples}
            activeFileName={view.csharpFile}
            highlightLines={view.highlightLines}
            title="依設計方式切換"
          />
        </div>
      </div>
    </section>
  );
}
