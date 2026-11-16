---
id: 05-abstract-class-and-interface
slug: abstract-class-and-interface
order: 5
title: 抽象類別與介面
subtitle: 圖形及繪製能力：共用家族基底與行為約定的差異
summary: 以繪圖畫布上的圖形與文字標籤為情境，釐清 abstract class 與 interface 的職責邊界及現代 C# 介面規範。
status: verified
compileStatus: unverified-no-dotnet
prerequisites:
  - 03-inheritance-and-composition
  - 04-polymorphism
tags:
  - 抽象類別
  - 介面
  - 行為契約
sourceIds:
  - src-ms-csharp-interfaces
  - src-ms-csharp-inheritance
  - src-ms-csharp-classes
exampleIds:
  - 05-abstract-class-and-interface/ShapesAndCapabilities.cs
  - 05-abstract-class-and-interface/Program.cs
slideExampleId: 05-abstract-class-and-interface/ShapesAndCapabilities.cs
slideLineRange: 22-44
demoId: shape-canvas
relatedIds:
  - 04-polymorphism
  - 06-coupling-and-cohesion
---

## 問題情境

正在寫一個向量白板程式時，畫布上不只有「圓形（Circle）」「矩形（Rectangle）」，還有不屬於幾何圖形的「文字標籤（TextLabel）」。

團隊原本想建一個共用的父類別 `Shape` 來放 `Name` 與 `Color` 欄位，以及 `GetArea()` 計算面積；但馬上遇到兩個問題：
1. 你根本不知道一個「抽象的 Shape」面積該怎麼算，也不該讓程式能寫出 `new Shape(...)`；
2. 「文字標籤（TextLabel）」也需要放進畫布清單一起呼叫 `Draw()`，但它根本沒有面積（`GetArea()`），強制讓 `TextLabel` 繼承 `Shape` 完全不合理。

這就是我們需要同時認識**抽象類別（`abstract class`）**與**介面（`interface`）**的原因。

## 學習目標

- 理解 **`abstract class`** 作為「共用家族基底」的角色：不可直接 `new`，可持有實例欄位與 `protected` 建構式，並透過 `abstract` 成員要求子類別提供具體實作。
- 理解 **`interface`** 作為「跨類別行為契約」的角色：允許沒有共同父類別的類型（如 `Circle` 與 `TextLabel`）同時支援同一組能力，且單一類別可實作多個介面。
- 掌握現代 C#（C# 8+ / C# 12）介面的正確規則：**介面不可宣告實例欄位與實例建構式**，但**允許宣告預設介面成員實作（Default Interface Members）與靜態抽象成員（Static Abstract Members）**。
- 學會在真實設計中搭配使用「單一抽象基底 ＋ 介面契約」（例如 `Circle : Shape, IDrawable`）。

## 觀念圖解

比較兩者在結構上的定位差異：

1. **`abstract class Shape`（我是誰的家族延伸）**
   - 存放家族共用的實例狀態（`Name`、`Color`）與 `protected Shape(...)` 建構式。
   - 定義 `public abstract double GetArea();` 強迫所有非抽象子類別覆寫計算面積，並在 `Describe()` 中共用輸出格式。
2. **`interface IDrawable`（我具備什麼能力）**
   - 定義 `void Draw();` 能力契約，並示範現代 C# 支援的預設實作 `string RenderTag() => "CanvasItem";`（但無實例欄位）。
   - `Circle` 同時繼承 `Shape` 與實作 `IDrawable`；而毫無幾何親緣關係的 `TextLabel` 也能直接 `: IDrawable`，一起放進 `List<IDrawable>` 畫上白板。

## C# 範例

本單元程式碼位於 `examples/csharp/05-abstract-class-and-interface/`（**執行範圍說明**：`Program.cs` 與 `ShapesAndCapabilities.cs` 組成可獨立執行的 `.NET 8 Console` 最小專案）。

### 逐行重點解說
- **`ShapesAndCapabilities.cs` 第 6–19 行**：`public abstract class Shape` 擁有 `Name` 與 `Color` 實例屬性及 `protected` 建構式。第 17 行 `abstract double GetArea()` 沒有大括號本體，規定子類別必須自行實作；第 18 行 `Describe()` 則直接利用 `GetArea()` 提供統一描述。
- **`ShapesAndCapabilities.cs` 第 22–26 行**：`interface IDrawable` 宣告必需能力 `Draw()` 與預設介面成員 `RenderTag()`。依據微軟《Interfaces - C#》（`src-ms-csharp-interfaces`），介面雖然能有預設實作，但仍然不能包含實例欄位（Instance Fields）或實例建構式。
- **`ShapesAndCapabilities.cs` 第 28–35 行**：`Circle : Shape, IDrawable` 展現「繼承一個家族基底，同時掛載介面契約」。注意第 34 行透過 `((IDrawable)this).RenderTag()` 呼叫介面預設成員——因為預設成員預設不自動成為實作類別的直接公開成員，需透過介面參考存取（除非類別自行實作覆寫）。
- **`ShapesAndCapabilities.cs` 第 38–44 行**：`TextLabel : IDrawable` 不需繼承 `Shape`，也不需實作無意義的 `GetArea()`，就能與 `Circle` 一起放進 `Program.cs` 的 `List<IDrawable>` 繪製。

