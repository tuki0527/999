# 驗證紀錄（Verification Log）

本文件依據 `AGENTS.md` 第 7 節規定，如實記錄每一次檢查執行的指令、環境狀態與真實輸出結果。

### [2026-11-14] Stage 1 基礎架構與第 01–02 章實作驗證
- **執行動作**：新增 `AGENTS.md`、`docs/requirements.md`、來源登錄檔、八章結構、第 01–02 章教材與互動實驗室，並完成靜態前端建置。
- **涉及檔案**：
  - `AGENTS.md`、`README.md`、`index.html`、`metadata.json`、`vite.config.ts`
  - `sources/registry.json`、`wiki/**`、`examples/csharp/**`、`docs/**`
  - `src/types/**`、`src/lib/**`、`src/domain/**`、`src/interactive/**`、`src/components/**`、`src/pages/**`、`src/App.tsx`
- **執行檢查（真實執行結果）**：
  - `npm run lint`（`tsc --noEmit`）：**通過**（無任何 TypeScript 型別錯誤）。
  - `npm run build`（`vite build`）：**通過**（成功產出 `dist/`）。
  - GitHub Pages 相對路徑驗證：檢查 `dist/index.html`，確認產物使用 `./assets/...` 相對路徑，且路由採用 `HashRouter`。
  - Lockfile 檢查：確認根目錄保留可重現安裝之 `bun.lock`（與本環境套件管理一致）。
  - `dotnet --version`：**環境未安裝 `.NET SDK`（`DOTNET_NOT_INSTALLED`）**，因此 C# 範例皆於頁面及 metadata 誠實標示為「靜態教材範例・未本地編譯驗證」。
- **已知限制與待辦**：
  - 尚未實際讀取與 ingest 外部官方來源（`sources/registry.json` 目前 `readDate: null`），故第 01–02 章標示為 `draft`。
  - 第 03–08 章目前為 `planned` 大綱狀態，待下一階段來源查核後補齊。
  - 正式 HTML 教學簡報與 GitHub Actions 部署流程將於後續階段完成。

### [2026-11-14] Stage 2 實地來源 Ingest、八章教材補齊與互動模擬驗證
- **執行動作**：完成 8 篇主題／補充來源與 2 篇方法論參考之實地讀取與筆記、升級第 01–02 章為 `verified`、補齊第 03–08 章教材、C# 範例與互動模擬，並建立雙檢查問答卡片。
- **涉及檔案**：
  - `AGENTS.md`、`sources/registry.json`、`wiki/sources/*.md`
  - `wiki/concepts/01-*.md` ～ `08-*.md`、`wiki/index.md`、`wiki/log.md`
  - `examples/csharp/01-*` ～ `08-*`
  - `src/types/wiki.ts`、`src/lib/contentLoader.ts`、`src/domain/*`、`src/interactive/*`、`src/components/*`、`src/pages/*`
  - `docs/process-log.md`、`docs/reflection.md`、`docs/verification.md`
- **執行檢查（真實執行結果）**：
  - 來源存取與狀態查核：
    - `ingested` 主題／補充來源（共 8 篇）：`src-ms-csharp-classes`、`src-ms-csharp-inheritance`、`src-ms-csharp-polymorphism`、`src-ms-csharp-interfaces`、`src-ms-code-metrics-coupling`、`src-ms-aspnet-mvc`、`src-ms-dotnet-arch-principles`、`src-igouist-oo-series`。
    - `ingested` 方法論參考（共 2 篇，另計）：`src-ref-karpathy-llm-wiki`、`src-ref-farza-wiki-skill`。
    - `unavailable`（HTTP 403 Cloudflare 阻擋，`readDate: null`）：`src-medium-oop-concept`、`src-medium-mvc-spa-ssr`。
    - `pending`（`readDate: null`）：`src-ms-csharp-oop`。
  - 內容與註冊表一致性檢查腳本：確認 8 篇概念檔皆為 `status: verified`、具備 9 大固定章節標題、各至少 2 題互動檢查解析、`sourceIds` 皆對應 `ingested` 來源、`exampleIds` 檔案皆存在、`demoId` 皆註冊於 `src/interactive/registry.ts`。
  - `npm run lint`（`tsc --noEmit`）與 `npm run build`（`vite build`）：通過，產出 `dist/`。
  - GitHub Pages 相對路徑驗證：`dist/index.html` 維持 `./assets/...` 相對路徑與 `HashRouter`。
  - C# 本地編譯：`dotnet --version` 回傳 `DOTNET_NOT_INSTALLED`，全部八章維持 `compileStatus: unverified-no-dotnet`。
