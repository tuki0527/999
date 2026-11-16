# Wiki 維護與查核紀錄（Log）

本文件依據 `AGENTS.md` 第 7.2 節格式，記錄每一次知識庫建立、來源 ingest、教材修訂與驗證狀態。

### [2026-11-14] Stage 1 基礎架構與第 01、02 章草稿建立
- **執行動作**：新增規範文件、來源登錄結構、八章索引、第 01–02 章完整教材草稿與 C# 範例檔。
- **涉及檔案**：
  - `AGENTS.md`、`docs/requirements.md`
  - `sources/registry.json`、`wiki/index.md`、`wiki/sources/*.md`
  - `wiki/concepts/01-classes-and-objects.md` ～ `08-integration-and-refactoring.md`
  - `examples/csharp/01-classes-and-objects/*`、`examples/csharp/02-encapsulation/*`
- **來源查核狀態**：6 筆官方來源已完成穩定 ID 登錄（`status: "registered"`，`readDate: null`），尚未於本階段進行外部內容擷取與查核，故第 01–02 章暫標為 `draft`。
- **已知限制與待辦**：
  - 下一階段須優先執行來源 ingest（至少 5 篇主題資料），再回頭修訂第 01–02 章並補齊第 03–08 章。
  - 本環境無 `.NET SDK`，C# 程式碼尚未執行本地編譯驗證。

### [2026-11-14] Stage 2 實地來源 Ingest 與初版八章教材及互動實驗室補齊
- **執行動作**：完成真實來源讀取與筆記撰寫、修訂第 01–02 章、補齊第 03–08 章教材與 C# 範例專案，並實作第 03–08 章互動概念模擬。
- **來源 Ingest 實況（總計登錄 13 筆）**：
  - **主題／補充來源（`ingested` 共 8 篇）**：`src-ms-csharp-classes`、`src-ms-csharp-inheritance`、`src-ms-csharp-polymorphism`、`src-ms-csharp-interfaces`、`src-ms-code-metrics-coupling`、`src-ms-aspnet-mvc`、`src-ms-dotnet-arch-principles`、`src-igouist-oo-series`（追讀第 0、1、3、8 篇正文）。
  - **方法論參考（`ingested` 共 2 篇，不計入主題來源）**：`src-ref-karpathy-llm-wiki`、`src-ref-farza-wiki-skill`。
  - **存取受阻（`unavailable` 共 2 篇，`readDate: null`）**：`src-medium-oop-concept`、`src-medium-mvc-spa-ssr`（Medium Cloudflare HTTP 403 阻擋，未採摘要充數）。
  - **待讀取（`pending` 共 1 篇，`readDate: null`）**：`src-ms-csharp-oop`。
- **涉及檔案**：
  - `AGENTS.md`、`sources/registry.json`、`wiki/sources/*.md`
  - `wiki/concepts/01-classes-and-objects.md` ～ `08-integration-and-refactoring.md`、`wiki/index.md`
  - `examples/csharp/01-*` ～ `08-*`（含 `.csproj` 與 MVC Razor View）
  - `src/domain/*.ts`、`src/interactive/*.tsx`、`src/components/*`、`src/pages/*`
- **已知限制與待辦**：
  - 本環境無 `.NET SDK`（`DOTNET_NOT_INSTALLED`），全部八章維持 `compileStatus: unverified-no-dotnet`。
  - 第 07 章延伸對照 `src-medium-mvc-spa-ssr` 因 HTTP 403 未取得正文，該對照段落明確標記「待驗證」。
  - 獨立輸出之單檔 HTML 簡報與第 09 章「依賴注入」擴充實驗保留至後續獨立階段。

