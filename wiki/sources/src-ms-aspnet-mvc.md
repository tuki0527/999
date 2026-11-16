---
sourceId: src-ms-aspnet-mvc
title: Overview of ASP.NET Core MVC (S06)
authorOrOrg: Microsoft Learn (.NET Docs)
url: https://learn.microsoft.com/en-us/aspnet/core/mvc/overview
status: ingested
readDate: 2026-11-14
---

## 來源基本資訊
- **讀取日期與方式**：2026-11-14（透過 Node `fetch` 取得 HTTP 200 完整正文並人工消化整理）
- **對應教材章節**：`07-mvc-architecture`、`08-integration-and-refactoring`

## 核心摘要（自撰整理）
ASP.NET Core MVC 將網頁應用程式拆分為三個主要職責群組，藉此達成關注點分離（Separation of Concerns）：
- **Model（模型）**：代表應用程式狀態，以及應該執行的商業邏輯、驗證規則與資料存取操作（可搭配專供畫面顯示的 ViewModel）。
- **View（檢視）**：透過 Razor 引擎將內容呈現為 HTML 使用者介面。檢視應只保留極少數與「呈現方式」有關的邏輯，避免混入商業規則。
- **Controller（控制器）**：請求進入點，負責處理使用者輸入、協調 Model 執行動作或查詢，並決定要將哪個 View 連同資料回傳渲染；應避免把肥厚的商業邏輯塞進 Controller（推回領域 Model）。

官方特別強調的**依賴方向**：「View 與 Controller 都依賴 Model，但 **Model 不依賴 View 或 Controller**」。因此業務規則能獨立於網頁畫面被測試與重用。

## 重要概念與適用範圍
1. **請求生命週期（ASP.NET Core MVC 脈絡）**：HTTP 請求 → Routing 路由比對對應的 Controller Action → Model Binding 將查詢字串／表單轉為強型別參數與驗證 → Controller 呼叫 Model → 回傳 `View(model)` 交由 Razor View 產生 HTML。
2. **MVC 變體提醒**：網頁伺服器端 MVC（如 ASP.NET Core MVC 的無狀態請求-回應模型）與早期桌面端 MVC（如觀察者模式主動通知 View 更新）在資料流細節上有所差異，教材必須明確標示「以 ASP.NET Core Web MVC 為說明脈絡」。
3. **跨切面與技術分層**：Routing、Model Binding、Model Validation（Data Annotations）、DI 與 Filters 是框架輔助機制，讓 Controller 保持精簡。

## 與其他來源的關聯或差異
- 與 `src-ms-dotnet-arch-principles` 一致：UI 變更頻繁而商業規則較穩定，把規則留在 Model（或領域層）可避免每次改版面都要重測商業邏輯。
- 與 `src-medium-mvc-spa-ssr`（目前受阻未讀）的關聯：第 07 章會簡要點出 OOP（程式設計範式）、MVC（職責分工架構）與 SPA／SSR（渲染位置與載入策略）屬於不同維度，並標示 SPA/SSR 詳細來源對照尚待補讀。

## 來源限制與備註
- 本篇範例語法屬於 ASP.NET Core MVC Web 專案（含 `Controllers/*.cs`、`Models/*.cs`、`Views/*/*.cshtml`），不可直接複製進單純的 .NET Console 主控台執行。