- **已知限制與待辦**：
  - 兩篇 Medium 來源受環境 HTTP 403 阻擋，未納入 `ingested`；第 07 章 SPA/SSR 深度對照標記為待驗證。
  - 無本地 `.NET SDK` 執行 `dotnet build`，C# 範例僅供靜態教學與語法審查。
  - 獨立下載版 HTML 簡報匯出與第 09 章「依賴注入」擴充實驗保留至後續階段。

### [2026-11-14] Stage 3 雙軌 21 頁 HTML 簡報、A–F Workflow 圖與繳交文件驗證
- **實際模型與環境**：AI Studio 建置環境、`models/gemini-4-hydrogen`（執行日期：`2026-11-14`；`.NET SDK` 狀態：`DOTNET_NOT_INSTALLED`）。
- **執行動作**：完成單一來源簡報規則制定（`AGENTS.md` 第 4.4／6.3 節）、21 頁網站簡報與獨立離線檔 `public/slides.html` 產出、A–F 互動工程流程圖與迴圈說明、`CodeBlock` 剪貼簿備援、全螢幕專注模式備援、A4 橫式列印樣式及完整繳交檢核文件。
- **涉及檔案**：
  - `AGENTS.md`、`package.json`、`scripts/generate-slides.mjs`、`public/slides.html`
  - `wiki/concepts/01-*.md` ～ `08-*.md`、`wiki/log.md`
  - `src/types/wiki.ts`、`src/lib/wikiParser.ts`、`src/lib/slidesBuilder.ts`
  - `src/components/CodeBlock.tsx`、`src/components/WorkflowGraph.tsx`、`src/pages/SlidesPage.tsx`、`src/index.css`
  - `docs/requirements.md`、`docs/workflow.md`、`docs/process-log.md`、`docs/reflection.md`、`docs/verification.md`、`docs/submission-guide.md`
- **執行檢查（真實執行結果）**：
  - `npm run build:slides`（`node scripts/generate-slides.mjs`）：**通過**，成功輸出 `public/slides.html`（共 21 頁簡報）。
  - 簡報與內容一致性 Node 驗證腳本：**通過**（`ALL_CHECKS_PASSED { slidesCount: 21, conceptsChecked: 8 }`），實測驗證：
    - `public/slides.html` 內含 21 頁 `<article class="slide`、`@media print`、`manual-copy-box`、`focus-mode`、`ArrowLeft`/`ArrowRight` 鍵盤處理，且內嵌 `<script>` 經 `new Function()` 語法解析無誤。
    - 8 篇概念檔的 `slideExampleId` 實體檔案存在、`slideLineRange` 皆落在 `.cs`/`.cshtml` 實際行數範圍內、9 大固定標題順序完整、`sourceIds` 皆對應 `ingested` 來源、`exampleIds` 與 `demoId` 皆有效對齊。
  - `npm run lint`（`tsc --noEmit`）與 `npm run build`（`npm run build:slides && vite build`）：將接續於本輪檔案定稿後執行並確認 `dist/slides.html` 與 `dist/index.html` 產出。
  - C# 本地編譯：`dotnet --version` 仍為 `DOTNET_NOT_INSTALLED`，全部八章維持 `compileStatus: unverified-no-dotnet`。
