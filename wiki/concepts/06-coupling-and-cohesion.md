---
id: 06-coupling-and-cohesion
slug: coupling-and-cohesion
order: 6
title: 耦合與內聚
subtitle: 訂單計算及通知：職責分離與修改影響範圍
summary: 透過訂單計算與通知流程的緊密／鬆散寫法對比，學習高內聚職責分工、依賴反轉原則與控制變更影響範圍。
status: verified
compileStatus: unverified-no-dotnet
prerequisites:
  - 02-encapsulation
  - 05-abstract-class-and-interface
tags:
  - 低耦合
  - 高內聚
  - 依賴反轉
sourceIds:
  - src-ms-code-metrics-coupling
  - src-ms-dotnet-arch-principles
  - src-ms-csharp-interfaces
  - src-igouist-oo-series
exampleIds:
  - 06-coupling-and-cohesion/DecoupledOrder.cs
  - 06-coupling-and-cohesion/Program.cs
  - 06-coupling-and-cohesion/TightCoupledOrder.cs
slideExampleId: 06-coupling-and-cohesion/DecoupledOrder.cs
slideLineRange: 32-49
demoId: order-notifier
relatedIds:
  - 05-abstract-class-and-interface
  - 07-mvc-architecture
  - 08-integration-and-refactoring
  - 09-dependency-injection
---

## 問題情境

剛開始寫電商訂單結帳功能時，你寫了一個看起來很簡潔的 `TightOrderProcessor`：在 `PlaceOrder` 方法裡面，先算 5% 營業稅，接著 `new EmailSender()` 寄出訂單成立信件。

但當老闆下週要求：
1. 「VIP 訂單要改成寄送手機簡訊（SMS），不要再發 Email！」
2. 「金額稅率改為依促銷方案調整，我們要先針對算錢邏輯寫單元測試！」

你打開 `TightOrderProcessor` 時會發現尷尬的事：**算錢邏輯**和**具體 `EmailSender` 建立與寄信**全部綁在同一支方法裡！只要通知方式改變，你就必須修改訂單主流程的原始碼，並且每次測試計算金額都不得不連帶觸發真實寄信物件。這就是「**低內聚（職責混雜）**」與「**緊密耦合（綁死具體實作）**」帶來的維護成本。

## 學習目標

- 理解 Visual Studio Code Metrics（`src-ms-code-metrics-coupling`）對**類別耦合（Class Coupling / CBO）**與**內聚性（Cohesion）**的精確定義。
- 區分「消除所有依賴」與「將**必要依賴**導向抽象（依賴反轉 DIP 與明確依賴原則）」的差別。
- 學會用**「需求變更時必須改動的檔案與模組範圍」**來檢視耦合度，而不是依賴無根據的主觀分數。
- 在下方的互動概念模擬中，實際比較「換成簡訊通知」或「同時多管道通知」時，兩種設計需要修改的程式碼範圍。

## 觀念圖解

從緊密耦合演進到高內聚、低耦合的關鍵，在於兩步重構：

1. **提升內聚性（Cohesion）：拆清各自專注的單一任務**
   - `PriceCalculator` 只專心計算含稅總價，不碰任何通知邏輯。
   - `OrderProcessor` 只負責協調「先算價格 → 再發通知」的流程順序。
2. **降低實作耦合（Low Coupling）：改為依賴介面與建構式明確傳入**
   - `OrderProcessor` 欄位不是寫死 `EmailSender`，而是依賴抽象契約 **`INotifier`**，並在建構式要求外部明確提供（Explicit Dependencies，`src-ms-dotnet-arch-principles`）。
   - `EmailNotifier` 與 `SmsNotifier` 各自實作 `INotifier`。日後替換通知管道時，只需在組裝點替換傳入的物件，`OrderProcessor` 與 `PriceCalculator` 一行都不用修改。

## C# 範例

本單元提供兩份對照檔案於 `examples/csharp/06-coupling-and-cohesion/`（**執行範圍說明**：`Program.cs` 與 `DecoupledOrder.cs` 可獨立執行於 `.NET 8 Console` 最小專案；`TightCoupledOrder.cs` 為對照用反例概念片段）。

### 逐行重點解說
- **`TightCoupledOrder.cs` 第 12–19 行（反例）**：`TightOrderProcessor` 同時內含稅率算式（第 16 行）與 `new EmailSender()`（第 17 行）。由於依賴寫死在方法內部（隱藏依賴），外部呼叫端無法替換通知方式，也沒有單獨測試算錢邏輯的切入點。
- **`DecoupledOrder.cs` 第 6–9 行**：獨立出高內聚的 `PriceCalculator`，只承擔金額計算這項單一任務。
- **`DecoupledOrder.cs` 第 12–30 行**：定義抽象介面 `INotifier`，並由 `EmailNotifier` 與 `SmsNotifier` 各自實作通知管道細節。
- **`DecoupledOrder.cs` 第 33–49 行**：`OrderProcessor` 透過建構式接收 `PriceCalculator` 與 `INotifier`（明確依賴），執行 `PlaceOrder` 時只呼叫 `_notifier.Notify(...)`，完全不知道底層是寄信還是發簡訊。
- **`Program.cs` 第 5–11 行**：在組裝端分別傳入 `new EmailNotifier()` 與 `new SmsNotifier()`，證明切換通知管道時 `OrderProcessor` 完全維持原樣。

## 預期結果

執行 `Program.cs` 時，同一個 `OrderProcessor` 邏輯分別搭配兩種通知實作輸出結果：

