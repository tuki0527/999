export type BankActionType = 'deposit' | 'withdraw';

export interface BankOperationOutcome {
  id: number;
  action: BankActionType;
  amountCents: number;
  success: boolean;
  message: string;
  reasonDetail: string;
  balanceBeforeCents: number;
  balanceAfterCents: number;
  csharpFile: 'BankAccount.cs';
  highlightLines: number[];
}

export interface BankAccountState {
  accountNumber: string;
  ownerName: string;
  balanceCents: number;
  history: BankOperationOutcome[];
}

export function formatCents(cents: number): string {
  const amount = cents / 100;
  return amount.toLocaleString('zh-TW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseDecimalToCents(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed || !/^-?\d+(\.\d{1,2})?$/.test(trimmed)) {
    return null;
  }
  const negative = trimmed.startsWith('-');
  const unsigned = negative ? trimmed.slice(1) : trimmed;
  const [wholePart, fracPart = ''] = unsigned.split('.');
  const cents = Number(wholePart) * 100 + Number(fracPart.padEnd(2, '0'));
  if (!Number.isSafeInteger(cents)) {
    return null;
  }
  return negative ? -cents : cents;
}

export function createInitialBankAccount(): BankAccountState {
  return {
    accountNumber: '001-2026-088',
    ownerName: '林小安',
    balanceCents: 100000, // 1,000.00 元
    history: [],
  };
}

export function executeBankOperation(
  state: BankAccountState,
  action: BankActionType,
  amountCents: number
): { nextState: BankAccountState; outcome: BankOperationOutcome } {
  const nextId = state.history.length + 1;
  const before = state.balanceCents;

  if (action === 'deposit') {
    if (amountCents <= 0) {
      const outcome: BankOperationOutcome = {
        id: nextId,
        action,
        amountCents,
        success: false,
        message: '存款金額必須大於 0。',
        reasonDetail:
          '在 BankAccount.Deposit() 入口檢查到 amount <= 0m，因此立即回傳失敗，私有欄位 _balance 維持原狀不變。',
        balanceBeforeCents: before,
        balanceAfterCents: before,
        csharpFile: 'BankAccount.cs',
        highlightLines: [34, 35, 36, 37],
      };
      return {
        nextState: { ...state, history: [outcome, ...state.history] },
        outcome,
      };
    }

    const after = before + amountCents;
    const outcome: BankOperationOutcome = {
      id: nextId,
      action,
      amountCents,
      success: true,
      message: `成功存入 ${formatCents(amountCents)} 元。`,
      reasonDetail:
        '輸入金額通過大於 0 的規則檢查，方法內部才更新私有欄位 _balance += amount（採整數分對應 decimal 精度）。',
      balanceBeforeCents: before,
      balanceAfterCents: after,
      csharpFile: 'BankAccount.cs',
      highlightLines: [39, 40],
    };
    return {
      nextState: {
        ...state,
        balanceCents: after,
        history: [outcome, ...state.history],
      },
      outcome,
    };
  }

  // withdraw
  if (amountCents <= 0) {
    const outcome: BankOperationOutcome = {
      id: nextId,
      action,
      amountCents,
      success: false,
      message: '提款金額必須大於 0。',
      reasonDetail:
        '提款方法攔截到非正數輸入（amount <= 0m），防止「負負得正」變相增加餘額，原餘額保持不變。',
      balanceBeforeCents: before,
      balanceAfterCents: before,
      csharpFile: 'BankAccount.cs',
      highlightLines: [45, 46, 47, 48],
    };
    return {
      nextState: { ...state, history: [outcome, ...state.history] },
      outcome,
    };
  }

  if (amountCents > before) {
    const outcome: BankOperationOutcome = {
      id: nextId,
      action,
      amountCents,
      success: false,
      message: '餘額不足，無法完成提款。',
      reasonDetail:
        `欲提領 ${formatCents(amountCents)} 元大於目前餘額 ${formatCents(before)} 元，觸發 amount > _balance 保護規則，狀態不異動。`,
      balanceBeforeCents: before,
      balanceAfterCents: before,
      csharpFile: 'BankAccount.cs',
      highlightLines: [50, 51, 52, 53],
    };
    return {
      nextState: { ...state, history: [outcome, ...state.history] },
      outcome,
    };
  }

  const after = before - amountCents;
  const outcome: BankOperationOutcome = {
    id: nextId,
    action,
    amountCents,
    success: true,
    message: `成功提領 ${formatCents(amountCents)} 元。`,
    reasonDetail:
      '同時通過「金額大於 0」與「餘額充足」兩道守門條件，才安全執行 _balance -= amount。',
    balanceBeforeCents: before,
    balanceAfterCents: after,
    csharpFile: 'BankAccount.cs',
    highlightLines: [55, 56],
  };
  return {
    nextState: {
      ...state,
      balanceCents: after,
      history: [outcome, ...state.history],
    },
    outcome,
  };
}
