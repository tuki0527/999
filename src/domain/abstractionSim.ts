export type AbstractionSubject = 'shape-abstract' | 'drawable-interface' | 'circle-both' | 'label-interface-only';

export interface AbstractionComparison {
  id: AbstractionSubject;
  label: string;
  kindTitle: string;
  canHaveInstanceFields: string;
  canHaveConstructors: string;
  sharedImplementation: string;
  requiredMembersToImplement: string[];
  suitableUseCase: string;
  highlightLines: number[];
}

export const ABSTRACTION_CASES: Record<AbstractionSubject, AbstractionComparison> = {
  'shape-abstract': {
    id: 'shape-abstract',
    label: 'abstract class Shape',
    kindTitle: '抽象類別（共用家族基底）',
    canHaveInstanceFields: '可以（例如共用 Name、Color 狀態與自動屬性）',
    canHaveConstructors: '可以（protected Shape(name, color) 供子類別呼叫）',
    sharedImplementation: 'Describe() 提供完整共用邏輯，並可呼叫尚未實作的 abstract GetArea()',
    requiredMembersToImplement: ['public override double GetArea()（非抽象子類別強制覆寫）'],
    suitableUseCase:
      '當多個相關類型屬於同一家族（is-a），需要共用狀態欄位、建構式初始化或 protected 輔助成員時。',
    highlightLines: [6, 7, 8, 9, 11, 17, 18],
  },
  'drawable-interface': {
    id: 'drawable-interface',
    label: 'interface IDrawable',
    kindTitle: '介面（跨類別行為約定）',
    canHaveInstanceFields: '不可以（介面不可宣告實例欄位）',
    canHaveConstructors: '不可以（介面不可宣告實例建構式）',
    sharedImplementation:
      '現代 C#（C# 8+）支援預設介面成員實作（如 RenderTag()），但仍不能持有每個物件各自的實例狀態欄位。',
    requiredMembersToImplement: ['void Draw()（所有實作者必須提供）', 'string RenderTag()（選用覆寫，已有預設實作）'],
    suitableUseCase:
      '需要替沒有繼承關係的多個類別（如 Circle 與 TextLabel）加上相同能力契約，或讓單一類別同時滿足多項能力時。',
    highlightLines: [22, 23, 24, 25, 26],
  },
  'circle-both': {
    id: 'circle-both',
    label: 'Circle : Shape, IDrawable',
    kindTitle: '單一繼承基底 ＋ 實作介面能力',
    canHaveInstanceFields: '繼承 Shape 的 Name/Color，並新增 Radius',
    canHaveConstructors: '透過 : base("圓形", color) 初始化基底狀態',
    sharedImplementation: '同時參與 List<Shape>（算面積）與 List<IDrawable>（繪製畫布）',
    requiredMembersToImplement: ['override double GetArea()', 'public void Draw()'],
    suitableUseCase:
      'C# 常見實務模式：用一個抽象類別承擔核心狀態家族，再掛載一個或多個介面提供外部系統所需的行為契約。',
    highlightLines: [28, 29, 30, 31, 33, 34, 35],
  },
  'label-interface-only': {
    id: 'label-interface-only',
    label: 'TextLabel : IDrawable',
    kindTitle: '不相關類別僅實作介面',
    canHaveInstanceFields: '自行定義 Text 屬性，不須強迫繼承 Shape',
    canHaveConstructors: '自行定義 TextLabel(string text)',
    sharedImplementation: '不需硬湊 GetArea() 面積概念，仍可與 Circle 一起放進 List<IDrawable> 繪製',
    requiredMembersToImplement: ['public void Draw()'],
    suitableUseCase:
      '避免「為了放進同一個繪圖清單，強迫文字標籤去繼承幾何圖形」的錯誤繼承設計。',
    highlightLines: [38, 39, 40, 41, 43, 44],
  },
};
