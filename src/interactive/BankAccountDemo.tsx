import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Play, RotateCcw } from 'lucide-react';
import {
  type BankActionType,
  createInitialBankAccount,
  executeBankOperation,
  formatCents,
  parseDecimalToCents,
} from '../domain/bankAccountSim';
import type { DemoComponentProps } from '../types/wiki';
import { CodeBlock } from '../components/CodeBlock';

export function BankAccountDemo({ examples }: DemoComponentProps) {
  const [account, setAccount] = useState(createInitialBankAccount);
  const [action, setAction] = useState<BankActionType>('deposit');
  const [amountInput, setAmountInput] = useState('250.50');
  const [inputError, setInputError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'state' | 'code'>('state');

  const latestOutcome = account.history[0] ?? null;

  const handleExecute = (chosenAction: BankActionType, rawValue: string) => {
    const cents = parseDecimalToCents(rawValue);
    if (cents === null) {
      setInputError('請輸入最多兩位小數的數字，例如 250.50 或 -100。');
      return;
    }
    setInputError(null);
    const { nextState } = executeBankOperation(account, chosenAction, cents);
    setAccount(nextState);
  };

  const handleRunExpectedSequence = () => {
    setInputError(null);
    let state = createInitialBankAccount();
    state = executeBankOperation(state, 'deposit', 25050).nextState;
    state = executeBankOperation(state, 'withdraw', 200000).nextState;
    state = executeBankOperation(state, 'deposit', -10000).nextState;
    state = executeBankOperation(state, 'withdraw', 35025).nextState;
    setAccount(state);
  };

  const handleReset = () => {
    setInputError(null);
    setAction('deposit');
    setAmountInput('250.50');
    setAccount(createInitialBankAccount());
  };

  return (
    <section
      aria-label="銀行帳戶封裝互動概念模擬"
      className="my-6 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#E5E7EB] pb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">
            互動概念模擬：銀行帳戶（封裝規則與精度把關）
          </h3>
          <p className="mt-1 text-sm text-[#4B5563]">
            本區為 TypeScript 概念模擬（以整數分計算避免浮點誤差，對應 C# <code className="font-mono">decimal</code>），測試非法輸入時餘額會保持不變。
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-1.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F3F4F6] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
        >
          <RotateCcw className="h-4 w-4" />
          <span>重置預設</span>
        </button>
      </div>

      {/* Mobile Tab Switch */}
      <div className="mt-4 flex gap-1 rounded-lg bg-[#F1F5F9] p-1 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileView('state')}
          className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors ${
            mobileView === 'state' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#4B5563]'
          }`}
        >
          操作與帳戶狀態
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

      <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:items-start">
        {/* Left: Controls, State, Outcome */}
        <div className={`space-y-4 lg:col-span-6 ${mobileView === 'code' ? 'hidden lg:block' : ''}`}>
          {/* BankAccount State Card */}
          <div className="rounded-lg border border-[#247C74]/40 bg-[#F8FAFC] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-semibold text-[#247C74]">
                  受封裝保護的物件狀態（BankAccount）
                </div>
                <div className="mt-0.5 text-sm text-[#374151]">
                  帳號 <span className="font-mono">{account.accountNumber}</span> · 戶名 {account.ownerName}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#4B5563]">private _balance</div>
                <div className="font-mono text-2xl font-bold text-[#111827] tabular-nums">
                  {formatCents(account.balanceCents)} 元
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Action Form */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg bg-[#F1F5F9] p-1" role="group" aria-label="交易類型選擇">
                <button
                  type="button"
                  onClick={() => setAction('deposit')}
                  className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    action === 'deposit'
                      ? 'bg-white text-[#3458A4] shadow-xs'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  存款 Deposit
                </button>
                <button
                  type="button"
                  onClick={() => setAction('withdraw')}
                  className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    action === 'withdraw'
                      ? 'bg-white text-[#3458A4] shadow-xs'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  提款 Withdraw
                </button>
              </div>

              <div className="flex flex-1 items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  aria-label="交易金額"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="輸入金額，如 250.50"
                  className="min-h-[40px] w-full min-w-[120px] rounded-lg border border-[#D1D5DB] px-3 py-2 font-mono text-sm text-[#111827] tabular-nums focus:border-[#3458A4] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleExecute(action, amountInput)}
                  className="min-h-[40px] rounded-lg bg-[#3458A4] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2B4887] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
                >
                  執行方法
                </button>
              </div>
            </div>

            {inputError && (
              <p className="mt-2 text-xs text-[#B91C1C]" role="alert">
                {inputError}
              </p>
            )}

            {/* Quick test presets */}
            <div className="mt-3 border-t border-[#E5E7EB] pt-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#4B5563]">
                <span>快速測試（對照 Program.cs 預期情境）：</span>
                <button
                  type="button"
                  onClick={handleRunExpectedSequence}
                  className="inline-flex items-center gap-1 font-semibold text-[#3458A4] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>一鍵重現四筆範例流程</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAction('deposit');
                    setAmountInput('250.50');
                    handleExecute('deposit', '250.50');
                  }}
                  className="min-h-[34px] rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#1F2937] hover:bg-[#EFF6FF]"
                >
                  存入 +250.50
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAction('withdraw');
                    setAmountInput('2000.00');
                    handleExecute('withdraw', '2000.00');
                  }}
                  className="min-h-[34px] rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#1F2937] hover:bg-[#FEF2F2]"
                >
                  超額提領 2000.00
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAction('deposit');
                    setAmountInput('-100.00');
                    handleExecute('deposit', '-100.00');
                  }}
                  className="min-h-[34px] rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#1F2937] hover:bg-[#FEF2F2]"
                >
                  負數存款 -100.00
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAction('withdraw');
                    setAmountInput('350.25');
                    handleExecute('withdraw', '350.25');
                  }}
                  className="min-h-[34px] rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#1F2937] hover:bg-[#EFF6FF]"
                >
                  合法提領 350.25
                </button>
              </div>
            </div>
          </div>

          {/* Latest Operation Feedback */}
          {latestOutcome ? (
            <div
              className={`rounded-lg border p-4 ${
                latestOutcome.success
                  ? 'border-[#1F6E58]/40 bg-[#F0FDF4]/60'
                  : 'border-[#B91C1C]/40 bg-[#FEF2F2]/70'
              }`}
              role="status"
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                {latestOutcome.success ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-[#1F6E58]" aria-hidden="true" />
                    <span className="text-[#1F6E58]">成功更新狀態 · {latestOutcome.message}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-[#B91C1C]" aria-hidden="true" />
                    <span className="text-[#B91C1C]">規則攔截 · {latestOutcome.message}</span>
                  </>
                )}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-[#374151]">
                {latestOutcome.reasonDetail}
              </p>
              <div className="mt-2 font-mono text-xs text-[#4B5563] tabular-nums">
                操作前餘額：{formatCents(latestOutcome.balanceBeforeCents)} 元 → 操作後餘額：
                {formatCents(latestOutcome.balanceAfterCents)} 元
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-sm text-[#4B5563]">
              請執行存款、提款或點擊上方快速測試按鈕，觀察操作結果、餘額變化與右側高亮的把關程式碼。
            </div>
          )}

          {/* Operation History Log */}
          {account.history.length > 0 && (
            <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
              <div className="mb-2 text-xs font-semibold text-[#4B5563]">
                最近操作紀錄（最新在最上方）
              </div>
              <ul className="divide-y divide-[#E5E7EB] text-xs">
                {account.history.slice(0, 5).map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <span className="font-medium text-[#1F2937]">
                      {item.action === 'deposit' ? '存款' : '提款'} {formatCents(item.amountCents)} 元
                    </span>
                    <span className={item.success ? 'text-[#1F6E58]' : 'text-[#B91C1C]'}>
                      {item.success ? '通過' : '已攔截'} · 餘額 {formatCents(item.balanceAfterCents)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Synced C# CodeBlock */}
        <div className={`min-w-0 lg:col-span-6 ${mobileView === 'state' ? 'hidden lg:block' : ''}`}>
          <CodeBlock
            files={examples}
            activeFileName={latestOutcome?.csharpFile ?? 'BankAccount.cs'}
            highlightLines={latestOutcome?.highlightLines ?? [19, 34, 45, 50]}
            title={latestOutcome ? '目前對應檢查行號' : '預設顯示把關邏輯'}
          />
        </div>
      </div>
    </section>
  );
}
