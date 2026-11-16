# GitHub Actions 部署工作流程說明

本目錄包含正式的靜態部署設定 `.github/workflows/deploy.yml`：

- **觸發條件**：推送至 `main` 分支，或於 GitHub Actions 頁面手動觸發（`workflow_dispatch`）。
- **權限設定**：`contents: read`、`pages: write`、`id-token: write`。
- **可重現安裝**：以 `oven-sh/setup-bun@v2`（`1.4.4`）搭配 `bun.lock` 執行 `bun install --frozen-lockfile`，並於 `actions/setup-node@v4`（Node 22）環境執行檢查與建置。
- **驗證與建置步驟**：
  1. `npm run lint`（`tsc --noEmit`）
  2. `npm test`（領域規則、來源引用、9 章索引與簡報測試）
  3. `npm run build`（同步生成 `public/slides.html` 與輸出 `dist/`）
  4. 驗證 `dist/index.html` 維持 `./assets/` 相對路徑且 `dist/slides.html` 存在
  5. `actions/configure-pages@v5` -> `actions/upload-pages-artifact@v3`（上傳 `dist`） -> `actions/deploy-pages@v4`
