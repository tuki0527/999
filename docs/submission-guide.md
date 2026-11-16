# 期末繳交 PDF 報告架構與截圖清單（Submission Guide）

本文件專為整理「期末繳交 PDF 報告」而設，嚴格區分**已完成可直接使用之專案事實**與**仍待使用者親自補填／截圖項目**，確保報告內容完全真實可查。

---

## 一、作業核心項目自我檢核表（8 項對照）

| 項次 | 作業要求項目 | 目前完成狀態 | 對應檔案或網頁位置 | 待使用者補齊項目 |
| --- | --- | --- | --- | --- |
| 1 | 專案簡介、副標題、讀者定位與選題理由 | 已完成 | `README.md`、`docs/requirements.md` | 視報告篇幅精簡摘要 |
| 2 | 公開 GitHub Repository 與 GitHub Pages 網址 | 專案已備妥 `base: './'` 與 `HashRouter` | `vite.config.ts`、`src/App.tsx` | 推送 GitHub 後補上兩個真實網址 |
| 3 | 根目錄規範 `AGENTS.md` 與後續擴充指南 | 已完成（含第 4.4／6.3 節簡報規則） | `AGENTS.md`（第 1–7 節） | 附上截圖與重點摘要說明 |
| 4 | 至少 5 篇主題來源 Ingest 證據與 Wiki 紀錄 | 已完成（10 篇主題／補充 + 2 篇方法論） | `sources/registry.json`、`wiki/sources/*.md`、`wiki/log.md` | 截圖呈現登錄狀態與筆記 |
| 5 | AI 討論紀錄截圖與實際使用模型／版本 | 模型已記錄（`models/gemini-4-hydrogen`） | `docs/process-log.md` | 補上第 1 輪選題討論與對話截圖 |
| 6 | 需求規格、23 頁 HTML 簡報、Workflow 與迴圈圖 | 已完成（雙軌 `#/slides` 與 `./slides.html`） | `docs/requirements.md`、`docs/workflow.md`、`#/slides`、`#/process` | 補上簡報、列印與流程圖截圖 |
| 7 | 製作過程紀錄、真實檢查結果、反思與個人心得 | 系統紀錄已完成；個人心得待填寫 | `docs/process-log.md`、`docs/verification.md`、`docs/reflection.md` | 撰寫使用者視角的真實心得 |
| 8 | 第 4 階段擴充示範（新增 `09-dependency-injection`） | 已完成（第 09 章與 8/8 自動化測試） | `wiki/concepts/09-dependency-injection.md`、`src/interactive/DependencyInjectionDemo.tsx` | 補上擴充前後說明與頁面截圖 |

---

## 二、PDF 報告建議章節草稿（可直接貼入文書排版軟體）

> **撰寫原則**：以下標示 `[已完成事實]` 者可直接採用；標示 `[待使用者填寫／補圖]` 者請於實際推送、部署與完成第 4 階段後補入真實資訊，切勿保留未實測之假定內容。

#### 第 1 節：專案簡介與選題理由（[已完成事實]）
- **專案名稱**：程式觀念實驗室
- **副標題**：從物件導向到 MVC 與低耦合設計
- **目標讀者**：已掌握變數、型別、條件判斷（`if/else`）、迴圈與函式的初學者，正要過渡至類別設計、資料保護、職責切分與系統可維護性。
- **技術分工與主題選擇**：以 **C#（.NET 8 / C# 12）** 作為統一範例語言，從「學生名冊、銀行帳戶、交通工具與引擎、動物發聲、圖形與繪製能力、訂單計算與通知、圖書查詢 MVC、待辦事項重構」八個主線情境推進到第 09 章「檔案處理服務替換紀錄方式（依賴注入入門）」；網站前端採用 React + TypeScript + Vite 製作純靜態互動教學網站與 HTML 簡報，以 TypeScript 領域模擬器同步對應 C# 程式碼行號，避免在無後端編譯器時誤導讀者。

### 第 2 節：公開連結與模型環境資訊
- **GitHub Repository 連結**：`[待使用者填寫：推送至 GitHub 後填入 https://github.com/<帳號>/<儲存庫名稱>]`
- **GitHub Pages 公開網頁連結**：`[待使用者填寫：啟用 Pages 後填入 https://<帳號>.github.io/<儲存庫名稱>/#/]`
- **獨立 HTML 簡報連結**：`[待使用者填寫：https://<帳號>.github.io/<儲存庫名稱>/slides.html（網站內亦提供 #/slides）]`
- **實際使用之 AI 模型與環境（[已完成事實]）**：
  - 開發模型：`models/gemini-4-hydrogen`（AI Studio 建置環境）
  - 前端技術棧：React 19 + TypeScript + Vite 8 + Tailwind CSS v4
  - 環境限制：`DOTNET_NOT_INSTALLED`（建置容器未安裝 `.NET SDK`，故所有 C# 範例維持誠實標示 `unverified-no-dotnet`）；且本容器無瀏覽器二進位檔，跨裝置實機視覺檢查待部署後人工確認。

