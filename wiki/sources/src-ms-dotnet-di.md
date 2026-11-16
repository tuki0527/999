---
sourceId: src-ms-dotnet-di
title: Dependency injection - .NET (S08)
authorOrOrg: Microsoft Learn (.NET Docs)
url: https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection
status: ingested
readDate: 2026-11-14
---

## 來源基本資訊
- **讀取日期與方式**：2026-11-14（透過 Node `fetch` 取得 HTTP 200 完整正文並人工消化整理）
- **對應教材章節**：`09-dependency-injection`

## 核心摘要（自撰整理）
本篇 Microsoft Learn 官方指南以 `Worker` 與 `IMessageWriter` 為例，系統化說明什麼是依賴注入（Dependency Injection, DI）以及它如何實現控制反轉（Inversion of Control, IoC）：
1. **硬編碼依賴（Hard-coded dependency）的三大問題**：當類別在內部直接 `private readonly MessageWriter _writer = new();` 時，會造成：
   - 替換實作（如改為寫入紀錄或檔案）時必須修改原類別原始碼；
   - 若被依賴物件本身又需要其他設定或依賴，建立責任會散落各處；
   - 單元測試無法抽換成假物件或靜音替身（mock / stub）。
2. **DI 的解決機制**：
   - 使用介面或抽象類別定義相依契約（例如 `IMessageWriter`）；
   - 由外部（組裝端或 `IServiceCollection` / `IServiceProvider` 容器）負責決定實際要建立哪一個實作類別；
   - 透過**建構式參數（Constructor Injection）**把已建好的實例傳入使用端（例如 `public Worker(IMessageWriter messageWriter)`）。
3. **明確界線**：依賴注入的重點在於「使用端不負責 `new` 自己的協作物件，只要求符合契約的物件被傳進來」；DI 容器只是大規模專案中自動幫我們進行建構式參數配對與物件生命週期管理的工具，小規模時手動在 `Program.cs` 以 `new FileProcessor(new ConsoleProcessingLogger())` 注入一樣符合依賴注入模式。

## 與其他來源的關聯或差異
- 銜接 `src-ms-dotnet-arch-principles`（明確依賴原則與依賴反轉 DIP）與 `src-ms-csharp-interfaces`（介面契約），把第 06 章「為何要依賴介面」推進到「具體實例如何從外部建構式注入、以及何時導入 DI 容器」。
- 補充了官方建構式選擇規則（Constructor Selection Rules）：容器會挑選參數全部可解析且參數最多的公開建構式，若存在多個同級模糊多載則會擲回例外。

## 來源限制與備註
- 原文範例搭配 `Microsoft.Extensions.Hosting` 的背景服務（`BackgroundService`）示範；對初學者而言直接看 `Worker` 與 `IHost` 容易被非核心細節分心，故第 09 章教材改採更直覺的「檔案處理服務（`FileProcessor`）替換紀錄方式（`IProcessingLogger`）」主控台最小範例，並補充提示何時可交由 `.NET` 容器自動組裝。
