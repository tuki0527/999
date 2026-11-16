---
id: 08-integration-and-refactoring
slug: integration-and-refactoring
order: 8
title: 整合與重構
subtitle: 待辦事項系統：整理分工並迎接新需求
summary: 綜合運用封裝、低耦合與分層概念，將單檔混雜的待辦事項程式重構為三層清楚分工，並實測加入「截止日期」新需求。
status: verified
compileStatus: unverified-no-dotnet
prerequisites:
  - 02-encapsulation
  - 06-coupling-and-cohesion
  - 07-mvc-architecture
tags:
  - 重構
  - 職責分離
  - 綜合實戰
sourceIds:
  - src-ms-dotnet-arch-principles
  - src-ms-aspnet-mvc
exampleIds:
  - 08-integration-and-refactoring/RefactoredTodo.cs
  - 08-integration-and-refactoring/Program.cs
  - 08-integration-and-refactoring/MixedTodoBefore.cs
slideExampleId: 08-integration-and-refactoring/RefactoredTodo.cs
slideLineRange: 27-50
demoId: todo-refactor
relatedIds:
  - 02-encapsulation
  - 06-coupling-and-cohesion
  - 07-mvc-architecture
---

## 問題情境

當程式還只有 15 行時，很多人習慣寫出像 `MixedTodoBefore.cs` 這樣的結構：用一個 `List<string>` 存 `"[ ] 閱讀封裝章節"` 字串，同時在同一個 `Run()` 方法裡面直接印出主控台文字。

但如果今天需要把系統變成真正可用的「待辦事項管理程式」，並且很快要加上兩個新需求：
1. 防止新增空白標題的待辦事項，且能安全切換完成狀態；
2. 加上「截止日期（DueDate）」，未來還可能改用網頁（MVC View）而不是 Console 顯示。

如果還在原本的 `List<string>` 上硬改，每次切字串、防呆與改版面都會互相干擾。本章要將前七章所學的**類別、封裝、組合、介面、低耦合與 MVC 分層觀念**全部整合起來，示範如何一步步完成結構重構。

## 學習目標

- 辨識混雜程式碼中的三種不同變化軸：**資料與不變量規則**、**集合操作協調**、**畫面呈現輸出**。
- 綜合運用第 01–07 章的技術，重構出 `TodoItem`（封裝狀態）、`TodoService`（操作協調）與 `TodoConsoleView`（畫面呈現）。
- 實際驗證加入新需求「截止日期（`DueDate`）」時，重構前後的修改影響範圍差異。
- 為後續獨立擴充章節（如預留中的第 09 章「依賴注入」）打下清晰的模組邊界。

## 觀念圖解

從重構前到重構後，程式依「變更原因不同就應該拆開（Single Responsibility Principle，`src-ms-dotnet-arch-principles`）」整理為三個高內聚層級：

1. **資料與規則層（`TodoItem`）**
   - 封裝 `Id`、`Title`、`IsDone` 與選填 `DueDate`。
   - 透過建構式阻擋空白標題（第 02 章封裝不變量），將 `IsDone` 設為 `private set`，只允許透過 `ToggleDone()` 切換。
2. **操作協調層（`TodoService`）**
   - 管理內部 `_items` 集合（對外僅公開唯讀 `IReadOnlyList<TodoItem>`，避免外部呼叫 `_items.Clear()` 直接清空）。
   - 提供明確的操作方法：`Add(...)`、`Toggle(id)`、`Remove(id)`。
3. **畫面呈現層（`TodoConsoleView`）**
   - 只負責把 `IReadOnlyList<TodoItem>` 格式化成 `[x] #1 標題（期限：...）` 輸出，完全不知道資料怎麼儲存或規則怎麼檢查。

## C# 範例

本單元提供重構前後對照檔案於 `examples/csharp/08-integration-and-refactoring/`（**執行範圍說明**：`Program.cs` 與 `RefactoredTodo.cs` 可獨立執行於 `.NET 8 Console` 最小專案；`MixedTodoBefore.cs` 為重構前反例概念片段）。

### 逐行重點解說
- **`MixedTodoBefore.cs` 第 7–14 行（重構前）**：把狀態（`"[ ] "` 字串前綴）與顯示（`Console.WriteLine`）全部綁死。如果要檢查某筆任務是否逾期，必須做脆弱的字串拆解（Substrings）。
- **`RefactoredTodo.cs` 第 7–24 行**：`TodoItem` 運用第 01、02 章所學，將標題去空白與空值檢查放在建構式，把完成旗標鎖為 `private set` 交由 `ToggleDone()` 控制。
- **`RefactoredTodo.cs` 第 27–50 行**：`TodoService` 對外公開 `IReadOnlyList<TodoItem> Items`，防止外界繞過 `Add()` 與 `Remove()` 自行篡改清單（保護集合封裝性）。
- **`RefactoredTodo.cs` 第 53–64 行**：`TodoConsoleView.Render(...)` 只接收唯讀資料進行呈現，完美對應第 07 章 View 的「單向讀取、極小化邏輯」原則。

## 預期結果

