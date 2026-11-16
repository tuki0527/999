export type CouplingArchitecture = 'tight' | 'decoupled';
export type CouplingScenario = 'initial-email' | 'switch-to-sms' | 'add-audit-channel';

export interface CouplingImpactReport {
  architecture: CouplingArchitecture;
  scenario: CouplingScenario;
  csharpFile: 'TightCoupledOrder.cs' | 'DecoupledOrder.cs';
  highlightLines: number[];
  touchedModules: string[];
  untouchedModules: string[];
  simulatedOutput: string;
  explanation: string;
  responsibilities: {
    moduleName: string;
    role: string;
  }[];
}

export function evaluateCouplingImpact(
  architecture: CouplingArchitecture,
  scenario: CouplingScenario
): CouplingImpactReport {
  if (architecture === 'tight') {
    const touched =
      scenario === 'initial-email'
        ? ['TightOrderProcessor.cs（同時負責算稅額、建立 EmailSender 與寄信）']
        : [
            'TightOrderProcessor.cs（必須打開訂單主流程修改 new 物件與呼叫方式）',
            '新增 SmsSender 或額外條件分支（if/else）',
          ];

    return {
      architecture,
      scenario,
      csharpFile: 'TightCoupledOrder.cs',
      highlightLines: [12, 14, 16, 17, 18, 19],
      touchedModules: touched,
      untouchedModules: ['無（計算與通知全寫在 TightOrderProcessor 內部）'],
      simulatedOutput:
        scenario === 'initial-email'
          ? '[Email -> alice@example.com] 訂單成立，含稅總額 1,050 元'
          : scenario === 'switch-to-sms'
            ? '[SMS -> 0912-345-678] 訂單成立（被迫修改 TightOrderProcessor 內部程式碼）'
            : '[Email + 稽核紀錄] 被迫在 TightOrderProcessor 內繼續堆疊依賴',
      explanation:
        '緊密耦合寫法把「金額計算」「訂單協調」「具體 EmailSender 建立」塞在同一個類別內（低內聚、直接綁死具體類別）。只要通知管道改變，就必須修改並重測訂單核心邏輯。',
      responsibilities: [
        { moduleName: 'TightOrderProcessor', role: '混雜：稅額計算 ＋ 訂單流程 ＋ 具體 Email 建立' },
        { moduleName: 'EmailSender', role: '具體寄信工具（被寫死在 new EmailSender()）' },
      ],
    };
  }

  if (scenario === 'initial-email') {
    return {
      architecture,
      scenario,
      csharpFile: 'DecoupledOrder.cs',
      highlightLines: [6, 8, 12, 18, 21, 33, 44, 46, 47],
      touchedModules: ['Program.cs（組裝 OrderProcessor 與 EmailNotifier）'],
      untouchedModules: ['PriceCalculator', 'INotifier', 'OrderProcessor'],
      simulatedOutput: '[Email -> alice@example.com] 訂單成立，含稅總額 1,050 元',
      explanation:
        'OrderProcessor 仍然有「必要依賴」（它需要計算器與通知能力才能完成結帳），但通知依賴指向抽象介面 INotifier，而非寫死哪一種寄送工具。',
      responsibilities: [
        { moduleName: 'PriceCalculator', role: '專注：含稅金額計算（高內聚）' },
        { moduleName: 'OrderProcessor', role: '專注：協調計算與通知順序（依賴 INotifier）' },
        { moduleName: 'EmailNotifier / SmsNotifier', role: '專注：實作各自管道的通知細節' },
      ],
    };
  }

  if (scenario === 'switch-to-sms') {
    return {
      architecture,
      scenario,
      csharpFile: 'DecoupledOrder.cs',
      highlightLines: [25, 27, 28, 29, 33, 44, 47],
      touchedModules: ['新增／選用 SmsNotifier（實作 INotifier）', '組裝處傳入 new SmsNotifier()'],
      untouchedModules: ['OrderProcessor（完全不須修改）', 'PriceCalculator（完全不須修改）'],
      simulatedOutput: '[SMS 簡訊 -> 0912-345-678] 訂單成立，含稅總額 1,050 元',
      explanation:
        '切換成簡訊通知時，我們只新增或替換實作 INotifier 的類別；OrderProcessor 與 PriceCalculator 的程式碼一行都不用改，實際把修改範圍鎖定在通知模組邊界內。',
      responsibilities: [
        { moduleName: 'PriceCalculator', role: '未受影響（繼續專注金額計算）' },
        { moduleName: 'OrderProcessor', role: '未受影響（透過介面 _notifier.Notify 呼叫）' },
        { moduleName: 'SmsNotifier', role: '本次唯一新增／替換的通知實作' },
      ],
    };
  }

  return {
    architecture,
    scenario,
    csharpFile: 'DecoupledOrder.cs',
    highlightLines: [12, 14, 15, 33, 36, 47],
    touchedModules: ['新增 CompositeNotifier（實作 INotifier 並轉發多管道）', '組裝處替換傳入'],
    untouchedModules: ['OrderProcessor（完全不須修改）', 'PriceCalculator', 'EmailNotifier', 'SmsNotifier'],
    simulatedOutput: '[Email + SMS 雙管道] 透過 CompositeNotifier 實作 INotifier 同時通知，OrderProcessor 零修改',
    explanation:
      '即使要同時發送兩種通知，只要寫一個實作 INotifier 的組合通知器，OrderProcessor 依然維持單一職責與零改動。',
    responsibilities: [
      { moduleName: 'PriceCalculator', role: '未受影響' },
      { moduleName: 'OrderProcessor', role: '未受影響（僅依賴 INotifier）' },
      { moduleName: 'CompositeNotifier : INotifier', role: '包裝多個 INotifier 並循序通知' },
    ],
  };
}
