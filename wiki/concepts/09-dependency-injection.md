---
id: 09-dependency-injection
slug: dependency-injection
order: 9
title: 依賴注入入門
subtitle: 檔案處理服務替換紀錄方式：從外部傳入協作物件
summary: 以檔案處理服務替換不同紀錄方式為情境，學習建構式注入如何把建立相依物件的責任移交外部，並清楚區分依賴注入（DI）與依賴反轉（DIP）。
status: verified
compileStatus: unverified-no-dotnet
prerequisites:
  - 05-abstract-class-and-interface
  - 06-coupling-and-cohesion
tags:
  - 依賴注入
  - 建構式注入
  - 依賴反轉對照
sourceIds:
  - src-ms-dotnet-di
  - src-ms-dotnet-di-guidelines
  - src-ms-dotnet-arch-principles
  - src-ms-csharp-interfaces
exampleIds:
  - 09-dependency-injection/FileProcessingDI.cs
  - 09-dependency-injection/Program.cs
  - 09-dependency-injection/TightFileProcessor.cs
slideExampleId: 09-dependency-injection/FileProcessingDI.cs
slideLineRange: 45-66
demoId: file-processor-di
relatedIds:
  - 06-coupling-and-cohesion
  - 07-mvc-architecture
  - 08-integration-and-refactoring
---

## 問題情境

假設你正在開發一支「批次檔案處理服務（`FileProcessor`）」，每當處理一份匯入檔（例如 `orders_2026.csv`）時，都要寫下處理進度與驗證失敗的紀錄。

一開始你把寫紀錄的類別拆出來，寫了一個 `ConsoleAuditLogger`，然後在 `TightFileProcessor` 裡面直接寫上：

`private readonly ConsoleAuditLogger _logger = new ConsoleAuditLogger();`

看起來好像已經分檔了，但當系統上線後出現三個真實需求時，問題立刻浮現（對照 Microsoft Learn《Dependency injection - .NET》，`src-ms-dotnet-di`）：
1. 正式機要把紀錄寫進稽核清單或檔案，不能只印在開發者主控台；你被迫打開 `TightFileProcessor.cs` 修改原始碼。
2. 執行自動化測試時，你不希望螢幕噴滿雜訊或寫入真實檔案，想換成靜音的假紀錄器，卻發現外部根本插不進去。
3. 只要被依賴的紀錄器未來自己還需要設定檔案路徑，建立物件的責任就會層層污染到 `TightFileProcessor`。

解法並不是放棄拆分，而是讓 `FileProcessor` **不再自己 `new` 紀錄器**，改由外部透過建構式把紀錄器「注入」進來。

## 學習目標

- 理解**建構式注入（Constructor Injection）**如何讓類別只專注自己的業務流程，把「決定並建立協作物件」的責任交給外部組裝端（Composition Root）。
- 清楚區分第 06 章的**依賴反轉原則（DIP）**與本章的**依賴注入（DI）**：原則與實踐手段各指什麼、為何兩者常搭配使用卻不是同一個名詞。
- 辨識「不使用 DI 容器的手動純建構式注入」與「使用 `.NET IServiceCollection` 容器自動組裝」之間的關係，避免誤以為必須安裝容器套件才算 DI。
- 透過下方的檔案處理互動模擬，實際替換 `ConsoleProcessingLogger`、`FileAuditProcessingLogger` 與 `SilentNullLogger`，觀察 `FileProcessor` 原始碼零改動的效果。

## 觀念圖解

把「誰決定要哪一個紀錄器」從類別內部抽離到外部後，系統形成明確的三個角色分工，並同時釐清 **DIP** 與 **DI** 的位置：

- **依賴反轉原則（DIP，設計原則）**：規定 `FileProcessor`（高階業務流程）不要直接依賴 `ConsoleProcessingLogger`（低階細節），而是兩者共同對齊抽象介面 `IProcessingLogger`。
- **依賴注入（DI，物件提供技術）**：規定 `FileProcessor` 不可以在自己內部 `new` 具體紀錄器，而是透過 `public FileProcessor(IProcessingLogger logger)` 由外部組裝點（`Program.cs` 或框架容器）傳入實際物件實例。

## C# 範例