- **本階段實作中發現並修正之真實問題**：
  - 核對 `examples/csharp/02-encapsulation/BankAccount.cs` 時，修正 `wiki/concepts/02-encapsulation.md` 逐行說明將 `public sealed class OperationResult` 誤記為 `record` 以及第 19–23、32–57 行號偏移問題。
  - 補足 `CodeBlock.tsx` 在受限瀏覽器環境（無 Clipboard API 權限）僅靜默失敗的缺口，新增 `execCommand('copy')` 與可選取手動複製框。
  - 補足 `SlidesPage.tsx` 與 `public/slides.html` 在 iframe／受限視窗無法使用 Fullscreen API 時之「專注滿版閱讀模式」替代方案，以及文字輸入／程式碼區塊焦點防誤觸左右翻頁保護。
- **已知限制與待辦**：
  - 本環境無 `.NET SDK`，尚未實際執行 `dotnet build` / `dotnet run`。
  - 真實瀏覽器「另存 PDF」列印畫面、手機觸控寬度實測與 11 張報告截圖，需於 GitHub Pages 公開部署或本機開啟後實際補驗。
  - 第 4 階段擴充實驗（新增 `09-dependency-injection`）保留至下一階段獨立執行。

### [2026-11-14] Stage 4 第 09 章擴充實驗、風險測試與部署整備驗證
- **實際模型與環境**：AI Studio 建置環境、`models/gemini-4-hydrogen`（執行日期：`2026-11-14`；Node `v22.23.2`、npm `10.9.8`、Bun `1.4.4`、無 `.NET SDK`、無瀏覽器二進位檔 `NO_BROWSER_BIN`、無遠端 Git 儲存庫 `NO_GIT`）。
- **執行動作**：完成第 09 章「依賴注入入門」來源 ingest、C# 範例、教材、圖解、互動模擬、23 頁簡報更新、`AGENTS.md` 最小修正、自動化領域測試 `tests/domain-and-integrity.test.ts`、`.github/workflows/deploy.yml` 與 `README.md` 整備。
- **涉及檔案**：
  - 規則與索引：`AGENTS.md`、`wiki/index.md`、`wiki/log.md`、`sources/registry.json`
  - 新增來源筆記：`wiki/sources/src-ms-dotnet-di.md`、`wiki/sources/src-ms-dotnet-di-guidelines.md`（並更新 `src-ms-dotnet-arch-principles.md`）
  - 新增／修改教材與 C# 範例：`wiki/concepts/09-dependency-injection.md`、`wiki/concepts/06-coupling-and-cohesion.md`、`examples/csharp/README.md`、`examples/csharp/09-dependency-injection/*`
  - 前端程式與簡報腳本：`src/domain/dependencyInjectionSim.ts`、`src/interactive/DependencyInjectionDemo.tsx`、`src/interactive/registry.ts`、`src/components/DiagramViewer.tsx`、`src/components/WorkflowGraph.tsx`、`src/lib/contentLoader.ts`、`src/lib/slidesBuilder.ts`、`src/pages/KnowledgeBasePage.tsx`、`scripts/generate-slides.mjs`、`public/slides.html`
  - 測試、部署與文件：`tests/domain-and-integrity.test.ts`、`package.json`、`README.md`、`.github/workflows/deploy.yml`、`.github/workflows/README.md`、`docs/process-log.md`、`docs/verification.md`、`docs/reflection.md`、`docs/submission-guide.md`
