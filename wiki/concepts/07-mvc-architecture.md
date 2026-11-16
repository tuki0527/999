---
id: 07-mvc-architecture
slug: mvc-architecture
order: 7
title: MVC 架構
subtitle: 圖書查詢：以網頁請求說明 Model、View 與 Controller
summary: 以 ASP.NET Core MVC 圖書查詢為情境，追蹤 HTTP 請求經過 Controller、Model 與 View 的完整流程與依賴方向。
status: verified
compileStatus: unverified-no-dotnet
prerequisites:
  - 06-coupling-and-cohesion
tags:
  - MVC
  - 關注點分離
  - 網頁請求流程
sourceIds:
  - src-ms-aspnet-mvc
  - src-ms-dotnet-arch-principles
exampleIds:
  - 07-mvc-architecture/Controllers/BooksController.cs
  - 07-mvc-architecture/Models/BookCatalogModel.cs
  - 07-mvc-architecture/Views/Books/Index.cshtml
  - 07-mvc-architecture/Program.cs
slideExampleId: 07-mvc-architecture/Controllers/BooksController.cs
slideLineRange: 7-18
demoId: book-mvc-flow
relatedIds:
  - 06-coupling-and-cohesion
  - 08-integration-and-refactoring
---

## 問題情境

前面六章我們都在寫 Console 主控台範例，但當程式要變成「圖書館網頁查詢系統」時，如果把「解析網址參數（`?keyword=MVC`）」、「比對書名與分類的邏輯」以及「拼接 `<h1>`、`<ul><li>` HTML 標籤」全都塞在同一個處理函式裡：

- 只要網頁設計師想微調表格樣式，就可能不小心刪到查詢篩選的 `if` 條件；
- 想寫自動化測試驗證「搜尋 `MVC` 應該回傳幾本書」，卻發現邏輯跟 HTML 字串綁死，沒辦法單獨測試。

為了解決這類使用者介面、流程控制與核心資料規則糾纏的問題，軟體工程採用了 **MVC（Model–View–Controller）** 架構模式來達成關注點分離（Separation of Concerns）。

## 學習目標

- 明確區分 **Model**（應用狀態與商業查詢規則）、**View**（最小化邏輯的 HTML 呈現模板）與 **Controller**（接收輸入、協調 Model、決定 View）的職責邊界。
- 追蹤一筆 HTTP GET 請求（`/Books/Index?keyword=MVC`）在 ASP.NET Core MVC 中的實際執行順序。
- 掌握關鍵的**單向依賴原則**：View 與 Controller 都依賴 Model，但 **Model 絕對不依賴 Controller 或 View**。
- 分辨不同層級的技術概念：**OOP（程式組織範式）**、**MVC（職責分層架構）**與 **SSR / SPA（前後端渲染位置）** 各自處理的問題維度（並了解為何深度對照 SPA/SSR 尚待補充來源查核）。

## 觀念圖解

當使用者在瀏覽器送出 `GET /Books/Index?keyword=MVC` 時，請求會依序流經三個清楚隔離的角色：

1. **路由與 Controller（`Controllers/BooksController.cs`）**
   - ASP.NET Core 路由將請求導向 `BooksController.Index(string? keyword)`，並透過 Model Binding 自動填入 `keyword = "MVC"`。
   - Controller 不自己實作書單搜尋規則，而是呼叫 `_catalog.Search(keyword)` 交辦給 Model。
2. **Model（`Models/BookCatalogModel.cs`）**
   - 封裝館藏書籍清單與大小寫無關的關鍵字比對規則。
   - **Model 完全不知道有 Controller 或 HTML View 存在**，所以日後換成 API 或桌面介面也能直接重用。
3. **View（`Views/Books/Index.cshtml`）**
   - Controller 取得查詢結果後呼叫 `return View(results);`，將資料交給 Razor View 引擎。
   - View 只負責利用 `@foreach` 將 `BookItem` 渲染成 HTML 清單回應給瀏覽器，不包含資料庫查詢或複雜商業判斷。

