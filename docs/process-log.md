# 製作與討論歷程紀錄（Process Log）

## Stage 1：專案規則建立、網站骨架與第 01–02 章實作

### 1. 先行制定開發規範
- 先後建立 `AGENTS.md` 與 `docs/requirements.md`，明定繁體中文用語、C# 與 React 的技術分界、九段固定教材結構、來源 `readDate: null` 誠實原則，以及 `HashRouter` + `base: './'` 的 GitHub Pages 部署規格。
- 建立完成後實地讀取 `AGENTS.md`，依規範啟動實作。

### 2. 架構與職責分離設計
- **內容層（`wiki/`、`sources/`、`examples/csharp/`）**：所有教材正文與 C# 範例以 Markdown 與 `.cs` 檔案獨立維護，透過 Vite `import.meta.glob(..., { query: '?raw' })` 在建置期靜態打包，避免 GitHub Pages 子路徑動態 fetch 404 問題。
- **解析與儲存層（`src/lib/`）**：撰寫不依賴 Node `Buffer` 的純 TypeScript Frontmatter／Markdown 解析器（`wikiParser.ts`），以及含容錯機制的 `localStorage` 收藏與進度管理（`storage.ts`）。
- **領域模擬層（`src/domain/`）**：獨立於 React UI 之外的純函式狀態轉移邏輯。第 01 章模擬兩個獨立 `Student` 實例；第 02 章銀行帳戶以整數分（`balanceCents`）取代浮點數加減，確保精度並完整回傳失敗原因與原狀態。
- **互動與註冊層（`src/interactive/`）**：建立 `demoRegistry` 以 `demoId` 查找互動實驗室，未來新增章節無須更動主頁面框架。

### 3. Stage 1 後續待辦（已於 Stage 2 執行）
- 實際讀取並 ingest `sources/registry.json` 中登錄之官方文件，完成 `wiki/sources/*.md` 筆記並修訂第 01–02 章升為 `verified`。
- 補齊第 03–08 章教材正文、C# 範例與對應互動模擬器。

---

## Stage 2：實地來源 Ingest、八章教材補齊與全方位互動實驗室

### 1. 實地讀取來源（Ingest）與受阻誠實處理
- 使用環境內的網路擷取實際取得並完整閱讀 **7 篇 Microsoft Learn 官方文件（S01–S07）**、追讀 **伊果物件導向系列（第 0、1、3、8 篇正文）**，以及 **2 篇 Wiki 方法論參考 Gist（不計入主題資料數）**。
- 針對使用者提供的兩篇 Medium 補充文章（`src-medium-oop-concept` 與 `src-medium-mvc-spa-ssr`），實測遭遇 **HTTP 403 Cloudflare 驗證阻擋**，未取得正文，依規範嚴格標記為 `unavailable`（`readDate: null`），並在第 07 章保留「SPA/SSR 深度對照待補來源驗證」的誠實標示；`src-ms-csharp-oop` 則維持 `pending`。
- 為全部來源產出對應筆記 `wiki/sources/<source-id>.md`，並於第 01–08 章引用實際讀過的 `sourceIds`。

### 2. 八章 C# 範例與互動實驗室全面落地
- 補齊 `examples/csharp/03-*` 至 `08-*` 原始碼與 `.csproj` 專案定義（含第 07 章獨立的 `ASP.NET Core MVC Web App` `.csproj` 與 `.cshtml` 視圖），並於 `CodeBlock` 標示執行範圍（可獨立執行 Console / 需放在指定專案 / 概念反例片段）。
- 於 `src/domain/` 與 `src/interactive/` 新增第 03–08 章純領域模擬與雙欄互動面板，同步程式碼高亮度行號與互動檢查問答卡片。

### 3. 後續階段保留事項（已於 Stage 3 執行簡報與流程部分）
- 獨立產出可離線下載之 HTML 教學簡報匯出檔與公開瀏覽簡報系統。
- 新增第 09 章「依賴注入（Dependency Injection）」仍保留於第 4 獨立階段實作。

---

## Stage 3：教學 HTML 簡報、A–F 工作流程圖與繳交紀錄完善

- **實際執行模型與環境資訊**：AI Studio 建置環境、`models/gemini-4-hydrogen`（執行日期：`2026-11-14`；本容器未安裝 `.NET SDK`）。
- **實際執行步驟與產物**：
  1. **訂定簡報單一來源同步規則**：於 `AGENTS.md` 新增第 4.4 與 6.3 節，並在 `wiki/concepts/01..08.md` Frontmatter 補上 `slideExampleId` 與 `slideLineRange`，讓教材與簡報直接共用同一份 `.cs`／`.cshtml` 檔案片段。
  2. **同步修正實讀對照發現**：檢查 `BankAccount.cs` 時發現第 02 章逐行解說誤將 `OperationResult` 寫為 `record` 且行號略偏，已修正為 `sealed class OperationResult` 與實際第 19–23、32–57 行。
  3. **建置雙軌 21 頁 HTML 簡報系統**：建立 `src/lib/slidesBuilder.ts`、升級 `src/pages/SlidesPage.tsx`、於 `src/index.css` 新增 A4 橫式 `@media print` 展開全部 21 頁規則與 `.slides-focus-mode` 替代樣式，並撰寫 `scripts/generate-slides.mjs` 產出零相依獨立 HTML 檔 `public/slides.html`（共 21 頁）。
  4. **增強無障礙與權限備援**：為 `SlidesPage.tsx`、`public/slides.html` 加入輸入框／程式碼區域防誤觸左右鍵判定、全螢幕權限受限時自動切換「專注滿版閱讀模式」；為 `CodeBlock.tsx` 補上 `execCommand` 與可選取手動複製框備援。
  5. **重構工作流程圖與文件**：更新 `docs/workflow.md` 與 `src/components/WorkflowGraph.tsx`，以互動 SVG 圖清楚呈現 A–F 六節點、四條退回／擴充回路與五項節點規格，並另設「概念知識關聯圖」明確區分兩種圖表；同步完善 `docs/requirements.md`、`docs/reflection.md`、`docs/verification.md` 與 `docs/submission-guide.md`。
