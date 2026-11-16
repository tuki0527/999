---
id: 02-encapsulation
slug: encapsulation
order: 2
title: 封裝
subtitle: 銀行帳戶：透過操作方法維護餘額及輸入規則
summary: 以銀行帳戶為情境，學習如何隱藏內部敏感欄位，並透過公開方法把關輸入驗證與狀態一致性。
status: verified
compileStatus: unverified-no-dotnet
prerequisites:
  - 01-classes-and-objects
tags:
  - 封裝
  - 存取修飾詞
  - 狀態保護
sourceIds:
  - src-ms-csharp-classes
  - src-ms-dotnet-arch-principles
  - src-igouist-oo-series
exampleIds:
  - 02-encapsulation/BankAccount.cs
  - 02-encapsulation/Program.cs
slideExampleId: 02-encapsulation/BankAccount.cs
slideLineRange: 17-41
demoId: bank-account
relatedIds:
  - 01-classes-and-objects
  - 06-coupling-and-cohesion
---

## 問題情境

在銀行系統裡，每個帳戶最重要的資產就是「餘額（Balance）」。假設開發者把帳戶餘額直接宣告成公開欄位或無保護的自動屬性 `public decimal Balance { get; set; }`：

- 外部程式可以寫出 `account.Balance = -5000;`（直接把餘額變成負數）；
- 或者在沒有檢查餘額是否足夠的情況下，直接寫 `account.Balance -= 20000;`；
- 甚至有人在提款時不小心傳入負數 `Withdraw(-500)`，若沒檢查就相減，結果負負得正變成「越提錢越多」。

依據微軟《.NET 架構設計原則》（`src-ms-dotnet-arch-principles`），當類別暴露可變的內部狀態給外界任意修改時，就無法在物件內部強制維護業務規則（即**領域不變量 Domain Invariants**）。這正是我們需要**封裝（Encapsulation）**的真正原因。

## 學習目標

- 理解封裝的雙重核心：**隱藏內部實作細節**與**保護領域不變量（Invariants）**，而不只是把欄位改名加前綴。
- 分辨「僅提供公開讀寫的 Getter/Setter」與「提供有意義的業務操作方法（`Deposit`、`Withdraw`）」之間的本質差異。
- 學會在操作方法內使用前置保護條件（Guard Clauses），並在驗證失敗時**保持原狀態不變**且明確回傳失敗原因。
- 認識財務計算為何在 C# 使用 `decimal`（以及在前端概念模擬中改用整數最小單位「分」）來防止浮點誤差。

## 觀念圖解

把 `BankAccount` 想成一座有櫃檯人員把關的銀行金庫：

1. **金庫內部（`private decimal _balance`）**
   - 外部程式（例如 `Program.cs`）在編譯期就無法直接觸碰或改寫 `_balance`。
   - 僅能透過唯讀屬性 `public decimal Balance => _balance;` 查看餘額，無法執行 `account.Balance = 999999;`。
2. **公開窗口（`Deposit(amount)` 與 `Withdraw(amount)`）**
   - 所有金流異動都必須經過這兩個公開操作方法。
   - **檢查通過**：修改 `_balance` 並回傳 `OperationResult(true, ...)`。
   - **檢查失敗**（金額 `<= 0` 或提款大於餘額）：立刻中止，**`_balance` 維持原封不動**，並回傳 `OperationResult(false, 失敗原因, _balance)`。

## C# 範例

本單元程式碼位於 `examples/csharp/02-encapsulation/`（**執行範圍說明**：`Program.cs` 與 `BankAccount.cs` 組成可獨立執行的 `.NET 8 Console` 最小專案）。注意在 C# 中貨幣金額固定使用 `decimal` 型別（字尾加 `m`，例如 `1000.00m`），避免二進位浮點數（`double`）產生的誤差。

### 逐行重點解說
- **`BankAccount.cs` 第 3–15 行**：使用 `public sealed class OperationResult` 定義唯讀不可變的交易結果載體，讓呼叫端同時拿到是否成功、錯誤訊息與交易後餘額。
- **`BankAccount.cs` 第 19–23 行**：`_balance` 設為 `private`，對外只開放 `=> _balance` 唯讀計算屬性。即使外部想直接改餘額也會在編譯階段失敗。
- **`BankAccount.cs` 第 32–57 行**：`Deposit` 與 `Withdraw` 先執行 `if (amount <= 0m)` 與 `if (amount > _balance)` 防護條件；只要任一規則未過就提早 `return`，確保 `_balance` 不會在中途被改壞。
- **`Program.cs` 第 4–14 行**：依序模擬「合法存款 250.50」「超額提款 2000」「負數存款 -100」「合法提款 350.25」，印出每筆回傳結果與當下餘額。

## 預期結果

