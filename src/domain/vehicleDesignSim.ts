export type VehicleDesignMode = 'inheritance' | 'composition';
export type EngineChoice = 'petrol' | 'electric';

export interface VehicleDesignView {
  mode: VehicleDesignMode;
  engineChoice: EngineChoice;
  relationshipLabel: string;
  title: string;
  csharpFile: 'VehicleInheritance.cs' | 'VehicleComposition.cs';
  highlightLines: number[];
  outputLine: string;
  rationale: string;
  tradeOff: string;
}

export function evaluateVehicleDesign(
  mode: VehicleDesignMode,
  engineChoice: EngineChoice
): VehicleDesignView {
  if (mode === 'inheritance') {
    return {
      mode,
      engineChoice,
      relationshipLabel: 'SedanByInheritance is-a VehicleBase（類別繼承）',
      title: '繼承設計：汽車直接繼承交通工具基底',
      csharpFile: 'VehicleInheritance.cs',
      highlightLines: [11, 12, 13, 14, 15, 16, 17],
      outputLine: 'Toyota 轎車（繼承動力：140 hp）',
      rationale:
        '適合共用「交通工具基本屬性與共同行為」的穩定分類關係；建立子類別即可直接複用 Brand。',
      tradeOff:
        '若未來同一款轎車要從汽油引擎改為純電馬達或油電雙動力，單一繼承容易演變成 PetrolSedan、ElectricSedan 等爆炸性子類別樹；在執行期也無法動態抽換動力元件。',
    };
  }

  const isPetrol = engineChoice === 'petrol';
  return {
    mode,
    engineChoice,
    relationshipLabel: 'CarWithComposition has-a IPowerUnit（物件組合）',
    title: '組合設計：汽車持有可抽換的動力單元介面',
    csharpFile: 'VehicleComposition.cs',
    highlightLines: isPetrol ? [10, 12, 13, 22, 27, 34] : [16, 18, 19, 33, 34],
    outputLine: isPetrol
      ? 'Civic 搭載 [1.8L 汽油引擎] → 點火啟動汽油引擎'
      : 'Civic 搭載 [150kW 純電馬達] → 靜音啟動純電馬達',
    rationale:
      '將易變動的「動力系統」拆成獨立部件 IPowerUnit，Car 只需要組合持有它，就能在執行期呼叫 SwapEngine(...) 直接抽換汽油與純電實作。',
    tradeOff:
      '需要額外定義 IPowerUnit 介面與轉接方法，初期檔案與型別數量略多於單純繼承，但換取高度彈性與低耦合。',
  };
}
