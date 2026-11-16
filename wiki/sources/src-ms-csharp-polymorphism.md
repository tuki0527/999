---
sourceId: src-ms-csharp-polymorphism
title: Polymorphism - C# (S03)
authorOrOrg: Microsoft Learn (.NET Docs)
url: https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/polymorphism
status: ingested
readDate: 2026-11-14
---

## 來源基本資訊
- **讀取日期與方式**：2026-11-14（透過 Node `fetch` 取得 HTTP 200 完整正文並人工消化整理）
- **對應教材章節**：`04-polymorphism`

## 核心摘要（自撰整理）
Microsoft Learn 將 C# 多型（Polymorphism）歸納為兩個核心面向：
1. **型別替換能力**：執行期時，衍生類別的物件可以被視為基底類別物件來傳遞或放入同一個集合（例如 `List<Shape>` 同時持有 `Rectangle`、`Circle`、`Triangle`），不需手動轉型。
2. **動態方法分派（Dynamic Dispatch）**：基底類別以 `virtual` 宣告方法，衍生類別以 `override` 提供各自版本。呼叫端只針對基底型別呼叫 `shape.Draw()`，CLR 會在執行期依據物件**實際型別**查找並執行對應的 `override` 版本。

## 重要概念與適用範圍
1. **宣告型別 vs 執行期型別**：變數宣告為 `BaseClass`（編譯期型別），實際指派為 `DerivedClass`（執行期型別）；`virtual` / `override` 讓執行結果取決於後者。
2. **欄位不能為 `virtual`**：只有方法、屬性、事件與索引子可以宣告為 `virtual`。
3. **`override` 與 `new`（方法隱藏）的根本差異**：若子類別使用 `new` 而非 `override`，就只是隱藏基底成員；此時呼叫哪個方法取決於**變數的宣告型別**，而非實際物件型別。
4. **阻止後續覆寫**：子類別可使用 `public sealed override` 停止該方法被更下層的孫類別繼續覆寫。

## 與其他來源的關聯或差異
- 補充了初學者常忽略的 `new` 隱藏與 `override` 覆寫的區別；在教材 `04-polymorphism` 中，我們會另外將 **Overload（多載：同名不同參數，編譯期決定）** 與 **Override（覆寫：繼承鏈動態分派）** 清楚拆開比較，避免名詞混淆。

## 來源限制與備註
- 原文以 `Shape` 為範例；為避免與本專案第 05 章「抽象類別與介面（圖形及繪製能力）」情境重複，第 04 章教材改採「不同動物發聲（`Animal` / `Dog` / `Cat`）」作為獨立情境。