```text
[Email -> alice@example.com] 訂單成立，含稅總額 1,050 元
[SMS -> 0912-345-678] 訂單成立，含稅總額 1,050 元
```

## 修改需求的比較

假設產品經理提出新需求：「訂單成立時，要同時寄出 Email 並發送 SMS 簡訊（或將通知紀錄寫入稽核日誌）。」

- **緊密耦合版（`TightOrderProcessor`）**：必須打開 `TightOrderProcessor.cs` 修改核心結帳方法、增加第二個具體物件建立與呼叫，甚至加上 `if/else` 旗標判斷；修改後連原本已經測過的稅額計算與既有寄信流程都要重新驗證。
- **低耦合版（`OrderProcessor` + `INotifier`）**：只需新增一個實作 `INotifier` 的組合通知器（內部轉呼叫多組 `INotifier`）並在組裝處傳入；`PriceCalculator` 與 `OrderProcessor` 核心程式碼**零修改**，變更影響被有效隔離在通知邊界內。

## 常見誤解

- **誤解 1：「低耦合就是類別之間完全不能有依賴，依賴數越接近 0 越好。」**  
  修正：沒有任何依賴的程式通常也無法完成協作工作。依據微軟《Architectural principles》（`src-ms-dotnet-arch-principles`）與伊果第 8 篇（`src-igouist-oo-series`），正確的目標不是把依賴歸零，而是**保留必要協作、將對具體實作的硬依賴轉成對抽象介面的依賴（依賴反轉）**，並避免讓一個類別依賴幾十個毫不相關的外部型別（降低 CBO 指標異常膨脹）。
- **誤解 2：「把一個類別拆成十幾個只有兩行的小類別，就叫高內聚。」**  
  修正：過度零碎化反而會讓閱讀流程得在十幾個檔案間跳來跳去、增加系統整體的組裝耦合。**高內聚**指的是「關係密切、為了達成同一項任務的資料與操作放在一起」（如 `PriceCalculator` 集中所有計價規則），而不是盲目拆檔。
- **誤解 3：「把 `new EmailSender()` 從 `PlaceOrder` 移到 `OrderProcessor` 的建構式裡，就已經解耦了。」**  
  修正：如果建構式裡面依然自己寫 `_notifier = new EmailSender();`，`OrderProcessor` 仍然編譯期綁死在 `EmailSender` 具體類別上，換成簡訊還是得改 `OrderProcessor.cs`。必須讓建構式接收參數 `INotifier notifier`，交由外部傳入才算解除具體依賴（Explicit Dependencies）。

## 小練習與解析

### 檢查 1：為 `OrderProcessor` 撰寫不真正寄信的單元測試
如果想驗證 `OrderProcessor.PlaceOrder("test@user", 1000m)` 是否真的會算出 `1,050` 並傳出正確文字，但測試期間不能真的發送 Email 或簡訊，低耦合版本該如何處理？

- **參考解析**：只需在測試專案中寫一個假的實作 `class FakeNotifier : INotifier`，在 `Notify` 方法裡把收到的 `recipient` 與 `message` 存進記憶體清單中；接著在測試中執行 `new OrderProcessor(new PriceCalculator(), fakeNotifier)`，即可檢查 `fakeNotifier` 收到的字串是否包含 `1,050`，全程無須動到真實寄信伺服器或修改 `OrderProcessor`。

### 檢查 2：辨識「必要依賴」與「過度耦合」
觀察 `DecoupledOrder.cs` 中的 `OrderProcessor`，它依賴了 `PriceCalculator` 與 `INotifier` 兩個型別（還有一點基本型別 `string`、`decimal`）。如果有人批評「它還是依賴了 `PriceCalculator`，不夠低耦合」，這個批評合理嗎？為什麼？

- **參考解析**：依目前專案規模來說**不合理**。計算價格與發送通知是 `OrderProcessor` 完成下單流程的**必要依賴**；其中容易隨基礎設施變動的通知方式已經抽出 `INotifier` 介面，而高度單純且純運算的 `PriceCalculator` 沒有外部 I/O 副作用，直接協作並無問題。未來只有當計價規則本身需要多套策略抽換（例如一般會員價 vs 週年慶折扣引擎）時，才需要再替計價抽出 `IPriceCalculator` 介面，避免過度設計。

## 相關概念及資料來源

- **先修與延伸**：當程式學會把「資料規則」「核心協調」「外部細節」拆開後，把這套思路放到網頁開發上，就形成了經典的架構分工——第 07 章「MVC」以圖書查詢網頁說明 Model、View、Controller 的運作；若想更深入探討「外部如何把實作物件傳入建構式」並與依賴反轉（DIP）明確區分，可進一步閱讀第 09 章「依賴注入入門」。
- **已整合來源（Ingested）**：
  - `src-ms-code-metrics-coupling`（Microsoft Learn《Code metrics - Class coupling》）：提供類別耦合（CBO：唯一外部參考型別數）與模組內聚性之官方指標定義與維護性關聯。
  - `src-ms-dotnet-arch-principles`（Microsoft Learn《Architectural principles》）：提供關注點分離、單一職責（SRP）、依賴反轉（DIP）與明確依賴原則之規範依據。
  - `src-ms-csharp-interfaces`（Microsoft Learn《Interfaces - C#》）：支援使用 `INotifier` 介面隔離具體通知實作。
  - `src-igouist-oo-series`（伊果《菜雞與物件導向 (8) Cohesion 與 Coupling》）：補充高內聚低耦合的實務權衡與避免過度拆檔提醒。
