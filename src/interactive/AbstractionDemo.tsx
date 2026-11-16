import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  ABSTRACTION_CASES,
  type AbstractionSubject,
} from '../domain/abstractionSim';
import type { DemoComponentProps } from '../types/wiki';
import { CodeBlock } from '../components/CodeBlock';

export function AbstractionDemo({ examples }: DemoComponentProps) {
  const [selected, setSelected] = useState<AbstractionSubject>('shape-abstract');
  const [mobileView, setMobileView] = useState<'state' | 'code'>('state');

  const current = ABSTRACTION_CASES[selected];
  const keys: AbstractionSubject[] = [
    'shape-abstract',
    'drawable-interface',
    'circle-both',
    'label-interface-only',
  ];

  return (
    <section
      aria-label="抽象類別與介面互動概念模擬"
      className="my-6 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#E5E7EB] pb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">
            互動概念模擬：抽象類別 Shape 與介面 IDrawable 成員比較
          </h3>
          <p className="mt-1 text-sm text-[#4B5563]">
            本區為 TypeScript 概念模擬（非瀏覽器執行 C#）。點選四種角色，檢視各自能放的成員、需實作項目與現代 C# 規範。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSelected('shape-abstract')}
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] whitespace-nowrap shrink-0"
        >
          <RotateCcw className="h-4 w-4" />
          <span>重置預設</span>
        </button>
      </div>

      {/* Selector */}
      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="抽象結構檢視切換">
        {keys.map((k) => {
          const item = ABSTRACTION_CASES[k];
          const active = selected === k;
          return (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelected(k)}
              className={`min-h-[38px] rounded-lg border px-3.5 py-1.5 font-mono text-xs font-semibold transition-colors ${
                active
                  ? 'border-[#3458A4] bg-[#3458A4] text-white'
                  : 'border-[#E5E7EB] bg-[#F8FAFC] text-[#374151] hover:bg-[#EFF6FF]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
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
          能力與成員比較
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
            <div className="text-xs font-semibold text-[#3458A4]">{current.kindTitle}</div>
            <div className="mt-1 font-mono text-base font-bold text-[#111827]">{current.label}</div>

            <dl className="mt-4 space-y-2.5 text-sm">
              <div>
                <dt className="text-xs font-semibold text-[#4B5563]">實例欄位（狀態）</dt>
                <dd className="text-[#1F2937]">{current.canHaveInstanceFields}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#4B5563]">實例建構式</dt>
                <dd className="text-[#1F2937]">{current.canHaveConstructors}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#4B5563]">共用實作能力</dt>
                <dd className="text-[#1F2937]">{current.sharedImplementation}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 text-sm">
            <div className="text-xs font-semibold text-[#247C74]">實作者／子類別必須提供的成員</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-xs text-[#1F2937]">
              {current.requiredMembersToImplement.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <div className="mt-4 text-xs font-semibold text-[#4B5563]">設計用途</div>
            <p className="mt-1 leading-relaxed text-[#374151]">{current.suitableUseCase}</p>
          </div>
        </div>

        <div className={`min-w-0 lg:col-span-6 ${mobileView === 'state' ? 'hidden lg:block' : ''}`}>
          <CodeBlock
            files={examples}
            activeFileName="ShapesAndCapabilities.cs"
            highlightLines={current.highlightLines}
            title={current.label}
          />
        </div>
      </div>
    </section>
  );
}