## 預期結果

執行 `Program.cs` 時，白板先對 `List<IDrawable>` 統一呼叫 `item.Draw()`（同時包含圓形與文字標籤），最後單獨展示 `Shape` 家族的面積計算：

```text
繪製 [海藍] 圓形（面積：78.54）｜標籤：CanvasItem
繪製文字標籤：「物件導向工作區」
Shape 計算圓面積：78.54
```

## 修改需求的比較

假設系統新增需求：「除了畫上白板之外，只有部分項目支援『匯出成 JSON 設定檔（`IExportable`）』。」

- **只靠單一抽象類別**：如果把 `ExportJson()` 加進 `Shape`，所有不想支援匯出的幾何圖形都被迫實作；想讓 `TextLabel` 也匯出就更困難。
- **善用介面拆分能力契約**：只需新增 `interface IExportable { string ToJson(); }`，讓真正需要匯出的類別（例如 `Circle : Shape, IDrawable, IExportable`）再多掛載一個介面即可，既有 `Shape` 與其他不支援匯出的類別完全不受干擾。

## 常見誤解

- **誤解 1（過時的 C# 觀念）：「介面裡絕對不能寫任何方法實作，全部只能有方法簽章。」**  
  修正：這在 C# 7 以前是對的，但從 C# 8.0 起（對照 `src-ms-csharp-interfaces`），**介面可以定義預設方法實作（Default Interface Members）**，C# 11 亦支援靜態抽象成員，主要是為了讓介面在擴充新成員時不會直接破壞既有的外部實作類別。介面真正的硬性限制在於：**不能擁有實例狀態欄位（Instance Fields）與實例建構式，且單一類別仍無法從多個基底類別繼承狀態**。
- **誤解 2：「既然抽象類別什麼都能寫，乾脆全部用 `abstract class` 就好，不用介面。」**  
  修正：C# 類別只允許單一繼承！如果你用 `abstract class` 表達能力（例如 `Drawable`），子類別就無法再繼承 `Shape` 或其他領域基底，也無法輕鬆讓無關類別同時具備多種能力。
- **誤解 3：「`abstract class` 跟 `interface` 一樣，都不能有建構式。」**  
  修正：抽象類別**可以有**建構式（通常設為 `protected`），雖然不能直接 `new Shape(...)`，但子類別在初始化時會透過 `: base(...)` 執行它來設定共用欄位（如 `Name` 與 `Color`）。

## 小練習與解析

### 檢查 1：為什麼 `Shape` 的建構式通常標註為 `protected` 而不是 `public`？
觀察 `ShapesAndCapabilities.cs` 第 11 行 `protected Shape(string name, string color)`。即使你寫成 `public Shape(...)`，外部程式還是不能 `new Shape(...)`。那為什麼多數設計仍習慣寫 `protected`？

- **參考解析**：因為 `abstract class` 無法被直接實例化，它的建構式**只會被子類別透過 `: base(...)` 呼叫**。宣告為 `protected` 能更精確表達這個設計意圖：「這個建構式專屬於繼承家族內部使用」，對閱讀 API 的其他開發者更清楚。

### 檢查 2：設計選擇判斷題
假設我們要建立一套「報表產生器」，所有報表（銷售報表、庫存報表）都有共同的「報表標題 `Title` 欄位、產生時間 `GeneratedAt`、與統一標頭格式化方法」，同時只有一部分報表需要支援「寄送 Email（`SendByEmail`）」與「壓縮匯出（`CompressZip`）」。請問哪些部分適合設計為 `abstract class`，哪些適合設計為 `interface`？

- **參考解析**：
  1. 共同欄位與共用標頭邏輯（「所有報表本質上都是報表」）適合放進 **`abstract class ReportBase`**，使用單一繼承統一管理共用狀態。
  2. 「寄送 Email」與「壓縮匯出」屬於可選擇的能力組合，適合抽成 **`interface IEmailable`** 與 **`interface ICompressible`**，讓需要的報表類別依需求各自實作。

## 相關概念及資料來源

- **先修與延伸**：介面除了讓不同物件進入同一個集合之外，更是達成「低耦合系統」的核心工具——當模組只依賴介面而不依賴具體實作時，替換實作就不會波及核心流程。下一章「06 耦合與內聚」將正式展開這個主題。
- **已整合來源（Ingested）**：
  - `src-ms-csharp-interfaces`（Microsoft Learn《Interfaces - C#》，2026-04-13 更新）：提供現代 C# 介面規範，包含多重實作、預設介面成員、無實例欄位與無實例建構式等核心限制。
  - `src-ms-csharp-inheritance`（Microsoft Learn《Inheritance in C#》）：提供抽象類別、`abstract` 成員與衍生類別強制覆寫規則。
  - `src-ms-csharp-classes`（Microsoft Learn《Classes, structs, and records in C#》）：補充類別成員存取控制（`protected`）概念。
