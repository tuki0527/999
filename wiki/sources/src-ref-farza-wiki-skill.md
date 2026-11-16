---
sourceId: src-ref-farza-wiki-skill
title: Personal Knowledge Wiki Skill Pattern
authorOrOrg: farzaa (GitHub Gist)
url: https://gist.github.com/farzaa/c35ac0cfbeb957788650e36aabea836d
status: ingested
readDate: 2026-11-14
---

## 來源基本資訊
- **分類**：Wiki 方法論參考（獨立於至少 5 篇主題資料之外）
- **讀取日期與方式**：2026-11-14（透過 Node `fetch` 擷取 Gist Raw 正文並完整閱讀）

## 核心概念借鏡（轉化為本專案設計）
1. **修改前必先重讀（Read before updating）**：每次更新既有知識頁前先讀規則與現有內容，把新來源融入整體敘事，而不是只在文末機械式追加一段文字。
2. **反塞車（Anti-cramming）與反空洞（Anti-thinning）**：不把所有內容硬塞在同一大頁（本專案依 8 個明確情境拆章，並把依賴注入獨立為第 09 章擴充），也不留下只有兩三句空話的空殼頁。
3. **健康檢查（Lint / Cleanup）**：主動盤點未驗證主張、斷裂引用與缺漏來源，這直接反映在本專案「受阻來源誠實標示為 unavailable、缺來源段落標示待驗證」的紀律上。

## 本專案取捨與限制
- 原 Gist 針對個人日記／筆記自動化腳本（`ingest.py` / `/wiki absorb`），本專案僅取其知識整理紀律，將其指令視為概念參考而非本專案必須執行的腳本。