本單元範例位於 `examples/csharp/09-dependency-injection/`（**執行範圍說明**：`FileProcessingDI.cs` 與 `Program.cs` 可獨立執行於 `.NET 8 Console` 最小專案；`TightFileProcessor.cs` 為對照用反例概念片段）。

### 逐行重點解說
- **`TightFileProcessor.cs` 第 11–13 行（反例）**：雖然另建了 `ConsoleAuditLogger`，但第 13 行在類別內部寫死 `= new ConsoleAuditLogger()`。這種「隱藏的硬編碼依賴」讓外部完全無法抽換紀錄方式。
- **`FileProcessingDI.cs` 第 7–10 行（抽象契約）**：定義 `IProcessingLogger` 介面，只承諾一個 `Log(string message)` 能力（實踐依賴反轉 DIP）。
- **`FileProcessingDI.cs` 第 13–42 行（多種具體實作）**：`ConsoleProcessingLogger`、`FileAuditProcessingLogger` 與 `SilentNullLogger` 各自實作 `IProcessingLogger`，彼此互不知情。
- **`FileProcessingDI.cs` 第 45–52 行（建構式注入入口）**：`FileProcessor` 透過建構式參數要求 `IProcessingLogger logger`，並加上 `logger ?? throw new ArgumentNullException(nameof(logger))` 守住非空不變量。這就是**明確依賴原則（Explicit Dependencies，`src-ms-dotnet-arch-principles`）**與建構式注入。
- **`FileProcessingDI.cs` 第 54–65 行（業務處理流程）**：`ProcessFile` 檢查檔名不可空白且行數大於 0 後，一律透過 `_logger.Log(...)` 記錄結果，完全不知道底層是印螢幕、寫稽核清單或靜音。
- **`Program.cs` 第 5–18 行（組裝端 Composition Root）**：分別以 `new FileProcessor(new ConsoleProcessingLogger())`、`new FileProcessor(auditLogger)` 與 `new FileProcessor(new SilentNullLogger())` 注入三種紀錄器；在大型 ASP.NET Core 專案中，這段 `new` 的組裝工作會交給 `IServiceCollection` 容器自動完成。

## 預期結果

執行 `Program.cs` 時，同一份 `FileProcessor` 類別在完全不修改原始碼的前提下，依序產生三種紀錄行為：

```text
=== 情境 1：注入 ConsoleProcessingLogger ===
[Console] 開始處理 orders_2026.csv（共 120 行）
[Console] 完成處理 orders_2026.csv，已通過格式檢查。
=== 情境 2：替換注入 FileAuditProcessingLogger（FileProcessor 零修改） ===
已寫入稽核紀錄檔：[AuditFile] 開始處理 orders_2026.csv（共 120 行）
已寫入稽核紀錄檔：[AuditFile] 完成處理 orders_2026.csv，已通過格式檢查。
稽核紀錄總筆數：2
=== 情境 3：測試／靜音模式注入 SilentNullLogger ===
靜音處理結果：False
```

## 修改需求的比較

假設系統新增需求：「客戶匯入檔案前，需要支援把紀錄同步送到測試用記憶體紀錄器，或是依環境切換『只記在稽核檔、不印主控台』。」

- **內部硬編碼版（`TightFileProcessor`）**：必須修改 `TightFileProcessor.cs` 內部欄位與建構流程，若為了支援兩種環境而在類別內加入 `if (useFile)` 旗標，會讓 `TightFileProcessor` 同時耦合更多具體類別與設定細節。
- **建構式注入版（`FileProcessor` + `IProcessingLogger`）**：`FileProcessor.cs` **一行都不需要改**。只需新增實作 `IProcessingLogger` 的新類別，並在 `Program.cs` 組裝端（或 DI 容器註冊處）替換傳入的實例即可。

## 常見誤解

- **誤解 1：「依賴注入（DI）跟依賴反轉原則（DIP）是同一件事的不同講法。」**  
  修正：兩者層次不同。**依賴反轉（DIP）**是設計原則，關心「高階模組應該依賴抽象介面，而非具體類別」；**依賴注入（DI）**則是提供物件的具體實踐手法，關心「所需物件不要在類別內部 `new`，而是從外部（通常是建構式）傳入」。你可以定義了 `IProcessingLogger`（符合介面抽象），卻仍在建構式裡自己寫 `_logger = new ConsoleProcessingLogger()`——這樣就**違反了依賴注入**；反過來，如果從建構式直接傳入具體類別 `new FileProcessor(new ConsoleAuditLogger())`，這算有「注入動作」，但沒有做到依賴反轉抽象化。