> **MVC 變體備註**：MVC 最早源於桌面 GUI 應用（傳統模式中 View 可能直接向 Model 註冊觀察更新）；而在現代伺服器端網頁架構（如本單元採用的 ASP.NET Core MVC）中，瀏覽器每次請求都會經過 Controller 協調，再由 Razor View 單向讀取 Model 資料產生完整 HTML 回傳。

## C# 範例

本單元完整程式碼位於 `examples/csharp/07-mvc-architecture/`（**執行範圍說明**：本單元範例**需放在指定專案 `ASP.NET Core MVC Web App（Microsoft.NET.Sdk.Web，.NET 8）`** 中執行，無法直接貼入一般 Console 主控台專案編譯）。

### 逐行重點解說
- **`Program.cs` 第 2–9 行**：呼叫 `AddControllersWithViews()` 註冊 MVC 服務，並設定預設路由模板 `{controller=Books}/{action=Index}/{id?}`，讓 `/Books/Index` 對應到 `BooksController.Index`。
- **`Controllers/BooksController.cs` 第 7–17 行**：Controller 繼承 `Controller` 基底類別；第 14 行呼叫 `_catalog.Search(keyword)` 委派查詢，第 15 行記錄搜尋詞供輸入框保留，第 16 行回傳 `View(results)`。
- **`Models/BookCatalogModel.cs` 第 7–28 行**：以 `record BookItem` 表示不可變書目，並將搜尋邏輯封裝在 `BookCatalogModel.Search`。注意這整支檔案沒有 `using Microsoft.AspNetCore.Mvc`，確保領域邏輯與網頁框架解耦。
- **`Views/Books/Index.cshtml` 第 1–24 行**：首行 `@model` 宣告強型別資料來源，第 12–24 行只做極精簡的「是否為空」與 `@foreach` 條列輸出。

## 預期結果

當在瀏覽器存取 `/Books/Index?keyword=MVC` 時，伺服器經過 Controller → Model → Razor View 渲染後，會回傳如下的 HTML 頁面內容（無需重新整理開發者工具也能在下方的請求步驟模擬器親自操作）：

```html
<h1>圖書查詢結果</h1>
<form method="get" action="/Books/Index">
    <input type="text" name="keyword" value="MVC" placeholder="輸入書名或分類" />
    <button type="submit">查詢</button>
</form>
<ul>
    <li>B02 · ASP.NET Core MVC 實戰手冊（陳怡君 / 網頁架構）</li>
</ul>
```

## 修改需求的比較

假設圖書館同時提出兩項獨立修改需求：「1. 查詢結果頁面從無序清單 `<ul>` 改成帶有卡片邊框的版面；2. 搜尋關鍵字也要同時比對『作者姓名』。」

- **混在一起寫的傳統單檔頁面**：改 HTML 版面時得在資料迴圈裡閃躲查詢邏輯；改搜尋條件時又要在一堆字串或模板語法裡找 `Where(...)` 位置。
- **遵循 ASP.NET Core MVC 分層後**：
  - 修改外觀排版：只需編輯 `Views/Books/Index.cshtml`，`BooksController.cs` 與 `BookCatalogModel.cs` 完全不動。
  - 修改搜尋規則：只需在 `Models/BookCatalogModel.cs` 的 `Search` 加上 `|| b.Author.Contains(...)`，Controller 與 View 都不必更改。

## 常見誤解

- **誤解 1：「OOP、MVC、SPA/SSR 是同一個維度的三種選擇，學了 MVC 就不用 OOP，或用了 React/SPA 就不能有 MVC 觀念。」**  
  修正：三者解決的是**不同層級的問題**：
  - **OOP（物件導向）** 是用類別、封裝、介面等工具組織程式模組的**語言設計範式**；
  - **MVC** 是把系統職責拆成資料規則（Model）、流程協調（Controller）、畫面呈現（View）的**架構組織模式**（其內部元件通常就是用 OOP 寫成，如本例的 `BooksController` 類別與 `BookCatalogModel` 類別）；
  - **SSR（伺服器端渲染）與 SPA（單頁應用）** 則是在討論「HTML 畫面在哪裡生成、由誰負責切換路由」的**網頁渲染與前後端分工維度**。例如 ASP.NET Core MVC 傳統上屬於伺服器端渲染（SSR），而本教學網站本身則採用純前端 React SPA（各元件亦有模組職責分離，但不應直接宣稱為 ASP.NET MVC）。
  - *來源查核附註*：關於「MVC 與 SPA/SSR 歷史演進的詳細對照」，使用者提供的補充參考文 `src-medium-mvc-spa-ssr`（Huli《Introduction: MVC, SPA, and SSR》）因 Medium Cloudflare HTTP 403 阻擋未能讀取正文，該部分延伸比較目前標示為**待驗證（待補讀正文後複核）**。
