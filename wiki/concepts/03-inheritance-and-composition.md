---
id: 03-inheritance-and-composition
slug: inheritance-and-composition
order: 3
title: 繼承與組合
subtitle: 交通工具與引擎：is-a 與 has-a 的設計取捨
summary: 透過交通工具與動力系統的對比，理解 C# 單一類別繼承（is-a）與物件組合（has-a）的適用情境與取捨。
status: verified
compileStatus: unverified-no-dotnet
prerequisites:
  - 01-classes-and-objects
  - 02-encapsulation
tags:
  - 繼承
  - 組合
  - is-a 與 has-a
sourceIds:
  - src-ms-csharp-classes
  - src-ms-csharp-inheritance
exampleIds:
  - 03-inheritance-and-composition/VehicleInheritance.cs
  - 03-inheritance-and-composition/VehicleComposition.cs
  - 03-inheritance-and-composition/Program.cs
slideExampleId: 03-inheritance-and-composition/VehicleComposition.cs
slideLineRange: 22-35
demoId: vehicle-engine
relatedIds:
  - 04-polymorphism
  - 05-abstract-class-and-interface
---

## 問題情境

假設你要設計一套車隊管理程式，一開始系統裡只有「交通工具」與「轎車」。使用剛學到的物件導向語法，你很自然寫出 `Sedan : VehicleBase`，讓轎車繼承交通工具的品牌欄位與介紹方法，省下重複程式碼。

但半年後產品規格大幅擴充：同一款轎車現在有「1.8L 汽油引擎」「150kW 純電馬達」和「油電複合」三種動力版本，甚至同一台車在實驗室測試時需要**切換動力元件**。如果繼續全部塞進繼承階層，就會出現 `PetrolSedan`、`ElectricSedan`、`HybridSedan`、`ElectricTruck`……類別樹瞬間爆炸，而且子類別在編譯期就綁死父類別，無法在執行時替換零件。

這正是軟體設計中極關鍵的抉擇：什麼時候用**繼承（Inheritance，`is-a`）**，什麼時候改用**組合（Composition，`has-a`）**？

## 學習目標

- 掌握 C# 繼承的語法規則：**單一類別繼承**（每個類別只能繼承一個基底類別），且**建構式與解構子不會被自動繼承**，必須用 `: base(...)` 明確呼叫。
- 區分 **`is-a`（是一種）** 與 **`has-a`（擁有一個）** 的設計模型差異。
- 理解「優先考慮組合（Favor composition over inheritance）」的原因：避免類別樹爆炸並支援執行期抽換元件。
- 在下方的互動概念模擬中，親自切換繼承與組合寫法，比較結構樹、彈性與實作代價。

## 觀念圖解

在「交通工具與動力系統」這個情境中，兩種關係代表截然不同的結構方向：

1. **方式 A：繼承（`SedanByInheritance` *is-a* `VehicleBase`）**
   - `SedanByInheritance` 直接從 `VehicleBase` 繼承 `Brand` 與 `virtual Describe()`，再以 `override` 補充馬力資訊。
   - 優點：結構直觀，適合穩定且不再分岔的分類關係。
   - 限制：在 C# 中只能單一繼承一個基底類別，無法同時繼承「轎車」又繼承「汽油引擎」。
2. **方式 B：組合（`CarWithComposition` *has-a* `IPowerUnit`）**
   - 汽車把「動力單元」獨立成 `IPowerUnit` 介面，由 `PetrolEngine` 與 `ElectricMotor` 各自實作。
   - `CarWithComposition` 內部持有一個 `_engine` 欄位（`private IPowerUnit _engine;`），駕駛時委派給 `_engine.Start()`，也能透過 `SwapEngine(...)` 在執行期直接更換引擎。

## C# 範例

本單元程式碼位於 `examples/csharp/03-inheritance-and-composition/`（**執行範圍說明**：`Program.cs` 搭配 `VehicleInheritance.cs` 與 `VehicleComposition.cs` 組成可獨立執行的 `.NET 8 Console` 最小專案）。

### 逐行重點解說
- **`VehicleInheritance.cs` 第 4–18 行**：`SedanByInheritance : VehicleBase` 展現 C# 單一繼承。注意第 14 行建構式必須加上 `: base(brand)`——依據微軟《Inheritance in C#》（`src-ms-csharp-inheritance`），衍生類別不會自動繼承父類別的建構式，必須顯式轉交初始化參數。
- **`VehicleComposition.cs` 第 4–20 行**：抽出可變動的「動力行為」定義成 `IPowerUnit` 介面，並分別建立 `PetrolEngine` 與 `ElectricMotor` 兩個獨立零件類別。
- **`VehicleComposition.cs` 第 22–35 行**：`CarWithComposition` 並未繼承任何引擎類別，而是把 `IPowerUnit` 當作建構式注入的成員欄位（`has-a`），並提供 `SwapEngine(IPowerUnit nextEngine)` 在物件建立後動態抽換動力元件。
- **`Program.cs` 第 3–11 行**：示範繼承版的固定輸出，以及組合版如何從汽油引擎動態切換為純電馬達。

