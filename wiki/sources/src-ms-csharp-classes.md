---
sourceId: src-ms-csharp-classes
title: Classes, structs, and records in C# (S01)
authorOrOrg: Microsoft Learn (.NET Docs)
url: https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/
status: ingested
readDate: 2026-11-14
---

## 來源基本資訊
- **原文最後更新（頁面標記）**：2025-04-19
- **讀取日期與方式**：2026-11-14（透過 Node `fetch` 取得 HTTP 200 完整正文並人工消化整理）
- **對應教材章節**：`01-classes-and-objects`、`02-encapsulation`、`03-inheritance-and-composition`、`05-abstract-class-and-interface`

## 核心摘要（自撰整理）
官方文件把 C# 的型別定義（`class`、`struct`、`record`）明確比喻為「藍圖（blueprint）」，而物件（object）則是依藍圖實際配置並初始化的記憶體區塊。在 C# 中沒有脫離型別的全域變數或獨立函式，所有成員都必須歸屬某個型別。

文件同時整理了類別成員的組成與預設存取權限：類別內未特別標示的成員預設為 `private`，藉此減少外部呼叫端（client code）意外破壞內部狀態的風險，這也是物件導向第一支柱「封裝」的語法基礎。

## 重要概念與適用範圍
1. **藍圖 vs 記憶體配置**：`class` 定義能力與結構，`new` 產生個別實例。
2. **成員種類**：欄位（Fields）、屬性（Properties）、方法（Methods）、建構式（Constructors）、常數、事件、索引子等。
3. **存取修飾詞**：`public`、`protected`、`internal`、`private` 等，預設存取層級為 `private`。
4. **繼承與介面支援範圍**：只有 `class` 支援類別繼承，`struct` 不支援繼承；但 `class`、`struct`、`record` 都能實作多個介面。
5. **`record` 與參考／值相等性**：一般 `class` 預設比較參考位址是否指向同一物件，`record` 則內建值相等性與 `with` 非破壞性複製語法。

## 與其他來源的關聯或差異
- 與 `src-igouist-oo-series`（第 1、3 篇）相呼應：Microsoft Learn 偏向精確的語言規範與型別能力邊界（如 `struct` 與 `class` 差異），伊果筆記則用房屋門窗與卡牌遊戲範例幫助初學者建立直覺。
- 銜接 `src-ms-csharp-inheritance` 與 `src-ms-csharp-interfaces` 作為後續繼承與介面的前導總覽。

## 來源限制與備註
- 本篇為技術概覽索引，未展開詳細的類別語法實作範例；具體執行範例由本專案 `examples/csharp/01-classes-and-objects/` 另行設計。
