# AGENTS.md — 程式觀念實驗室開發與維護規範

> 本文件為「程式觀念實驗室（Concept Lab）」之最高開發與維護規則。任何人類開發者或 AI 協作者在修改本專案前，必須先完整讀取本文件，並嚴格遵守其中規範。

---

## 1. 專案目的、讀者程度與主題邊界

### 1.1 專案定位
- **名稱**：程式觀念實驗室
- **副標**：從物件導向到 MVC 與低耦合設計
- **核心目標**：以 C# 範例說明通用程式設計觀念，建立有來源依據、可持續維護的 LLM Wiki 教學網站與簡報系統，並能將觀念延伸至網頁開發與一般系統設計。
- **技術分工原則**：
  - **教材範例語言**：C#（以 .NET 8 / C# 12 標準語法編寫）。
  - **網站製作技術**：React + TypeScript + Vite（純靜態前端，可輸出 `dist/` 部署於 GitHub Pages）。
  - 網站實作採用元件與模組職責分離（內容讀取、領域模擬邏輯、互動協調、畫面元件），不將 React 前端架構直接宣稱為 ASP.NET MVC，也不為迎合主題而在 TypeScript 過度套用無意義的 class 或繼承。

### 1.2 目標讀者
- 已掌握變數、型別、條件判斷（`if/else`）、迴圈與函式（method/function）之基礎程式學習者。
- 正在從「把程式寫在單一函式或檔案」過渡到「如何組織類別、保護資料、分離職責與維護系統」的階段。

### 1.3 初版主題邊界（共 8 章）
1. `01-classes-and-objects`：類別與物件（學生名冊：類別、物件、欄位、屬性、方法、建構式）
2. `02-encapsulation`：封裝（銀行帳戶：透過操作方法維護餘額及輸入規則）
3. `03-inheritance-and-composition`：繼承與組合（交通工具與引擎：is-a 與 has-a、選擇與取捨）
4. `04-polymorphism`：多型（不同動物發聲：共同型別、`virtual`、`override` 與實際呼叫結果）
5. `05-abstract-class-and-interface`：抽象類別與介面（圖形及繪製能力：共用基底與行為約定的差異）
6. `06-coupling-and-cohesion`：耦合與內聚（訂單計算及通知：職責分離、依賴關係、替換通知實作的修改範圍）
7. `07-mvc-architecture`：MVC（圖書查詢：以網頁請求說明 Model、View、Controller 及處理流程）
8. `08-integration-and-refactoring`：整合與重構（待辦事項系統：從混合寫法整理分工，再加入新需求）

> **第 4 階段擴充驗證**：`09-dependency-injection`（依賴注入入門）已作為實際擴充實驗納入主線共 9 章；本專案仍保留相同流程與註冊機制以支援後續章節持續擴充。

### 1.4 繁體中文用語規範
- 全站介面、教材敘述、註解與文件一律使用**繁體中文（台灣常用技術用語）**。
- 技術專有名詞採「中文譯名（原文）」或常見保留英文並用，保持全站一致：
  - 類別（Class）、物件（Object）、實例（Instance）、欄位（Field）、屬性（Property）、建構式（Constructor）、方法（Method）
  - 封裝（Encapsulation）、存取修飾詞（Access Modifier：`public` / `private`）
  - 繼承（Inheritance）、組合（Composition）、多型（Polymorphism）
  - 抽象類別（Abstract Class）、介面（Interface）
  - 耦合（Coupling）、內聚（Cohesion）、依賴注入（Dependency Injection）
- 禁止使用機械式語氣、假裝系統監控詞彙或無意義裝飾前綴（例如禁止在標題加上 `//`、`>_`、`STATUS: ONLINE`）。

---

## 2. 資料來源、狀態標示與 Ingest 工作流程

