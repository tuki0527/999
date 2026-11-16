---
sourceId: src-ms-code-metrics-coupling
title: Code metrics - Class coupling (S05)
authorOrOrg: Microsoft Learn (Visual Studio Docs)
url: https://learn.microsoft.com/en-us/visualstudio/code-quality/code-metrics-class-coupling?view=visualstudio
status: ingested
readDate: 2026-11-14
---

## 來源基本資訊
- **原文最後更新（頁面標記）**：2025-10-30
- **讀取日期與方式**：2026-11-14（透過 Node `fetch` 取得 HTTP 200 完整正文並人工消化整理）
- **對應教材章節**：`06-coupling-and-cohesion`

## 核心摘要（自撰整理）
Visual Studio 程式碼指標（Code Metrics）將「類別耦合（Class coupling，又稱 Coupling Between Objects, CBO）」定義為：**單一類別或方法所使用到的「不重複外部型別（unique classes）」數量**（包含參數、區域變數、回傳型別、方法呼叫、泛型型別引數、基底類別、實作介面等；但同一外部類別無論使用多少次或幾個屬性，只計數一次）。

文件同時引用 Yourdon & Constantine 的經典定義說明「內聚性（Cohesion）」：**模組內部各元素為了單一任務而緊密結合的程度**。良好的軟體設計追求「高內聚、低耦合」：高內聚讓模組專注且獨立，低耦合減少因相依太多外部型別而引發的連鎖修改風險。

## 重要概念與適用範圍
1. **耦合不是零**：任何有意義的系統都需要物件協作，因此類別耦合是量化相依廣度的觀察角度，重點在於避免「過度且直接綁死具體細節的高耦合」（Visual Studio 維護規則 CA1506 亦對此發出警告）。
2. **內聚與耦合互為表裡**：當類別內部塞入不相關的工作（低內聚），它往往同時需要引用更多外部物件（高耦合）。
3. **本專案教學呈現原則**：雖然學術文獻與工具可量測 CBO，但在本網站第 06 章互動模擬中，**不虛構未經實測的耦合分數**，而是依「更改需求時實際需要修改哪些檔案與位置」具體呈現低耦合價值。

## 與其他來源的關聯或差異
- 與 `src-igouist-oo-series` 第 8 篇相互補強：Microsoft 文件提供工程定義與度量邊界，伊果筆記則提醒「盲目追求無耦合的極端內聚會把所有程式複製或塞成上帝類別」，點出「健康的平衡」。
- 與 `src-ms-dotnet-arch-principles` 的依賴反轉（Dependency Inversion）相接：將依賴對象從具體類別（如 `EmailSender`）換成介面（如 `INotifier`），降低實作替換成本。

## 來源限制與備註
- 原文提及研究建議單一成員 CBO 上限參考值為 9，但同時強調沒有一體適用的魔術數字，仍須依系統複雜度與團隊脈絡判斷。