- **尚待第 4 階段與使用者端執行項目**：
  - GitHub Repository 建立與 GitHub Pages 公開部署及實機截圖。
  - 第 4 階段新增第 09 章「依賴注入」擴充實驗（已於下方 Stage 4 完成）。
  - 具 `.NET 8 SDK` 環境下之 `dotnet build` / `dotnet run` 實測。

---

## Stage 4：第 09 章擴充實驗、風險導向自動化測試與 GitHub Pages 部署整備

- **實際執行模型與環境資訊**：AI Studio 建置環境、`models/gemini-4-hydrogen`（執行日期：`2026-11-14`；Node `v22.23.2`、Bun `1.4.4`、無 `.NET SDK`、無瀏覽器執行檔、未連結 Git 遠端）。
- **依循 `AGENTS.md` 完成第 09 章「依賴注入入門」擴充**：
  1. **來源實讀與 Ingest**：以 Node `fetch` 實測取得 HTTP 200 正文並閱讀 Microsoft Learn 官方《Dependency injection - .NET》與《Dependency injection guidelines - .NET》，於 `sources/registry.json` 登錄為 `src-ms-dotnet-di` 與 `src-ms-dotnet-di-guidelines`（`status: "ingested"`、`readDate: "2026-11-14"`），建立 `wiki/sources/src-ms-dotnet-di.md` 與 `wiki/sources/src-ms-dotnet-di-guidelines.md`，並更新 `src-ms-dotnet-arch-principles` 與 `src-ms-csharp-interfaces` 的章節關聯。
  2. **C# 範例與九段教材**：建立 `examples/csharp/09-dependency-injection/`（`ConceptLab.Ch09.csproj`、`FileProcessingDI.cs`、`TightFileProcessor.cs`、`Program.cs`）與 `wiki/concepts/09-dependency-injection.md`，以「檔案處理服務替換紀錄方式」為情境，明確區分依賴反轉原則（DIP）與建構式依賴注入（DI），並與第 06 章互相連結。
  3. **領域模擬、圖解與互動整合**：建立 `src/domain/dependencyInjectionSim.ts`、`src/interactive/DependencyInjectionDemo.tsx`，於 `src/interactive/registry.ts` 登錄 `file-processor-di`，並於 `src/components/DiagramViewer.tsx` 補上概念圖解；導覽、搜尋與 23 頁 HTML 簡報（`#/slides` 與 `public/slides.html`）自動納入第 09 章。
- **發現之規則缺口與 `AGENTS.md` 最小修正**：
  - *問題 1*：`AGENTS.md` 第 6.1 節未要求同步檢查 `DiagramViewer.tsx` 圖解與 UI／簡報中寫死的「八章」字樣，且 6.1 節寫 `wiki/sources/<slug>.md` 與 2.2 節 `<source-id>.md` 不一致。
  - *問題 2*：`AGENTS.md` 第 3.2 節未規範反例片段命名，導致 `src/lib/contentLoader.ts` 先前只能硬編碼比對特定檔名。
  - *最小修正*：更新 `AGENTS.md` 第 1.3、3.2、6.1、7.1 節，統一規範 `<source-id>.md`、反例檔採 `Tight*.cs`／`*Before.cs` 命名並讓 `contentLoader.ts` 自動辨識、補上 `DiagramViewer.tsx` 與動態章節數檢查要求，同時將 `KnowledgeBasePage.tsx`、`WorkflowGraph.tsx`、`slidesBuilder.ts` 與 `scripts/generate-slides.mjs` 改為動態呈現 9 章與 23 頁簡報。
- **GitHub Pages CI/CD 實測調整與自動化測試**：
  - 測試 `npm install --package-lock-only` 時實測發現 `vite@8.3.8` 與 `esbuild@^0.25.0` 在嚴格 `npm` peer dependency 檢查會回報 `ERESOLVE`，而專案既有 `bun.lock` 可於 `bun install --frozen-lockfile` 無誤解析；因此 `.github/workflows/deploy.yml` 採用 `actions/checkout@v4`、`actions/setup-node@v4`（Node 22）、`oven-sh/setup-bun@v2`（Bun 1.4.4，`bun install --frozen-lockfile`）、`actions/configure-pages@v5`、`actions/upload-pages-artifact@v3` 與 `actions/deploy-pages@v4`，並於 `README.md` 同時註明兩種安裝方式與公開部署步驟。
  - 新增 `tests/domain-and-integrity.test.ts`（`npm test`），對領域規則、狀態轉換、來源引用、9 章唯一性與 `./` 相對路徑產物執行真實測試（8/8 通過）。
- **仍待使用者於本地／遠端完成項目**：
  - 初始化 Git、推送至 GitHub 並啟用 GitHub Pages，取得真實公開網址後執行跨頁與重整驗證。
  - 依 `docs/verification.md` 人工操作清單以桌面／平板／手機實機瀏覽器完成視覺、鍵盤、全螢幕與另存 PDF 檢查並擷取 11 張報告截圖。
  - 於具 `.NET 8 SDK` 環境執行各章 `dotnet run` 驗證輸出。

