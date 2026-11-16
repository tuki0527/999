# 程式觀念實驗室（Concept Lab）

**副標題**：從物件導向到 MVC 與低耦合設計  
**教學語言**：C#（.NET 8 / C# 12 範例語法）  
**網站技術**：React + TypeScript + Vite（純靜態前端，支援 GitHub Pages 子路徑部署）

---

## 專案簡介與教學範圍

「程式觀念實驗室」是一套以 C# 範例說明通用程式設計觀念的 LLM Wiki 教學網站與簡報系統。目標讀者為已學會變數、條件判斷（`if/else`）、迴圈與函式的初學者，透過 **9 個循序漸進的情境章節**（第 01–08 章主線 ＋ 第 4 階段擴充驗證新增之第 09 章「依賴注入入門」），學習如何保護狀態、組織物件、切分職責並降低耦合。

- **C# 範例定位**：展示物件導向、MVC 與依賴注入語意（皆附 `.csproj`）。
- **前端互動模擬**：以純 TypeScript（`src/domain/`）模擬物件狀態與規則檢查，明確標示為「TypeScript 概念模擬（非瀏覽器執行 C#）」。

---

## 完整專案結構（開發原始碼 vs 部署產物）

本儲存庫採原始碼與靜態產物分離設計（`dist/` 由 `.gitignore` 排除，不在開發分支追蹤）：

| 路徑 | 類別 | 說明 |
| :--- | :--- | :--- |
| `AGENTS.md` | 開發規則 | 專案最高開發與維護規範（含 9 段式教材格式、來源誠實原則與簡報同步規則） |
| `sources/registry.json` | 來源登錄檔 | 記錄 15 筆來源 ID、URL、讀取日期、讀取方式與狀態（`ingested` / `unavailable` / `pending`） |
| `wiki/index.md`、`wiki/log.md` | Wiki 索引與紀錄 | 全站章節路線與異動日誌 |
| `wiki/concepts/01..09.md` | 教材原始檔（開發） | 9 篇核心教材正文（單一資料來源） |
| `wiki/sources/*.md` | 來源筆記（開發） | 各外部來源閱讀摘要、適用範圍與限制提醒 |
| `examples/csharp/01..09/` | C# 範例原始碼 | 各章獨立 `.cs` / `.cshtml` 原始碼與 `.csproj` 專案檔 |
| `src/` | 前端原始碼（開發） | `types/`、`lib/`、`domain/`（純模擬邏輯）、`interactive/`、`components/`、`pages/` |
| `scripts/generate-slides.mjs` | 簡報同步腳本 | 從 `wiki/concepts/`、`examples/csharp/` 與 `sources/registry.json` 輸出 `public/slides.html`（23 頁） |
| `tests/domain-and-integrity.test.ts` | 自動化測試 | 測試領域規則、狀態轉換、來源引用、ID 唯一性與相對路徑部署結構 |
| `docs/*.md` | 專案紀錄文件 | `requirements.md`、`workflow.md`、`process-log.md`、`verification.md`、`reflection.md`、`submission-guide.md` |
| `.github/workflows/deploy.yml` | CI/CD 部署設定 | GitHub Actions 自動檢查、測試、建置並部署至 GitHub Pages |
| **`dist/`（建置產物，Git 忽略）** | **最終部署產物** | 執行 `npm run build` 後產生，含 `dist/index.html`、`dist/assets/*` 與 `dist/slides.html` |

---

## 安裝、開發、測試與建置指令

本專案使用 `bun.lock` 作為鎖定檔（建議使用 Bun `1.4.4+` 與 Node.js `22+`）：

```bash
# 1. 可重現安裝相依套件（對應 bun.lock）
bun install --frozen-lockfile
# 若本地未安裝 Bun 改用 npm，因 vite@8.3.8 peerOptional 與 esbuild@^0.25.0 差異，請使用：
# npm install --legacy-peer-deps

# 2. 啟動本地開發伺服器（http://localhost:3000/#/）
npm run dev

# 3. 執行 TypeScript 型別檢查
npm run lint

# 4. 執行領域規則與內容／簡報完整性測試
npm test

# 5. 同步產生獨立 HTML 簡報（public/slides.html）並建置靜態網站（輸出至 dist/）
npm run build

# 6. 本地預覽建置後的 dist/ 產物（確認子路徑與 ./slides.html 行為）
npm run preview
```