### 2.1 來源登錄檔規範（`sources/registry.json`）
每個外部參考資料必須擁有**穩定的來源 ID（kebab-case，前綴 `src-`）**，例如 `src-ms-csharp-oop`。每筆資料包含以下必填欄位：
- `id`：穩定識別碼（string）
- `title`：來源標題（string）
- `authorOrOrg`：作者或官方機構（string）
- `url`：原始連結（string）
- `topics`：對應教材章節 ID 陣列（`string[]`）
- `readDate`：實際讀取日期（ISO 格式 `YYYY-MM-DD`；**未實際讀取前必須為 `null`，嚴禁填寫虛構日期**）
- `readMethod`：讀取方式（如 `"未讀取（僅登錄）"`、`"瀏覽器查閱官方文件"`、`"WebFetch 擷取正文"`）
- `status`：允許值為 `"pending"`（已登錄待讀取）、`"unavailable"`（環境受阻無法讀取完整正文，須記明原因）、`"ingested"`（已實際讀取、產出摘要筆記並整合進教材）、`"needs-review"`（來源更新或需複核）
- `notes`：簡短備註與適用範圍說明

### 2.2 Ingest 工作流程（知識更新標準步驟）
1. **登錄（Register）**：於 `sources/registry.json` 新增或確認來源條目，未讀取前 `readDate` 為 `null`、`status` 為 `"pending"`；若存取受阻則改為 `"unavailable"` 並誠實記錄受阻原因。
2. **實際讀取（Fetch & Read）**：實際取得來源正文內容後，才可填入 `readDate` 與 `readMethod`，並將 `status` 改為 `"ingested"`。
3. **撰寫來源筆記（Source Note）**：於 `wiki/sources/<source-id>.md` 建立或更新摘要，必須包含：來源資訊、核心摘要、重要概念清單、適用範圍與其他來源關聯、**來源限制與補充提醒**。
4. **修訂教材（Synthesize to Concept）**：依來源筆記修訂 `wiki/concepts/<nn>-<slug>.md`，確認觀念正確、名詞一致後，將有來源依據的章節 `status` 由 `"draft"` 改為 `"verified"`（局部缺乏來源之段落仍須註明「待驗證」）。
5. **更新紀錄（Log）**：於 `wiki/log.md` 與 `docs/process-log.md` 追加一筆含日期、動作、變更檔案與驗證結果的紀錄。

### 2.3 誠實標示原則（能力或資料未就緒時）
- 尚未完成來源查核的教材，metadata 必須標示 `status: draft`。
- 尚未撰寫完成正文的後續章節，metadata 必須標示 `status: planned`。
- 若執行環境未安裝 `.NET SDK`（無 `dotnet build` / `dotnet run` 工具），**嚴禁宣稱 C# 範例已編譯通過**，必須在教材、程式碼區塊標籤與 `docs/verification.md` 中明確標示 `compileStatus: unverified-no-dotnet`（或顯示「靜態教材範例・本環境未進行本地 C# 編譯驗證」）。

---

## 3. 檔案結構、命名與 Metadata 規範

### 3.1 目錄結構
```text
/
├── AGENTS.md                   # 本專案開發規則
├── README.md                   # 專案說明、版本與本地執行指南
├── index.html                  # Vite HTML 入口（繁體中文 meta 與字體載入）
├── metadata.json               # 應用程式中繼資訊
├── package.json                # 依賴與腳本
├── vite.config.ts              # Vite 設定（base: './' 支援 GitHub Pages 子路徑）
├── sources/
│   └── registry.json           # 來源登錄檔
├── examples/
│   └── csharp/                 # C# 範例原始碼與本地執行說明
│       ├── README.md
│       ├── 01-classes-and-objects/
│       └── 02-encapsulation/
├── wiki/
│   ├── index.md                # 主題索引與學習順序
│   ├── log.md                  # Wiki 異動與查核紀錄
│   ├── concepts/               # 教材正文（主要單一資料來源）
│   └── sources/                # 來源閱讀紀錄與摘要
├── docs/
│   ├── requirements.md         # 需求規格、選題理由與驗收條件
│   ├── workflow.md             # 開發與知識處理流程圖與說明
│   ├── process-log.md          # 製作歷程紀錄
│   ├── verification.md         # 檢查項目與真實執行結果紀錄
│   ├── reflection.md           # 執行反思與限制紀錄
│   └── submission-guide.md     # 繳交 PDF 所需資料與截圖清單
└── src/
    ├── types/                  # TypeScript 型別定義
    ├── lib/                    # Wiki 解析、內容載入索引、localStorage 封裝
    ├── domain/                 # 純前端領域模擬邏輯（無 React 依賴）
    ├── interactive/            # 互動模組元件與 demoId 查找 registry
    ├── components/             # 共用 UI 與教學版型元件
    └── pages/                  # 知識庫、教學簡報、來源與製作流程頁面
```