### 第 3 節：專案規範（`AGENTS.md`）與 Wiki 知識庫設計（[已完成事實]）
- **先寫規範再實作（Rule-First）**：`AGENTS.md` 明文規範繁體中文台灣常用技術用語、C# 與 TypeScript 的模擬邊界（含第 02 章整數分 `balanceCents` 對應 `decimal`）、`sources/registry.json` 的 `readDate: null` 誠實原則、九段固定教材結構、第 4.4／6.3 節簡報同步規範，以及第 4 階段擴充時補充的反例命名與圖解檢查規則。
- **來源 Ingest 成果**：登錄 15 筆資料，實際擷取並整理 **10 篇主題／補充來源**（9 篇 Microsoft Learn 官方文件 S01–S09 + 伊果物件導向系列第 0、1、3、8 篇正文）與 **2 篇方法論參考**（Karpathy / Farza LLM Wiki Gist）；兩篇 Medium 補充連結因實測遇 HTTP 403 Cloudflare 阻擋而誠實標記為 `unavailable`（`readDate: null`），另保留 `src-ms-csharp-oop` 為 `pending`。

### 第 4 節：教學網站、互動實驗室與 23 頁 HTML 簡報（[已完成事實]）
- **網站知識庫（`#/`、`#/wiki/<slug>`）**：九章完整教材、雙題以上小練習解析、C# 多檔檢視與複製備援（`navigator.clipboard` -> `execCommand` -> 可選取手動複製框）、九套無 React 相依的 TypeScript 領域模擬器。
- **HTML 教學簡報（`#/slides` 與 `./slides.html`，共 23 頁）**：由 `src/lib/slidesBuilder.ts` 與 `scripts/generate-slides.mjs` 直接讀取 `wiki/concepts/*.md` 與 `examples/csharp/**` 指定行段產生，涵蓋封面、讀者前提與九章路線、九大主題「觀念頁＋程式碼／案例頁」（共 18 頁）、跨章維度總整理、來源狀態與結語頁。支援章節目錄、全螢幕與權限受限時的「專注滿版閱讀模式」、防誤觸鍵盤左右鍵、手機垂直閱讀，以及 A4 橫式 `@media print` 展開全部 23 頁另存 PDF。

### 第 5 節：工程 Workflow 與檢查回路（[已完成事實]）
- 本專案明確區分兩種圖表（詳見 `docs/workflow.md` 與網站 `#/process`）：
  1. **工作流程與迴圈圖（A–F 六節點）**：記錄 `A 取得來源與登錄 -> B Ingest 與 Wiki 整合 -> C 觀念、來源及程式碼檢查 -> D 依規則生成教材與 HTML 簡報 -> E 瀏覽、互動及建置檢查 -> F 公開部署與執行反思`，並明確標註四條回饋／擴充回路（來源不足回 A、觀念／引註有誤回 B/C、互動／簡報／建置異常回 D 或 C、新章擴充由 F 回 A），每個節點皆定義輸入、產出、通過條件、失敗退回對象與設計理由。
  2. **概念知識關聯圖**：僅作為學習順序與觀念依賴輔助（01–05 OOP 基礎 -> 06 耦合與內聚 -> 07 MVC -> 08 整合重構 -> 09 DI 建構式注入）。

### 第 6 節：真實驗證結果與執行反思（[已完成事實]）
- **驗證紀錄摘要（詳見 `docs/verification.md`）**：
  - `npm run build:slides`：產出 23 頁獨立 `public/slides.html`。
  - `npm test`（`tests/domain-and-integrity.test.ts`）：8/8 測試通過，驗證關鍵領域邊界、來源引用、9 章結構與 `./` 相對路徑產物。
  - `npm run lint`（`tsc --noEmit`）與 `npm run build`（`vite build`）：通過，產出 `dist/`（含 `dist/index.html` `./assets/...` 與 `dist/slides.html`）。
  - 未執行項目：環境無 `.NET SDK`（未做 `dotnet build`）；真實瀏覽器跨裝置檢查、另存 PDF 與公開網址子路徑重整待部署後補驗。
- **反思重點（詳見 `docs/reflection.md`）**：依證據誠實說明單輪統計尚不足斷定單一「最常出錯節點」，但揭露並修正了「A 外部來源 403 阻擋」「C 跨檔案行號偏移」「擴充第 09 章時的 UI 硬編碼與 `npm` peer dependency 差異」等真實問題。

