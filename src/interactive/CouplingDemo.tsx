import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  type CouplingArchitecture,
  type CouplingScenario,
  evaluateCouplingImpact,
} from '../domain/couplingSim';
import type { DemoComponentProps } from '../types/wiki';
import { CodeBlock } from '../components/CodeBlock';

export function CouplingDemo({ examples }: DemoComponentProps) {
  const [arch, setArch] = useState<CouplingArchitecture>('tight');
  const [scenario, setScenario] = useState<CouplingScenario>('initial-email');
  const [mobileView, setMobileView] = useState<'state' | 'code'>('state');

  const report = evaluateCouplingImpact(arch, scenario);

  const handleReset = () => {
    setArch('tight');
    setScenario('initial-email');
  };

  return (
    <section
      aria-label="耦合與內聚互動概念模擬"
      className="my-6 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#E5E7EB] pb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">
            互動概念模擬：訂單計算與通知（切換設計與需求變更範圍）
          </h3>
          <p className="mt-1 text-sm text-[#4B5563]">
            本區為 TypeScript 概念模擬（非瀏覽器執行 C#）。比較直接依賴 EmailSender 與透過 INotifier 注入的實際修改範圍。
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

      {/* Architecture + Requirement Scenario Controls */}
      <div className="mt-4 space-y-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#4B5563]">1. 選擇程式架構：</span>
          <div className="flex flex-wrap gap-1.5 rounded-lg bg-[#E2E8F0]/70 p-1">
            <button
              type="button"
              onClick={() => setArch('tight')}
              className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                arch === 'tight' ? 'bg-white text-[#B91C1C] shadow-xs' : 'text-[#4B5563]'
              }`}
            >
              緊密耦合：直接 new EmailSender()
            </button>
            <button
              type="button"
              onClick={() => setArch('decoupled')}
              className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                arch === 'decoupled' ? 'bg-white text-[#247C74] shadow-xs' : 'text-[#4B5563]'
              }`}
            >
              低耦合高內聚：依賴 INotifier 並拆出計算
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#4B5563]">2. 模擬需求變更：</span>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['initial-email', '初版：寄送 Email 通知'],
                ['switch-to-sms', '新需求：改用簡訊（SMS）通知'],
                ['add-audit-channel', '新需求：同時發送 Email＋簡訊'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setScenario(key)}
                className={`min-h-[34px] rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                  scenario === key
                    ? 'border-[#3458A4] bg-[#3458A4]/10 text-[#3458A4]'
                    : 'border-[#D1D5DB] bg-white text-[#374151]'
                }`}
              >
                {label}
              </button>
            ))}
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
          職責與修改範圍
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
          {/* Responsibility Breakdown */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
            <div className="text-xs font-semibold text-[#4B5563]">職責分工檢視</div>
            <div className="mt-2.5 space-y-2">
              {report.responsibilities.map((item) => (
                <div
                  key={item.moduleName}
                  className="rounded border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-xs"
                >
                  <span className="font-mono font-semibold text-[#111827]">{item.moduleName}</span>
                  <span className="mx-1.5 text-[#9CA3AF]">—</span>
                  <span className="text-[#374151]">{item.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modification Impact */}
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-sm">
            <div className="font-semibold text-[#B91C1C]">本次實際必須修改或新增的檔案：</div>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-[#1F2937]">
              {report.touchedModules.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>

            <div className="mt-3 font-semibold text-[#1F6E58]">可保持完全不動的模組：</div>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-[#1F2937]">
              {report.untouchedModules.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>

            <p className="mt-3 border-t border-[#E5E7EB] pt-3 text-xs leading-relaxed text-[#374151]">
              {report.explanation}
            </p>
          </div>

          <div className="rounded-lg border border-[#1E293B] bg-[#111827] p-4 font-mono text-xs text-[#E2E8F0]">
            <div className="mb-1 text-[#94A3B8]">模擬執行輸出</div>
            <div>{report.simulatedOutput}</div>
          </div>
        </div>

        <div className={`min-w-0 lg:col-span-6 ${mobileView === 'state' ? 'hidden lg:block' : ''}`}>
          <CodeBlock
            files={examples}
            activeFileName={report.csharpFile}
            highlightLines={report.highlightLines}
            title={arch === 'tight' ? '緊密耦合反例' : '低耦合介面依賴'}
          />
        </div>
      </div>
    </section>
  );
}