執行 `Program.cs` 時，依序新增兩筆待辦並將第 1 筆標記為完成，最後由 `TodoConsoleView` 印出整理後的清單：

```text
[x] #1 完成物件導向筆記（期限：2026-11-20）
[ ] #2 練習 MVC 三層職責分工
```

## 修改需求的比較

透過下方互動模擬器勾選／取消「模擬加入新需求：截止日期（DueDate）」，就能直觀看到兩者的差別：

- **重構前（`MixedTodoBefore`）**：你必須重新設計字串儲存格式（例如 `"[ ] 2026-11-20 | 閱讀筆記"`），所有新增、切換 `[x]`、解析、輸出顯示的程式碼全部連坐修改。
- **重構後（三層分工）**：
  - `TodoItem` 補上 `DueDate` 屬性與可選參數；
  - `TodoService.Add` 多傳遞一個可選參數（`Toggle` 與 `Remove` 完全不用動）；
  - `TodoConsoleView` 補上期限格式化字串。
  每一層修改的原因都非常單純，而且核心規則 `Toggle`、空標題驗證完全不會被改壞。

## 常見誤解

- **誤解 1：「重構就是要把程式碼拆成越多類別、越多介面才越專業。」**  
  修正：重構的目的是**讓職責變清楚、未來修改變安全**，而不是無止境堆疊設計模式。如果目前系統只有單純的記憶體清單管理與單一 Console 輸出，做到 `TodoItem`、`TodoService`、`TodoConsoleView` 這三層清晰分工就已經具備高度可維護性；等到真的需要替換「檔案儲存 vs 資料庫儲存」時，再抽出 `ITodoRepository` 介面即可。
- **誤解 2：「重構之後，所有功能一定要完全重寫才會變好。」**  
  修正：好的重構是**小步驗證、漸進分離**——先保護核心模型不變量（`TodoItem`），再把集合協作抽成 Service，最後將顯示邏輯獨立給 View，每一步都保持系統可運作。
- **誤解 3：「`TodoService` 回傳 `public List<TodoItem> Items => _items;` 也算封裝好了。」**  
  修正：如果直接暴露 `List<TodoItem>`，外部程式就可以寫出 `service.Items.Clear()` 或 `service.Items.Add(null!)`，直接繞過 `TodoService.Add()` 的編號與規則管理！改用 `IReadOnlyList<TodoItem>`（如本例第 32 行）才能真正保護內部集合。

## 小練習與解析

### 檢查 1：替系統換成網頁（ASP.NET Core MVC）介面需要重寫哪些部分？
假設這套重構後的待辦系統要從 Console 主控台搬到 ASP.NET Core MVC 網頁上呈現，請檢查 `TodoItem`、`TodoService` 與 `TodoConsoleView` 這三個類別，哪兩個可以直接重用？哪一個需要替換？

- **參考解析**：**`TodoItem`**（資料與不變量規則）與 **`TodoService`**（新增、切換、刪除流程協調）完全沒有依賴 `Console.WriteLine`，可以直接在網頁專案中重複使用；只需要把 **`TodoConsoleView`** 換成 Razor View（`.cshtml`）搭配一個接收 HTTP 請求的 `TodoController` 即可。這正是第 06、07 章低耦合與關注點分離帶來的真實收穫。

### 檢查 2：為未來需求預留擴充點（儲存位置替換）
目前 `TodoService` 內部直接用 `private readonly List<TodoItem> _items = new();` 存在記憶體中。如果下一步要把資料改成「存進 SQLite 資料庫或 JSON 檔案」，而且希望不要修改 `TodoService` 的核心流程邏輯，應該運用哪幾章的觀念來重構？

- **參考解析**：可以運用第 05 章的**介面（`interface`）**與第 06 章的**依賴反轉（DIP）**，定義一個資料存取契約 `ITodoRepository`（包含 `GetAll`、`Save`、`Delete`），讓 `TodoService` 透過建構式接收 `ITodoRepository`，再分別實作 `InMemoryTodoRepository` 與 `JsonFileTodoRepository`。這也正是後續獨立擴充章節「09 依賴注入（Dependency Injection）」將進一步實作的課題。

## 相關概念及資料來源

- **學習路徑總結與後續擴充保留**：恭喜你完成初版全部八章！從最基礎的「類別與物件」出發，歷經「封裝保護狀態」「繼承與組合取捨」「多型動態分派」「抽象類別與介面」「低耦合高內聚」「MVC 三層分離」，到本章的「整合重構」，你已經建立一套貫通通用程式設計與網頁開發的核心架構地圖。後續我們將保留於獨立階段新增第 09 章「依賴注入（Dependency Injection）」，驗證本 Wiki 知識庫的可擴充性。
- **已整合來源（Ingested）**：
  - `src-ms-dotnet-arch-principles`（Microsoft Learn《Architectural principles》）：提供單一職責（SRP）、關注點分離（SoC）、封裝集合與核心領域不依賴基礎設施／UI 之指導原則。
  - `src-ms-aspnet-mvc`（Microsoft Learn《Overview of ASP.NET Core MVC》）：提供將重構三層對應至 Model、Controller、View 網頁實務之概念橋樑。
