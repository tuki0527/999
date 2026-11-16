---
sourceId: src-ms-csharp-interfaces
title: Interfaces - define behavior for multiple types - C# (S04)
authorOrOrg: Microsoft Learn (.NET Docs)
url: https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/interfaces
status: ingested
readDate: 2026-11-14
---

## 來源基本資訊
- **原文最後更新（頁面標記）**：2026-04-13
- **讀取日期與方式**：2026-11-14（透過 Node `fetch` 取得 HTTP 200 完整正文並人工消化整理）
- **對應教材章節**：`05-abstract-class-and-interface`、`06-coupling-and-cohesion`

## 核心摘要（自撰整理）
介面（Interface）定義一組相關成員的「行為契約（contract）」。由於 C# 類別僅支援單一繼承且 `struct` 無法繼承，介面成為跨不相關型別提供共同能力、以及讓單一類別同時滿足多項能力約定的核心機制。按慣例介面名稱以大寫 `I` 開頭（如 `IDrawable`、`IEquatable<T>`）。

**特別重要的現代 C# 更新**：根據 2026 年版官方文件，現代 C#（C# 8.0+ 至 C# 12+）的介面已支援**預設介面成員實作（Default interface members）**與**靜態抽象成員（Static abstract members）**。因此不能再籠統宣稱「介面永遠不能有任何實作程式碼」；更精確的界線是：**介面不能包含實例欄位（instance fields）、實例建構式（constructors）或解構子（finalizers）**。

## 重要概念與適用範圍
1. **介面成員**：可包含方法、屬性、事件、索引子（以及進階的預設方法實作與靜態抽象成員）；不可包含實例欄位與實例建構式。
2. **抽象類別 vs 介面之選用基準**：
   - 需要跨沒有 `is-a` 關係的類別共享能力，或需要多重契約實作 → 選**介面**。
   - 相關聯的家族型別需要共用**實例欄位（狀態）**、建構式或非公開成員（如 `protected`）→ 選**抽象類別**。
3. **顯式實作（Explicit Implementation）**：當類別實作兩個具有同名成員的介面（如 `IMetric.GetDistance` 與 `IImperial.GetDistance`）或介面使用 `internal` 型別時，可用介面名稱限定實作，該成員只能透過介面型別變數呼叫。
4. **介面繼承**：一個介面可以繼承另一個介面（如 `IShape : IDrawable`）。

## 與其他來源的關聯或差異
- 直接修正許多舊教材過時的說法（「介面只能寫空方法簽章」），確保第 05 章內容符合現代 C# 規範。
- 為第 06 章以 `INotifier` 解耦實作提供語言契約依據。

## 來源限制與備註
- 預設介面成員多用於既有公開 API 擴充而不破壞舊實作者；初學者日常設計仍以「契約宣告 + 類別實作」為主模式。