### 第 7 節：第 4 階段擴充示範紀錄（[已完成事實]）
- **擴充主題與情境**：新增第 09 章 `09-dependency-injection`「依賴注入入門（檔案處理服務替換紀錄方式）」，實作 `IProcessingLogger` 與三種可抽換紀錄器，清楚區分依賴反轉（DIP）與建構式注入（DI）。
- **可延伸性實證與規則回饋**：在不改動 `LessonView`、搜尋邏輯與 `SlidesPage` 主流程下完成整合，並依實作中發現的缺口對 `AGENTS.md` 完成最小合理修訂（補充反例命名慣例、`DiagramViewer` 註冊與動態章節數提醒）。（截圖請於頁面開啟後依下方圖 10 補齊）

### 第 8 節：個人學習與操作心得（`[待使用者親自填寫]`）
> 以下為引導提綱，請依你親自與 AI 討論、審查文件、推送 GitHub Pages 與操作簡報的真實體驗撰寫，勿直接套用他人經驗：
1. **先訂規則（`AGENTS.md`）的體會**：當系統從 2 章擴展到 8 章、甚至加上 HTML 簡報與後續第 9 章時，事先規定好檔名、九段格式與 `slideLineRange` 帶來哪些實際幫助或限制？
2. **誠實標示與受阻處理的體會**：看到 Medium 403 被標成 `unavailable`、環境無 `.NET SDK` 被標成 `unverified-no-dotnet` 時，對你判斷「AI 產出可信度」有什麼啟發？
3. **跨語言教學設計的觀察**：用 React + TypeScript 模擬 C# 執行步驟與狀態變化，在教學理解上有哪些優勢或落差？
4. **後續改進想法**：若要將此知識庫交給其他同學或實際在本地搭配 `.NET 8 SDK` 跑過所有 `.csproj`，你會先補做哪一步？

---

## 三、建議截圖清單（共 11 張，依報告順序編號）

- [ ] **圖 01｜選題與規格討論紀錄**：在對話介面討論八章主題情境、C# 範例定位與 `AGENTS.md` 規劃的討論截圖。
- [ ] **圖 02｜實際使用 AI 模型與環境證明**：清楚顯示本次開發所使用模型名稱／版本（`models/gemini-4-hydrogen`）的介面或環境紀錄截圖。
- [ ] **圖 03｜`AGENTS.md` 開發規範重點**：展示根目錄 `AGENTS.md` 的九段教材結構、誠實原則與第 4.4／6.3 節簡報同步規則。
- [ ] **圖 04｜來源 Ingest 與 Wiki 紀錄**：展示網站 `#/process` 來源清單狀態（`ingested` / `unavailable` / `pending`）或 `wiki/sources/*.md`、`wiki/log.md` 內容。
- [ ] **圖 05｜教材頁面與 C# 互動實驗室（桌面 1440px）**：以第 02 章「銀行帳戶」或第 06 章「訂單耦合」為例，呈現左／上操作攔截或重構切換＋右／下 C# 程式碼同步高亮。
- [ ] **圖 06｜HTML 教學簡報操作畫面（`#/slides` 與 `./slides.html`）**：呈現簡報內容頁、章節目錄展開或「專注滿版閱讀模式」＋鍵盤／複製備援設計。
- [ ] **圖 07｜手機版響應式與列印預覽畫面**：呈現手機寬度可正常閱讀不縮成小字之畫面，以及瀏覽器列印／另存 PDF 預覽（無操作按鈕、每頁完整換頁不裁切）。
- [ ] **圖 08｜工程 Workflow 與迴圈圖（`#/process`）**：呈現網站內「Workflow 與迴圈圖」A–F SVG 流程圖、點選節點之五項規格說明，以及與下方「概念知識關聯圖」的區分。
- [ ] **圖 09｜建置與自動化一致性檢查結果**：終端機或紀錄顯示 `npm run build:slides`、`npm run lint`、`npm run build` 與一致性驗證腳本實際通過的畫面。
- [ ] **圖 10｜第 4 階段擴充示範（第 09 章依賴注入）**：於第 4 階段完成新增 `09-dependency-injection` 後，補截新增章節與同步更新後的簡報／索引畫面。
- [ ] **圖 11｜公開 GitHub Repository 與 GitHub Pages 實測畫面**：GitHub 儲存庫首頁（含清晰目錄與 README）＋ 瀏覽器實際開啟公開 `https://<username>.github.io/<repo-name>/#/` 之完整網址列截圖。
