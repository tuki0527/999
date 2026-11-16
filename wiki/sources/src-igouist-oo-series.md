---
sourceId: src-igouist-oo-series
title: 菜雞與物件導向系列（實際追蹤閱讀第 0、1、3、8 篇）
authorOrOrg: 伊果（igouist.github.io）
url: https://igouist.github.io/post/2020/07/oo-0-object-oriented/
status: ingested
readDate: 2026-11-14
---

## 來源基本資訊
- **索引頁 URL**：`https://igouist.github.io/post/2020/07/oo-0-object-oriented/`（僅為系列目錄前言）
- **實際追蹤並完整讀取之對應正文篇章**：
  1. `菜雞與物件導向 (1): 類別、物件`：`https://igouist.github.io/post/2020/07/oo-1-class-object/`
  2. `菜雞與物件導向 (3): 封裝`：`https://igouist.github.io/post/2020/07/oo-3-encapsulation/`
  3. `菜雞與物件導向 (8): 內聚、耦合`：`https://igouist.github.io/post/2020/09/oo-8-cohesion-and-coupling/`
- **讀取日期與方式**：2026-11-14（透過 Node `fetch` 由前言頁追蹤連結並實地讀取上述三篇正文）
- **對應教材章節**：`01-classes-and-objects`、`02-encapsulation`、`06-coupling-and-cohesion`

## 核心摘要（自撰整理）
1. **類別與物件（第 1 篇）**：以具體貼近實務的「卡牌」例子帶出抽象類別設計與實例差異，協助台灣初學者把英文名詞對應到實際寫作思維。
2. **封裝（第 3 篇）**：明確指出 C# 的 `get` / `set` 存取子如同「房屋門窗與出入境海關」，把資料進出與格式化處理的主導權留在物件本身（例如統一限制敘述長度或在 `get` 時控制顯示位數，而不必改動數十個外部呼叫點）；同時強調封裝不只是對屬性設 `private`，更重要的是隱藏內部複雜步驟（如私有輔助方法 `ConnectDB`），讓呼叫端只需知道「呼叫後能取得結果」。
3. **內聚與耦合（第 8 篇）**：點出極端盲目追求「零耦合、滿內聚」反而會產生把所有邏輯塞成數千行的「上帝類別（God Class）」或四處複製貼上的災難。真正目標是「該內聚而內聚、該耦合而耦合」——讓物件之間保持健康的距離。

## 與其他來源的關聯或差異
- 補充了 Microsoft 官方文件（`src-ms-csharp-classes`、`src-ms-code-metrics-coupling`）較少著墨的「中文語境直覺比喻」與「過度拆解或過度塞滿的反面警惕」。
- 第 0 篇本身僅作導覽目錄，本專案嚴格遵守「追至實際技術正文篇章才作為依據」原則，未把前言索引當成觀念出處。

## 來源限制與備註
- 系列其餘篇章（如 SOLID 原則第 9–15 篇）尚待後續擴充（如第 09 章 DI）時再依需要追蹤讀取。