### [2026-11-14] Stage 3 簡報單一來源同步、第 02 章行號勘誤與 Workflow／繳交文件更新
- **執行動作**：於 `AGENTS.md` 建立第 4.4／6.3 節簡報同步規則、為八篇概念檔補齊 `slideExampleId` 與 `slideLineRange`、產生 21 頁 HTML 簡報（網站 `#/slides` 與獨立 `public/slides.html`），並重整 A–F 工程流程圖與繳交紀錄文件。
- **涉及檔案**：
  - `AGENTS.md`、`wiki/concepts/01-*.md` ～ `08-*.md`、`wiki/log.md`
  - `src/types/wiki.ts`、`src/lib/wikiParser.ts`、`src/lib/slidesBuilder.ts`、`scripts/generate-slides.mjs`、`public/slides.html`
  - `src/components/CodeBlock.tsx`、`src/components/WorkflowGraph.tsx`、`src/pages/SlidesPage.tsx`、`src/index.css`
  - `docs/requirements.md`、`docs/workflow.md`、`docs/process-log.md`、`docs/verification.md`、`docs/reflection.md`、`docs/submission-guide.md`
- **品質修訂紀錄**：比對 `examples/csharp/02-encapsulation/BankAccount.cs` 時，修正 `wiki/concepts/02-encapsulation.md` 內 `OperationResult` 誤寫為 `record` 之文字（應為 `sealed class OperationResult`）並對齊第 19–23、32–57 行號。
- **已知限制與待辦**：
  - 全八章維持 `compileStatus: unverified-no-dotnet`（無 `.NET SDK`）。
  - 兩篇 Medium 來源仍標為 `unavailable`（HTTP 403），`src-ms-csharp-oop` 維持 `pending`。
  - 第 09 章「依賴注入」擴充保留至第 4 階段執行。

### [2026-11-14] Stage 4 擴充實驗：新增第 09 章「依賴注入入門」與完整驗收
- **執行動作**：依 `AGENTS.md` 第 6.1 節實讀並 ingest 兩篇 Microsoft Learn 官方 DI 文件、建立第 09 章 C# 範例、教材正文、圖解與互動實驗室、同步擴充為 23 頁 HTML 簡報、建立領域自動化測試與 GitHub Pages 部署 workflow。
- **來源 Ingest 更新（總計登錄 15 筆）**：
  - 新增 `ingested` 主題來源（累計主題／補充來源達 10 篇 + 方法論 2 篇）：`src-ms-dotnet-di`、`src-ms-dotnet-di-guidelines`，並補充 `src-ms-dotnet-arch-principles`、`src-ms-csharp-interfaces` 對 `09-dependency-injection` 的引用關聯。
- **涉及檔案**：
  - `AGENTS.md`（最小修正第 1.3、3.2、6.1、7.1 節）、`sources/registry.json`、`wiki/index.md`、`wiki/log.md`
  - `wiki/sources/src-ms-dotnet-di.md`、`wiki/sources/src-ms-dotnet-di-guidelines.md`、`wiki/sources/src-ms-dotnet-arch-principles.md`
  - `wiki/concepts/09-dependency-injection.md`、`wiki/concepts/06-coupling-and-cohesion.md`、`examples/csharp/09-dependency-injection/*`
  - `src/domain/dependencyInjectionSim.ts`、`src/interactive/DependencyInjectionDemo.tsx`、`src/interactive/registry.ts`、`src/components/DiagramViewer.tsx`、`src/lib/contentLoader.ts`、`src/lib/slidesBuilder.ts`、`src/pages/KnowledgeBasePage.tsx`、`src/components/WorkflowGraph.tsx`、`scripts/generate-slides.mjs`、`public/slides.html`
  - `tests/domain-and-integrity.test.ts`、`package.json`、`.github/workflows/deploy.yml`、`.github/workflows/README.md`、`README.md`、`docs/*`
- **已知限制與待辦**：
  - 本環境無 `.NET SDK`（`DOTNET_NOT_INSTALLED`），全九章維持 `compileStatus: unverified-no-dotnet`。
  - 兩篇 Medium 來源維持 `unavailable`，`src-ms-csharp-oop` 維持 `pending`。
  - 實機瀏覽器排版列印與 GitHub Pages 公開網址子路徑驗證待部署後由使用者實測完成。



