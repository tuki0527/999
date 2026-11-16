# 執行反思與限制紀錄（Reflection）

## 1. 順利運作的設計決策與改善對照
- **先寫規範再實作（Rule-First）**：先確定 `AGENTS.md` 中的九段教材結構、Frontmatter 欄位與第 4.4 節 `slideExampleId` / `slideLineRange` 規則後，解析器（`wikiParser.ts`）、簡報抽取（`slidesBuilder.ts`）與獨立簡報腳本（`scripts/generate-slides.mjs`）就能直接從同一批原始檔抽取內容，避免另外維護一份容易矛盾的簡報文字。
- **建置期靜態打包與相對路徑**：透過 Vite `import.meta.glob(..., { query: '?raw' })` 與 `base: './'`，加上 `public/slides.html` 相對連結 `./slides.html`，確保部署至 GitHub Pages 子路徑時不會因根路徑 `/` 而出現 404。
- **金額模擬採整數分（Cents）**：第 02 章 TypeScript 模擬使用 `balanceCents` 整數加減，精確對應 C# `decimal` 語意，防止浮點誤差干擾教學。
- **依實際檢查證據所做的修正（真實對照）**：
  - *行號與型別文字修正*：在 Stage 2 以 Node 腳本列印 `examples/csharp/03..07` 實際行號時，發現 `src/domain/mvcBooksSim.ts`（第 17–24 行 vs 實際 `Search` 方法第 19–28 行）、`abstractionSim.ts` 與 `polymorphismSim.ts` 各有 1–2 行偏移；另外比對 `BankAccount.cs` 時發現第 02 章說明文字將 `sealed class OperationResult` 誤記為 `record`，兩者均已依實檔修正（詳見 `docs/verification.md`）。
  - *備援缺口補強*：檢視 Stage 1 `CodeBlock.tsx` 時，發現 `navigator.clipboard.writeText` 失敗只會靜默設回 `false`；於 Stage 3 補上 `execCommand` 與展開手動複製 `<textarea>`，並為簡報加入全螢幕權限受限時的「專注閱讀模式」。

---

## 2. 依證據回答工作流程關鍵問題

### 2.1 目前哪一個節點「最常出錯」？
- **誠實判定：目前資料不足以從統計上斷定「最常出錯」的單一節點。**  
  本專案至今僅完整執行一輪（Stage 1 → Stage 2 → Stage 3）初版八章開發與靜態驗證，尚未累積多個獨立章節回合或多人協作的重複失敗統計樣本，因此**不編造失敗次數或百分比**。
- **依已觀察紀錄指出的兩個實務高風險點**：
  1. **節點 A（取得來源與登錄）受外部環境限制**：實測 Medium 兩篇補充網址均回傳 HTTP 403 Cloudflare 阻擋，必須立即切換為 `unavailable`（`readDate: null`）並以官方文件替代、局部標記「待驗證」。
  2. **節點 C（觀念、來源及程式碼檢查）跨檔案行號同步**：當教材 Markdown、C# 範例檔、互動 `highlightLines` 與簡報 `slideLineRange` 分屬不同檔案時，只要 C# 檔案增減註解或空行，手動標記的行號就容易出現 1–2 行偏移。

### 2.2 如何把檢查提前（Shift-Left）？
- 在 Stage 2／Stage 3 中，我們將原本依賴人工目視的檢查改寫為可重複執行的自動化驗證：
  1. 在 Node 一致性檢查腳本中直接比對：8 篇概念檔的 9 大章節標題順序、2 題以上互動檢核問答、`sourceIds` 必須在 `sources/registry.json` 為 `ingested`、`exampleIds` 與 `slideExampleId` 實體檔案存在、`slideLineRange` 不超出實際總行數、`demoId` 已於 `src/interactive/registry.ts` 註冊。
  2. 將 `node scripts/generate-slides.mjs` 串進 `npm run build` 前置步驟，確保每次建置前獨立 HTML 簡報一定重新由最新 Wiki 與 C# 原始碼產生。

### 2.3 Workflow 是否調整與原因？
- **是，Stage 3 已對工作流程圖做實質調整（見 `docs/workflow.md`）：**
  - Stage 1 初版流程較偏線性開發步驟（節點 01–07），尚未把「獨立 HTML 簡報生成」、「跨裝置／列印驗證」與「知識關聯圖之區分」獨立成明確檢核關卡。
  - Stage 3 重整為 **A–F 六階段**，為每個節點明確寫出「輸入、產出、通過條件、失敗退回對象、設計理由」，並把「資料不足回 A」「觀念或引用錯誤回 B/C」「互動／簡報／建置失敗回 D 或 C」與「第 4 階段擴充 F 回 A」四條回路明確畫出，同時增設「圖 2 概念知識關聯圖」作為學習輔助，避免與開發工作流程圖混淆。

---

- **第 4 階段擴充實驗印證系統可延伸性（第 09 章依賴注入）**：
  - 新增第 09 章時，`LessonView.tsx`、`KnowledgeBasePage.tsx` 搜尋邏輯、`SlidesPage.tsx` 與 `wikiParser.ts` 完全不需要重寫核心流程，只要依循 `AGENTS.md` 新增 Markdown、C# 範例、來源筆記、`domain/`、`interactive/` 與註冊表項目，系統即自動納入 9 章導覽、搜尋與 23 頁簡報。
  - 同時也靠實際操作抓出三個原本規則／程式不夠完善之處並立即修正：
    1. *UI 硬編碼字樣*：`KnowledgeBasePage.tsx`、`WorkflowGraph.tsx`、`slidesBuilder.ts` 與 `scripts/generate-slides.mjs` 原先寫死「八章」，已改為動態計算章節數。
    2. *反例檔名辨識硬編碼*：`contentLoader.ts` 原先以特定檔名辨識反例，已補進 `AGENTS.md` 第 3.2 節並改為依 `Tight*` / `*Before.cs` 自動識別。
    3. *CI 鎖定檔相容性*：實測 `npm install --package-lock-only` 時揭露 `vite@8.3.8` 與 `esbuild@^0.25.0` 的 `ERESOLVE` 衝突，提前改用專案現有 `bun.lock` 搭配 `oven-sh/setup-bun@v2` 設計 `.github/workflows/deploy.yml`，避免推送 GitHub 後才在 Actions 失敗。

---

## 3. 真實限制與尚未執行項目
- **C# 本地編譯未執行（待有 .NET 8 SDK 環境測試）**：本建置環境回傳 `dotnet: not found`（`DOTNET_NOT_INSTALLED`），全九章 `.cs` 與 `.csproj` 維持標示 `unverified-no-dotnet`。
- **實機瀏覽器與 GitHub Pages 公開網址驗證（待部署後人工確認）**：本容器無瀏覽器執行檔（`NO_BROWSER_BIN`）且未連結遠端 Git（`NO_GIT`）；我們已透過 `npm test` 驗證純領域狀態轉換與輸出產物結構，但跨裝置（桌面／平板／手機）實際排版、鍵盤焦點、列印另存 PDF 與子路徑 F5 重整仍標記為「待執行」，需於部署後實測。
- **Medium 兩篇補充來源（`unavailable`）**：待人工複製正文提供後，方可決定是否補充整合至第 01、07 章。