---

## C# 範例本地執行方式（需具備 .NET 8 SDK）

> **環境誠實說明**：目前雲端建置容器未安裝 `.NET SDK`（`DOTNET_NOT_INSTALLED`），因此網站與文件標示為 `unverified-no-dotnet`。當您在本地電腦安裝 [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) 後，可依章節專案類型分別執行：

```bash
# 1. 第 01–06、08、09 章（.NET 8 Console 主控台專案，以第 09 章為例）
cd examples/csharp/09-dependency-injection
dotnet run

# 2. 第 07 章（ASP.NET Core MVC Web App，不可混入 Console）
cd examples/csharp/07-mvc-architecture
dotnet run
# 啟動後以瀏覽器開啟終端機顯示網址，例如 http://localhost:5000/Books/Index?keyword=MVC
```

---

## 資料 Ingest 與新增教材主題流程

詳細規範請先完整閱讀 `AGENTS.md` 第 2 節與第 6 節：

1. **登錄與實讀來源（A → B）**：在 `sources/registry.json` 新增 `src-*` 條目（未實讀前 `readDate` 必須為 `null`）；實際讀取正文後改寫為 `"ingested"` 並建立 `wiki/sources/<source-id>.md`。
2. **建立範例與教材（C）**：於 `examples/csharp/<nn>-<slug>/` 建立 `.cs` 與 `.csproj`（反例片段採 `Tight*.cs` 或 `*Before.cs` 命名）；於 `wiki/concepts/<nn>-<slug>.md` 建立完整 Metadata 與固定九大二級標題。
3. **註冊圖解與互動（D）**：若含互動模擬，於 `src/domain/` 建立純邏輯模組、`src/interactive/` 建立元件並註冊至 `src/interactive/registry.ts`，同時於 `src/components/DiagramViewer.tsx` 補上概念圖解。
4. **同步與驗證（E → F）**：更新 `wiki/index.md` 與相關章節 `relatedIds` 後，執行 `npm run lint && npm test && npm run build`，確認簡報 `public/slides.html` 與網站同步更新，並將紀錄補入 `wiki/log.md` 與 `docs/verification.md`。

---

## GitHub Pages 設定與子路徑部署說明

本專案已預先針對 GitHub Pages 子路徑（`https://<username>.github.io/<repo-name>/`）完成以下相容設定：
- `vite.config.ts` 設定 `base: './'`，確保打包後的 `dist/index.html` 以 `./assets/...` 相對路徑載入資源。
- `src/App.tsx` 使用 `HashRouter`（網址格式 `#/wiki/<slug>`、`#/slides`、`#/process`），在子路徑重新整理任何教材頁或簡報頁都不會觸發 GitHub Pages 404。
- 獨立 HTML 簡報輸出至 `public/slides.html`（建置後為 `dist/slides.html`），網站內透過 `./slides.html` 開啟，簡報內以 `./#/wiki/<slug>` 返回主網站。

### 使用者推送與啟用 GitHub Pages 具體步驟

1. 在 GitHub 建立新的公開 Repository（例如 `concept-lab-wiki`）。
2. 在本機專案根目錄初始化 Git 並推送至 `main` 分支：
   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "feat: 初始化程式觀念實驗室九章教材、簡報與 Pages 部署"
   git remote add origin https://github.com/<你的帳號>/<儲存庫名稱>.git
   git push -u origin main
   ```
3. 前往 GitHub 儲存庫頁面 → **Settings** → **Pages**：
   - **Build and deployment** → **Source** 選擇 **GitHub Actions**。
4. 切換至 **Actions** 分頁，確認 `Deploy Concept Lab to GitHub Pages` 工作流程執行完成（`build` 與 `deploy` 均為綠色打勾），即可取得實際公開網址：
   - 主網站：`https://<你的帳號>.github.io/<儲存庫名稱>/#/`
   - 獨立 HTML 簡報：`https://<你的帳號>.github.io/<儲存庫名稱>/slides.html`
5. 開啟公開網址實際測試首頁搜尋、第 09 章教材頁、重新整理頁面（F5）與 `./slides.html` 列印另存 PDF 畫面後，將真實網址回填至 `docs/submission-guide.md`。