- **誤解 2：「一定要用到 `Microsoft.Extensions.DependencyInjection` 或 `AddSingleton` 容器才算依賴注入。」**  
  修正：DI 是一種設計模式，而不是特定套件的專利。在 `Program.cs` 手動寫 `new FileProcessor(new ConsoleProcessingLogger())` 稱為**純建構式注入（Pure DI）**；`.NET` 內建的 `IServiceCollection` 與 `IServiceProvider`（`src-ms-dotnet-di`）只是當專案有幾十個互相相依的服務時，用來自動配對建構式參數並管理生命週期（Transient / Scoped / Singleton）的容器工具。
- **誤解 3：「既然都要從外部注入，那把相依物件直接存成 `public static` 全域工具不是更省事嗎？」**  
  修正：依據微軟《Dependency injection guidelines》（`src-ms-dotnet-di-guidelines`），有狀態的 `static` 類別或全域欄位會造成隱藏依賴，使不同測試或請求互相污染。透過建構式明確傳入實例，才能一眼看清這個類別需要哪些協作物件；若建構式參數多到失控，也正好提醒我們這個類別可能違反了單一職責原則（SRP），該進行拆分。

## 小練習與解析

### 檢查 1：辨別「介面存在」與「真的有做依賴注入」
有位開發者把 `TightFileProcessor` 改寫如下：
```csharp
public class SemiProcessor
{
    private readonly IProcessingLogger _logger;
    public SemiProcessor()
    {
        _logger = new ConsoleProcessingLogger();
    }
}
```
請問這段程式碼已經滿足「依賴注入」了嗎？為什麼？

- **參考解析**：**還沒有滿足依賴注入**。雖然欄位型別已經寫成抽象介面 `IProcessingLogger`，但物件建立依然寫死在無參數建構式內部（`= new ConsoleProcessingLogger()`）。呼叫端與單元測試依然無法從外部替換成 `SilentNullLogger` 或 `FileAuditProcessingLogger`；必須改成 `public SemiProcessor(IProcessingLogger logger)` 並由外部傳入實例，才算完成依賴注入。

### 檢查 2：建構式需要 7 個服務時代表什麼訊號？
依據微軟《Dependency injection guidelines》（`src-ms-dotnet-di-guidelines`），當你發現某個服務的建構式需要注入 7 個以上的介面（例如同時注入紀錄器、寄信器、稅率計算、報表匯出、權限驗證、資料庫與快取）時，這在設計上代表什麼訊號？應該如何處理？

- **參考解析**：這通常是**單一職責原則（SRP）過載的警訊**，代表該類別承擔了過多不該混在一起的業務工作（低內聚）。與其繼續把所有依賴塞進同一個建構式，應先依任務邊界拆出更小、內聚性更高的協作類別，再讓各自只接收自己真正需要的那 1–3 個依賴。

## 相關概念及資料來源

- **先修與延續**：本章直接建立在第 06 章「耦合與內聚」的依賴反轉基礎上，把「依賴抽象介面」推進為「從外部建構式注入實例」，並能直接套用在第 07 章 `BooksController(BookCatalogModel / IBookCatalog)` 與第 08 章 `TodoService` 的系統組裝中。
- **已整合來源（Ingested）**：
  - `src-ms-dotnet-di`（Microsoft Learn《Dependency injection - .NET》）：提供硬編碼相依缺點、建構式注入定義與 `IServiceCollection` 容器角色之官方說明。
  - `src-ms-dotnet-di-guidelines`（Microsoft Learn《Dependency injection guidelines - .NET》）：提供避免 `static` 全域狀態、以建構式依賴數量檢視 SRP 等設計準則。
  - `src-ms-dotnet-arch-principles`（Microsoft Learn《Architectural principles》）：提供明確依賴原則（Explicit Dependencies）與依賴反轉原則（DIP）區分依據。
  - `src-ms-csharp-interfaces`（Microsoft Learn《Interfaces - C#》）：支援以 `IProcessingLogger` 介面定義可替換能力契約。