### 3.2 命名規則
- **教材檔名**：`<兩位數編號>-<英文 kebab-case>.md`，例如 `01-classes-and-objects.md`。
- **教材 ID (`id`)**：與不含 `.md` 的檔名一致（如 `01-classes-and-objects`）。
- **教材 Slug (`slug`)**：不含編號的英文 kebab-case（如 `classes-and-objects`），作為網址 `#/wiki/classes-and-objects`。
- **來源檔名**：與來源識別碼一致，即 `wiki/sources/<source-id>.md`（如 `src-ms-dotnet-di.md`），對應 `sources/registry.json` 中的條目。
- **反例概念片段檔名**：供對照用但不單獨執行之反例檔案統一以 `Tight*.cs` 或 `*Before.cs` 命名（例如 `TightCoupledOrder.cs`、`MixedTodoBefore.cs`、`TightFileProcessor.cs`），以利 `src/lib/contentLoader.ts` 自動識別為 `concept-snippet`。
- **互動模組 ID (`demoId`)**：英文 kebab-case（如 `student-roster`、`bank-account`），必須在 `src/interactive/registry.ts` 註冊；若無互動模組則設為 `null` 或對應規劃 ID 並由頁面優雅顯示「建置中」。

### 3.3 教材 Frontmatter Metadata 必填欄位
每篇 `wiki/concepts/*.md` 頂部必須具備以下 YAML frontmatter 欄位：
```yaml
---
id: 01-classes-and-objects
slug: classes-and-objects
order: 1
title: 類別與物件
subtitle: 學生名冊：從藍圖定義到獨立個體
summary: 以學生名冊為情境，理解 Class 與 Object 的差異，並掌握欄位、屬性、方法與建構式的分工。
status: draft # draft | verified | planned
compileStatus: unverified-no-dotnet # verified | unverified-no-dotnet
prerequisites: []
tags:
  - 物件導向基礎
  - Class 與 Object
  - 建構式
sourceIds:
  - src-ms-csharp-oop
  - src-ms-csharp-classes
exampleIds:
  - 01-classes-and-objects/Student.cs
  - 01-classes-and-objects/Program.cs
demoId: student-roster
relatedIds:
  - 02-encapsulation
  - 03-inheritance-and-composition
---
```

---

## 4. 教材固定結構與驗證規範

### 4.1 九大固定章節（順序不可變動）
每篇完整教材（`status: draft` 或 `verified`）之 Markdown 內容必須嚴格使用以下九個二級標題（`##`），並維持此固定順序，以利共用解析器抽取與簡報轉換：
1. `## 問題情境`
2. `## 學習目標`
3. `## 觀念圖解`
4. `## C# 範例`
5. `## 預期結果`
6. `## 修改需求的比較`
7. `## 常見誤解`
8. `## 小練習與解析`
9. `## 相關概念及資料來源`

### 4.2 範例語言與執行環境標示
- 教材範例一律採用 C#，並於 `examples/csharp/<chapter-id>/` 保留對應 `.cs` 原始碼檔案。
- 介面中顯示 C# 程式碼時，必須同時顯示：
  - 檔名（例如 `Student.cs`）
  - 語言與目標環境標籤（例如 `C# 12 · .NET 8 範例`）
  - 編譯驗證狀態標籤（目前無本地 .NET 環境時，顯示 `未本地編譯驗證`）
- 網頁上的互動練習區必須明確標示為**「TypeScript 概念模擬（非瀏覽器執行 C#）」**，操作按鈕使用清楚的中文動作詞（如「播放步驟」、「上一步」、「下一步」、「觀察狀態」、「重置預設」），禁止偽裝成真實 C# 編譯器。

### 4.3 金額與數值模擬精度規範
- 凡涉及貨幣或財務計算（如第 02 章銀行帳戶），領域模擬邏輯（`src/domain/`）必須使用**整數最小單位（如分 `cents`）**或精確十進位換算，禁止直接對浮點數執行累加或扣款，以呼應 C# `decimal` 型別的精確設計。