- **誤解 2：「Controller 應該把查詢 SQL 或商業條件都寫在 Action 裡，Model 只放幾個空屬性就好。」**  
  修正：這稱為「貧血 Model 與肥大 Controller（Fat Controller）」反模式。依據微軟官方 MVC 指南（`src-ms-aspnet-mvc`），商業邏輯與資料驗證屬於 Model 的職責，Controller 應保持精簡（Thin Controller），只負責處理輸入驗證、呼叫 Model 與選擇要回應哪個 View。
- **誤解 3：「在 Razor View（`.cshtml`）裡面直接對資料庫做篩選或寫大量商業計算很方便。」**  
  修正：View 的職責應把邏輯壓縮到最低限度（只保留顯示用的簡單迴圈或空資料提示），避免測試困難且破壞關注點分離。

## 小練習與解析

### 檢查 1：依賴方向檢查（Model 可以呼叫 View 嗎？）
依據微軟官方文件《Overview of ASP.NET Core MVC》（`src-ms-aspnet-mvc`），在 `BooksController`、`BookCatalogModel` 與 `Views/Books/Index.cshtml` 三者之間，如果有人試圖在 `BookCatalogModel.cs` 裡面直接去讀取 `ViewData["Keyword"]` 或呼叫 Razor 畫面元件，會違反 MVC 的哪一項核心原則？會造成什麼問題？

- **參考解析**：違反了 MVC 的**單向依賴原則**（View 和 Controller 依賴 Model，但 **Model 絕對不能依賴 Controller 或 View**）。一旦 `BookCatalogModel` 依賴網頁框架的 `ViewData` 或 View，它就無法在純 Console 程式、背景排程或獨立單元測試中執行，徹底失去可重複使用性與可測試性。

### 檢查 2：修改需求定位判斷
如果圖書館系統新增了一個規定：「查詢輸入空白時，不要列出全部館藏，改為顯示『請輸入至少兩個字元』的驗證提示。」在維持 MVC 清晰分工的前提下，這個規則判斷與提示顯示應該分別放在哪一層處理？

- **參考解析**：
  1. **字數是否足夠的輸入檢查與路由導向**：可由 **Controller** 檢查請求參數（`ModelState` 或參數檢核），或把「最小查詢字數屬於業務規則」封裝在 **Model / Query 物件** 中驗證並回傳結果狀態；
  2. **把提示文字顯示成紅色警告標籤 `<p>`**：交給 **View（`Index.cshtml`）** 依據傳入的狀態呈現 HTML，不要在 Controller 直接拼接 `<p style="...">` 字串回傳。

## 相關概念及資料來源

- **先修與延伸**：看過真實網頁架構如何分工後，最後一章「08 整合與重構」將帶你回到一個雜亂的單檔待辦事項系統，綜合運用前七章學到的封裝、介面、低耦合與分層概念，親手完成一次重構實戰！
- **已整合來源（Ingested）**：
  - `src-ms-aspnet-mvc`（Microsoft Learn《Overview of ASP.NET Core MVC》）：提供 ASP.NET Core MVC 中 Model、View、Controller 的確切職責定義、依賴方向、Routing 與 Razor View 最小邏輯原則。
  - `src-ms-dotnet-arch-principles`（Microsoft Learn《Architectural principles》）：提供關注點分離（Separation of Concerns）與核心領域不依賴 UI 的架構依據。
- **待驗證補充來源說明**：`src-medium-mvc-spa-ssr`（Huli《Introduction: MVC, SPA, and SSR》）因環境存取遇到 HTTP 403（Cloudflare）未能取得正文，目前標記為 `unavailable`，已就官方文件確認 OOP / MVC / 渲染維度邊界，細節歷史對照保留為**待驗證**。
