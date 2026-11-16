---
sourceId: src-ms-dotnet-arch-principles
title: Architectural principles - .NET (S07)
authorOrOrg: Microsoft Learn (.NET Architecture Guides)
url: https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles
status: ingested
readDate: 2026-11-14
---

## 來源基本資訊
- **讀取日期與方式**：2026-11-14（透過 Node `fetch` 取得 HTTP 200 完整正文並人工消化整理）
- **對應教材章節**：`02-encapsulation`、`06-coupling-and-cohesion`、`08-integration-and-refactoring`、`09-dependency-injection`

## 核心摘要（自撰整理）
本篇 Microsoft .NET 架構設計指南將物件導向原則提升至系統分層高度，核心圍繞四項相互支援的設計原則：
1. **關注點分離（Separation of Concerns）**：依工作性質拆分程式碼（如挑選項目 vs 格式化顯示、核心商業規則 vs 資料存取與 UI），讓商業邏輯不綁死於基礎設施或畫面。
2. **封裝（Encapsulation）**：透過公開契約隔離內部實作與狀態；明確指出「可變的全域狀態（mutable global state）」是封裝的對立面，會破壞函式與模組的可預測性。
3. **依賴反轉（Dependency Inversion）**：將編譯期相依方向反轉為「高階邏輯與實作細節都依賴抽象介面」，藉此輕鬆抽換通知器或資料儲存實作。
4. **明確依賴原則（Explicit Dependencies）與單一職責（Single Responsibility）**：類別應透過建構式參數坦白宣告自己運作所需的相依物件（而非偷偷依賴全域環境），並讓每個類別或模組只有一個改變理由。

## 與其他來源的關聯或差異
- 將 `src-ms-csharp-classes` 的「單一類別封裝」延伸至「元件與層級間的封裝與合約邊界」。
- 與 `src-ms-code-metrics-coupling`、`src-ms-aspnet-mvc` 共同支撐第 06、07、08 章的重構與低耦合教學。

## 來源限制與備註
- 原文面向完整 ASP.NET Core 企業應用分層（Core / Infrastructure / UI 專案分離）；本教材轉化為初學者可立即看懂的單專案介面分工與重構範例。
