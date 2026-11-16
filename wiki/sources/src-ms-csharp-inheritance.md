---
sourceId: src-ms-csharp-inheritance
title: Object-oriented programming - inheritance - C# (S02)
authorOrOrg: Microsoft Learn (.NET Docs)
url: https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/inheritance
status: ingested
readDate: 2026-11-14
---

## 來源基本資訊
- **原文最後更新（頁面標記）**：2022-02-16
- **讀取日期與方式**：2026-11-14（透過 Node `fetch` 取得 HTTP 200 完整正文並人工消化整理）
- **對應教材章節**：`03-inheritance-and-composition`、`04-polymorphism`、`05-abstract-class-and-interface`

## 核心摘要（自撰整理）
C# 僅支援**單一類別繼承**，衍生類別（derived class）會隱含獲得基底類別（base class）的成員，但**建構式與解構子（finalizers）不會被繼承**，每個衍生類別必須自行定義建構式。所有類別皆隱含繼承自 `System.Object`。

文件透過 `WorkItem` 與 `ChangeRequest` 案例說明繼承如何複用現有屬性與方法，並簡潔界定了 `virtual`（允許子類別覆寫）、`abstract`（無實作，強制非抽象子類別覆寫、且使類別無法直接 `new`）、`sealed`（禁止再被繼承或覆寫）與 `new`（方法隱藏）的語法定位。

## 重要概念與適用範圍
1. **繼承的「is-a」語意**：衍生類別與基底類別必須存在合理的概念包含關係（如 `Mammal` is an `Animal`），不應只為了共用語法而強行繼承。
2. **建構式不繼承**：即使基底類別有帶參數建構式，子類別仍須明確撰寫自己的建構式（或透過 `: base(...)` 呼叫基底建構式）。
3. **跨類別共用能力的限制**：當型別之間不存在 `is-a` 關係時（例如 `IEquatable<T>`），應改用介面而非繼承。
4. **阻止繼承**：加上 `sealed` 可避免類別被進一步衍生。

## 與其他來源的關聯或差異
- 本篇著重繼承機制本身的語法規則；至於「何時該放棄繼承改用組合（has-a）」的架構取捨，則與 `src-ms-dotnet-arch-principles` 及本專案第 03 章「交通工具與引擎」範例互補說明。
- 為 `src-ms-csharp-polymorphism` 鋪陳 `virtual` / `override` / `new` 的前置知識。

## 來源限制與備註
- 原文主要展示類別繼承的語法特性，未特別強調過度使用深層繼承造成的耦合風險，因此在教材 `03-inheritance-and-composition` 須補充組合（Composition）的對比與取捨。