執行 `Program.cs` 時，第 2 次「提領 2000 元」與第 3 次「存入 -100 元」都會被帳戶規則攔截，且每次失敗後餘額皆保持原本的 `1,250.50` 元，直到第 4 次合法提領 `350.25` 元才更新為 `900.25` 元：

```text
True | 成功存入 250.50 元。 | 餘額：1,250.50
False | 餘額不足，無法完成提款。 | 餘額：1,250.50
False | 存款金額必須大於 0。 | 餘額：1,250.50
True | 成功提領 350.25 元。 | 餘額：900.25
```

## 修改需求的比較

假設金融法規新增規定：「單筆提款金額不得超過 50,000 元，且帳戶凍結期間禁止任何提款。」

- **未封裝（外部直接加減 `Balance`）**：所有寫過 `account.Balance -= amount;` 的頁面與模組都必須各寫一次上限與凍結檢查，只要有一處忘記補上，系統就會出現嚴重資金漏洞。
- **已封裝（統一由 `Withdraw` 方法把關）**：所有呼叫端原本就只能透過 `account.Withdraw(amount)` 提款，我們只需在 `BankAccount.Withdraw` 內加上單筆上限與狀態檢查，外部呼叫端一行都不用改，整個系統立刻一致套用新規則。

## 常見誤解

- **誤解 1：「只要把欄位設成 `private`，再幫每個欄位加上 `{ get; set; }`，就是做到封裝了。」**  
  修正：如果屬性有公開且毫無檢查的 `set`（例如 `public decimal Balance { get; set; }`），外部依然可以寫出 `account.Balance = -9999;`，這與公開欄位幾乎沒有差別，並未保護任何不變量。真正的封裝是讓外界「透過受驗證的業務行為（`Deposit`、`Withdraw`）來推進狀態」，或只在 `private set` 內部修改（`src-ms-dotnet-arch-principles`、`src-igouist-oo-series`）。
- **誤解 2：「驗證失敗時回傳 `false` 就夠了，不需要解釋原因。」**  
  修正：在真實系統與使用者介面中，呼叫端需要區分「輸入負數」與「餘額不足」以給予正確提示。像本例回傳不可變的 `OperationResult` 物件，能同時提供成功旗標、清楚原因與交易後餘額。
- **誤解 3：「用 `double` 存金額也沒關係，反正畫面只顯示小數點兩位。」**  
  修正：`double` 採用二進位浮點數近似表達十進位小數，長期加減後極易出現 `0.01` 的誤差累積；C# 財務運算應使用 `decimal`，而 JavaScript/TypeScript 前端概念模擬（本頁互動區）則應改以整數「分（cents）」運算後再格式化顯示。

## 小練習與解析

### 檢查 1：建構階段的不變量把關
觀察 `BankAccount` 的建構式：`_balance = initialBalance >= 0m ? initialBalance : 0m;`。如果今天需求改為「開戶初始金額為負數時必須直接拒絕建立物件（拋出例外）」，而不是默默重設為 `0`，應該怎麼寫？

- **參考解析**：在建構式開頭加上前置檢查：`if (initialBalance < 0m) throw new ArgumentOutOfRangeException(nameof(initialBalance), "開戶初始餘額不可為負數。");`。這能讓物件連誕生那一刻都嚴守「餘額不可為負」的不變量，避免錯誤輸入靜默變成 0 元帳戶。

### 檢查 2：辨識「偽封裝」與真實封裝
假設同事把程式碼改寫成這樣：
```csharp
public class BankAccount
{
    private decimal _balance;
    public decimal Balance
    {
        get => _balance;
        set => _balance = value;
    }
}
```
這樣寫已經用到 `private` 與屬性（Property），算是有好好保護帳戶餘額嗎？為什麼？

- **參考解析**：**不算**。雖然 `_balance` 表面上是 `private`，但公開的 `set => _balance = value;` 沒有做任何合法性檢查，也沒有記錄交易行為，外部依然能執行 `account.Balance = -5000m;`。要保護餘額，應移除公開 `set`（只保留 `get => _balance;`），強制所有異動透過 `Deposit` 與 `Withdraw` 方法驗證。

## 相關概念及資料來源

- **先修與延伸**：本篇建立在「01 類別與物件」的藍圖觀念上；進一步將檢核與通知拆離、降低類別間依賴的方法，將於「06 耦合與內聚」深入探討。
- **已整合來源（Ingested）**：
  - `src-ms-csharp-classes`（Microsoft Learn《Classes, structs, and records in C#》）：定義存取修飾詞、`private` 欄位與唯讀屬性。
  - `src-ms-dotnet-arch-principles`（Microsoft Learn《Architectural principles》）：說明封裝用來保護領域不變量、防止外部任意修改內部狀態的核心價值。
  - `src-igouist-oo-series`（伊果《菜雞與物件導向 (3) 封裝》）：補充門窗控制與保護內部狀態的教學脈絡。