- **執行檢查（真實指令與實測輸出）**：
  - `npm run build:slides`：**通過**（`total slides = 23`，輸出 `public/slides.html`）。
  - `npm run lint`（`tsc --noEmit`）：**通過**（0 個型別錯誤）。
  - `npm test`（`tsx --test tests/domain-and-integrity.test.ts`）：**通過（8/8 測試通過，0 失敗）**：
    1. Ch 02 銀行帳戶：非法負數／0 存款及超額提款均被攔截且餘額維持 `100000` 分不變；`0.1 + 0.2` 精確等於 `30` 分；合法加減與格式化正確。
    2. Ch 04 多型：`dog` / `cat` / `duck` / `base` 輸出各異，行號皆位於 `AnimalChorus.cs` 總行數內。
    3. Ch 07 MVC：查詢 `""`、`mvc`、`完全不存在書名` 後，資料筆數與 `steps[0..3]` 摘要及 `Index.cshtml` 高亮行（含空結果分支 `[12..15]`）同步更新。
    4. Ch 08 待辦重構：初始 2 筆狀態、`data`/`service`/`view`/`before` 層級對應行號皆在 `.cs` 範圍內。
    5. Ch 09 依賴注入：`constructor-di` 替換 `console`/`file`/`null` 時 `fileProcessorChanged === false` 且輸出與邊界驗證正確；`hardcoded` 反例欲抽換紀錄器時回傳 `fileProcessorChanged === true`。
    6. `localStorage` 封裝：驗證無 `window` 安全降級（`storageAvailable: false`）與讀寫／重置一致性。
    7. Wiki 9 章完整性：驗證 9 章 `id`/`slug`/`order` 唯一、9 大章節順序一致、引用之 `sourceIds` 皆為 `ingested`、`relatedIds`/`prerequisites`/`exampleIds`/`slideExampleId`/`slideLineRange`/`demoId` 皆有效可解析、搜尋可命中第 09 章。
    8. 部署與簡報檢查：驗證 `vite.config.ts` 設 `base: './'`、`src/App.tsx` 使用 `HashRouter`、`public/slides.html` 含 23 頁投影片、`@media print`、`manual-copy-box`、`focus-mode`、`./#/wiki/dependency-injection` 且內嵌腳本語法無誤。
  - `npm run build`：**通過**（`vite build` 產出 `dist/index.html` 含 `./assets/...` 相對路徑與 `dist/slides.html` 91 KB，無 `/assets/` 絕對根路徑）。
  - `bun install --frozen-lockfile --dry-run`：**通過**（10ms 完成鎖定檔解析）；實測 `npm install --package-lock-only` 則因 `vite@8.3.8` `peerOptional esbuild` 差異失敗（`ERESOLVE`），故 CI workflow 採用 `bun install --frozen-lockfile` 並於 `README.md` 註明 `npm install --legacy-peer-deps`。
  - C# 本地編譯：`dotnet --version` 回傳 `not found`（`DOTNET_NOT_INSTALLED`），全九章維持標示 `unverified-no-dotnet`。
- **瀏覽器、視覺與公開部署驗證（標記為：待執行）**：
  - 因本環境無無頭瀏覽器工具（`NO_BROWSER_BIN`）且尚未連結 GitHub 遠端（`NO_GIT` / `NO_REMOTE`），以下項目列為人工操作清單，待您於本機及 GitHub Pages 公開網址逐項實測後再更新狀態：
    1. **桌面（1440px）、平板（768px）、手機（375px）響應式檢視**：確認無水平卷軸、抽屜側欄與互動頁籤切換正常。
    2. **程式碼區塊互動檢查**：切換多檔頁籤、測試行號與重點行高亮、檢視縮排、測試複製按鈕與受限複製備援框、放大 Modal。
    3. **簡報互動與列印檢查（`#/slides` 與 `./slides.html`）**：測試鍵盤左右鍵（且輸入框／程式碼區聚焦時不誤觸）、全螢幕／專注模式切換、瀏覽器「列印 → 另存 PDF」確認 23 頁皆展開且無裁切。
    4. **第 08 章瀏覽器實作待辦增刪改與 `localStorage` 持久化**：在網頁介面實際新增、完成、刪除、空白送出攔截、切換重整後確認進度保存及「還原預設進度」。
    5. **GitHub Pages 公開網址子路徑重整驗證**：推送後於 `https://<帳號>.github.io/<repo>/#/wiki/dependency-injection` 與 `./slides.html` 按 F5 重整，確認無 404 錯誤。