### 4.4 教學 HTML 簡報資料來源與同步規則
- 教學簡報（`#/slides` 與同步產出之獨立 HTML 檔 `public/slides.html`）必須直接從 `wiki/concepts/*.md`、`examples/csharp/` 與 `sources/registry.json` 抽取，嚴禁另外撰寫與教材相矛盾的程式碼或摘要。
- 每篇教材 Frontmatter 應明確指定：
  - `slideExampleId`：簡報範例頁所引用之 `examples/csharp/` 檔案路徑（必須屬於 `exampleIds`）。
  - `slideLineRange`：該檔案於簡報顯示之起訖行號（例如 `3-24`），由系統直接切片擷取，確保程式碼與行號對照完全一致。
- 簡報每頁維持單一重點（全套約 18–24 頁），並顯示對應章節 `id`、`sourceIds`、`exampleIds` 與「回到完整教材」連結；每次修改 `wiki/concepts/*.md` 或 `examples/csharp/` 後，必須重新執行 `npm run build:slides`（或建置前同步腳本）更新獨立 HTML 簡報並檢查行號片段有效性。

---

## 5. 視覺、版型與互動設計規範

### 5.1 色彩系統（60-30-10 原則）
- **背景畫布（60%）**：`#F6F7FB`（極淺冷灰白底）
- **表面與結構（30%）**：`#FFFFFF` 內容卡片、`#E5E7EB` 細框線（1px hairline）、`#1F2937` 主要正文、`#4B5563` 次要說明文字。
- **強調色（10%）**：
  - 主強調色：`#3458A4`（沉穩深藍，用於主要按鈕、作用中連結、重點提示）
  - 輔助強調色：`#247C74`（低飽和青綠，用於概念狀態確認、成功結果提示）
- **語意警示色**：成功 `#1F6E58`、錯誤／規則攔截 `#B91C1C`（**不可僅以顏色表達狀態，必須搭配文字標籤與圖示**）。

### 5.2 排版與字體規範
- **正文閱讀區**：字級 `18px`（`1.125rem`）、行高 `1.8`、最寬閱讀欄約 `68ch–72ch`（確保長文不疲勞）。
- **字體設定**：
  - 介面與正文：`'Plus Jakarta Sans', 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif`
  - 程式碼：` 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace`
- **禁止事項**：
  - 禁止靜態中繼資料使用圓角膠囊標籤（pill badges）；標籤、狀態與前置條件以純文字搭配 `·` 或 `/` 分隔呈現。
  - 禁止在卡片或提示區塊左側加上粗色條（`border-l-4` 或 `border-l-2`）。
  - 禁止在畫面中加入裝飾性閃爍圓點（`animate-pulse` status dots）或無關的系統監控條。
  - 卡片維持單一層級深度（避免卡片內再包覆另一層高陰影卡片）。

### 5.3 C# 程式碼區塊規範
- 獨立深色背景（`#0F172A` / `#111827`），搭配清晰對比的語法上色。
- 字級 `15px–16px`、等寬字體、顯示行號、保留原始縮排。
- 提供：多檔頁籤切換、單鍵複製按鈕（剪貼簿 API 受限時須提供備援複製方式）、放大檢視（Modal）與重點行高亮度標示（可由互動步驟器同步控制）。
- 長行程式碼於區塊內部水平捲動（`overflow-x-auto`），嚴禁造成整頁水平溢出。

### 5.4 響應式與無障礙規範
- **桌面版**：頂部三區導覽列（品牌名稱｜三個主要入口｜一項主動作按鈕）；知識庫提供可收合之章節側欄；互動區採雙欄並排（左／上為操作與物件狀態，右／下為對應 C# 程式碼與步驟解析）。
- **手機版**：抽屜式章節導覽；互動區改為垂直堆疊或頁籤切換，按鈕觸控高度至少 `40px–44px`。
- **鍵盤與動畫**：所有互動元件皆可使用鍵盤 Tab 聚焦並具清楚焦點外框（`focus-visible`）；簡報支援左右方向鍵翻頁，但焦點位於輸入框、文字區域或操作元素時不得誤觸翻頁；遵循 `prefers-reduced-motion` 設定，非必要動畫停用或縮短於 `200ms` 內。