## 預期結果

執行 `Program.cs` 時，繼承版輸出固定的轎車描述；組合版則會先以汽油引擎啟動，呼叫 `SwapEngine(new ElectricMotor())` 後立刻切換為純電馬達輸出：

```text
=== 繼承 (is-a) ===
Toyota 轎車（繼承動力：140 hp）

=== 組合 (has-a) ===
Civic 搭載 [1.8L 汽油引擎] → 點火啟動汽油引擎
Civic 搭載 [150kW 純電馬達] → 靜音啟動純電馬達
```

## 修改需求的比較

假設車廠新增需求：「我們現在推出『氫燃料電池（HydrogenCell）』動力模組，並且所有轎車與貨車都能選配。」

- **只靠繼承設計**：你除了要改寫原本假設只有馬力的基底或中間類別，還得為轎車與貨車各自衍生新的氫燃料子類別（`HydrogenSedan`、`HydrogenTruck`），既有繼承樹倍數膨脹。
- **使用組合設計**：只需新增一個實作 `IPowerUnit` 的 `HydrogenCell` 類別，既有的 `CarWithComposition`、`PetrolEngine` 與 `ElectricMotor` 程式碼一行都不用修改，直接傳入就能使用。

## 常見誤解

- **誤解 1：「只要兩個類別有重複的欄位或方法，就應該讓其中一個繼承另一個。」**  
  修正：如果只為了複用程式碼而把毫無「is-a」語意的類別硬湊成父子關係（例如讓 `Car` 繼承 `Engine`），會把引擎的內部細節全部暴露成車子的公開介面，造成高度耦合。只是需要「使用某個零件的功能」，應該用組合（`has-a`）。
- **誤解 2：「子類別會自動繼承父類別的建構式，所以不必寫建構式。」**  
  修正：依據微軟官方文件（`src-ms-csharp-inheritance`），除建構式與解構子（Finalizer）外，其餘非 `private` 成員才會被繼承。當父類別沒有無參數建構式時，子類別必須撰寫建構式並透過 `: base(...)` 呼叫父類別建構式。
- **誤解 3：「用了組合就完全不能用繼承。」**  
  修正：兩者不是互斥的二選一。實務上常見「穩定的核心身分用單層繼承或抽象基底（`is-a`），容易變動的零件或策略用組合持有介面（`has-a`）」。

## 小練習與解析

### 檢查 1：判斷 `is-a` 還是 `has-a`
在設計線上課程系統時，每位「學員（Student）」都有一個「購物車（ShoppingCart）」，而且購物車有 `AddCourse()` 與 `Checkout()` 方法。請問 `Student` 應該**繼承** `ShoppingCart`，還是**組合持有** `ShoppingCart`？請說明理由。

- **參考解析**：應該使用**組合（`Student` has-a `ShoppingCart`）**。學員並不是「一種」購物車（`is-a` 不成立），若用繼承會讓學員物件本身冒出 `Checkout()` 之類奇怪的公開方法，也會讓未來無法替學員替換或清空購物車實作。

### 檢查 2：C# 多重類別繼承限制
假設你想寫 `public class AmphibiousCar : Car, Boat { }`（讓水陸兩棲車同時繼承「汽車」與「船」兩個具體類別），在 C# 編譯器中會發生什麼事？若真的需要同時具備陸行與航行能力，該怎麼改寫？

- **參考解析**：C# **編譯會失敗**，因為 C# 的類別（`class`）只支援**單一類別繼承**。正確做法是讓兩棲車組合持有各自的能力零件（例如 `ILandDrive` 與 `IWaterPropulsion` 介面），或搭配「一個基礎類別 + 多個介面」來實作（詳細規範將在第 05 章介紹）。

## 相關概念及資料來源

- **先修與延伸**：繼承開啟了父類別與子類別共用型別的可能，下一章「04 多型」將深入探討當多個子類別放進同一個基底集合時，程式如何在執行期決定要呼叫哪個版本的方法。
- **已整合來源（Ingested）**：
  - `src-ms-csharp-inheritance`（Microsoft Learn《Inheritance in C#》）：定義單一類別繼承、不繼承建構式與解構子、`virtual`/`override` 及類型階層規則。
  - `src-ms-csharp-classes`（Microsoft Learn《Classes, structs, and records in C#》）：補充類別階層與成員可見度規範。
