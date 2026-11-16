---
sourceId: src-ref-karpathy-llm-wiki
title: LLM Wiki: A pattern for building personal knowledge bases
authorOrOrg: Andrej Karpathy (GitHub Gist)
url: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
status: ingested
readDate: 2026-11-14
---

## 來源基本資訊
- **分類**：Wiki 方法論參考（獨立於至少 5 篇主題資料之外）
- **讀取日期與方式**：2026-11-14（透過 Node `fetch` 擷取 Gist Raw 正文並完整閱讀）

## 核心概念借鏡（轉化為本專案設計）
1. **三層架構分離**：
   - `Raw sources`（原始資料不可隨意竄改）→ 對應本專案 `sources/registry.json` 與外部來源記錄。
   - `The wiki`（由協作整理並持續維護交叉連結的知識頁）→ 對應本專案 `wiki/sources/` 與 `wiki/concepts/`。
   - `Schema`（指導維運規範的規則文件）→ 對應本專案根目錄 `AGENTS.md`。
2. **核心操作迴圈**：`Ingest`（讀入來源、產出摘要、更新概念頁與索引）、`Query`（依目錄查詢並綜合回答）、`Lint`（定期檢查矛盾、孤島頁與缺漏來源）。
3. **雙索引協作**：`index.md` 負責主題導向目錄、`log.md` 負責時間軸追加紀錄。

## 本專案取捨與限制
- 不直接照搬原 Gist 提到的 Obsidian 外掛或 CLI 指令，而是依本專案需求建立純靜態 Vite + React 網站與 C# 教材結構。