---

## 6. 新增與更新作業標準流程

### 6.1 新增一篇教材章節
1. 於 `sources/registry.json` 確認所需參考來源已登錄；若已實際閱讀，更新 `readDate`、`readMethod`、`status: "ingested"`，並建立 `wiki/sources/<source-id>.md`。
2. 於 `examples/csharp/<nn>-<slug>/` 建立獨立 `.cs` 範例檔與 `.csproj`（反例片段採 `Tight*.cs` 或 `*Before.cs` 命名）。
3. 於 `wiki/concepts/<nn>-<slug>.md` 建立符合 3.3 metadata 與 4.1 九大章節之教材檔案（含 `slideExampleId` 與 `slideLineRange`）。
4. 若需互動模擬與圖解：
   - 於 `src/domain/` 建立純邏輯模組（無 React 相依）；
   - 於 `src/interactive/` 建立 React 互動面板，並於 `src/interactive/registry.ts` 註冊 `demoId`；
   - 於 `src/components/DiagramViewer.tsx` 補上對應 `demoId` 之觀念圖解。
5. 更新 `wiki/index.md` 與相關章節的 `relatedIds`；並檢查首頁、簡報與流程圖是否採用動態章節數（避免寫死「八章」）。
6. 執行簡報同步腳本重新產生 `public/slides.html`。
7. 於 `wiki/log.md` 記錄本次新增與查核狀態，並執行第 7 節所有驗證檢查記錄於 `docs/verification.md`。

### 6.2 更新既有教材
1. 先讀取本檔案（`AGENTS.md`）與目標 `wiki/concepts/*.md`。
2. 修改教材內容或關聯範例後，同步檢查 `exampleIds`、`slideExampleId`、`slideLineRange`、`sourceIds`、`relatedIds` 是否正確。
3. 重新產生 `public/slides.html`、更新 `wiki/log.md`，重新執行第 7 節檢查。

### 6.3 簡報更新與產出檢查規則
- 簡報標題、摘要與程式碼片段不得手動偏離 `wiki/concepts/*.md` 與 `examples/csharp/`；任何簡報內容更動應先修改 Wiki 或對應範例，再透過 `scripts/generate-slides.mjs` 同步產出獨立 HTML 簡報。
- 列印檢視須自動展開全部投影片、隱藏導覽與操作按鈕並避免裁切；手機版面須改為垂直流動閱讀而非縮放桌面版型。

---

## 7. 每次修改後必須執行的檢查與紀錄格式

### 7.1 必執行檢查清單
每次修改程式碼或內容後，必須執行並確認：
1. **TypeScript 型別檢查**：`npm run lint`（即 `tsc --noEmit`）通過，無型別錯誤。
2. **領域規則與完整性自動化測試**：`npm test` 通過，驗證領域邊界、狀態轉換、來源引用、ID 唯一性與子路徑部署相容性。
3. **靜態建置檢查**：`npm run build`（即 `npm run build:slides && vite build`）成功輸出 `dist/`（含 `dist/slides.html`）。
4. **GitHub Pages 相對路徑檢查**：確認 `vite.config.ts` 維持 `base: './'`，無寫死 `/` 根路徑的動態資源載入，路由使用 `HashRouter`。
5. **瀏覽器實測（當環境支援時）**：確認桌面（1440px）、平板與手機寬度無水平溢出，互動按鈕可正常改變狀態與高亮程式碼。

### 7.2 紀錄格式（適用於 `wiki/log.md` 與 `docs/verification.md`）
```markdown
### [YYYY-MM-DD] <階段或任務名稱>
- **執行動作**：<新增 / 修改 / 來源查核 / 互動實作>
- **涉及檔案**：<列出實際變更路徑>
- **執行檢查**：
  - `npm run lint`：<通過 / 失敗及原因>
  - `npm run build`：<通過 / 失敗及原因>
  - C# 本地編譯：<未執行（環境無 .NET SDK） / 通過>
- **已知限制與待辦**：<誠實記錄未完成項目>
```
