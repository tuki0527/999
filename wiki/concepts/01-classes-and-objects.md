---
id: 01-classes-and-objects
slug: classes-and-objects
order: 1
title: 類別與物件
subtitle: 學生名冊：從藍圖定義到獨立個體
summary: 以學生名冊為情境，理解 Class 與 Object 的差異，並掌握欄位、屬性、方法與建構式的分工。
status: verified
compileStatus: unverified-no-dotnet
prerequisites: []
tags:
  - 物件導向基礎
  - Class 與 Object
  - 建構式
sourceIds:
  - src-ms-csharp-classes
  - src-igouist-oo-series
exampleIds:
  - 01-classes-and-objects/Student.cs
  - 01-classes-and-objects/Program.cs
slideExampleId: 01-classes-and-objects/Student.cs
slideLineRange: 3-24
demoId: student-roster
relatedIds:
  - 02-encapsulation
  - 03-inheritance-and-composition
---

## 問題情境

想像你正在協助導師撰寫一個「學生名冊」程式。剛開始只有兩位學生，你可能用平行變數來記錄資料：

- `studentAName = "林小安"`、`studentAScore = 78`
- `studentBName = "陳以樂"`、`studentBScore = 54`

但只要班上有 30 位學生，還要計算每位學生是否及格、更新段考分數、印出統一格式的摘要，這種散落四處的變數與函式就會迅速失控：你可能不小心把 `studentAName` 配到 `studentBScore`，或是每次新增欄位（例如學號）都要到處修改參數清單。

我們真正需要的，是把「每位學生擁有的資料」與「對學生能做的操作」打包成同一份**設計藍圖（Class）**，再依藍圖建立彼此獨立的**學生個體（Object / Instance）**。

## 學習目標

- 分辨**類別（Class）**與**物件實例（Object / Instance）**的差異：一份藍圖可以產生多個在記憶體中彼此獨立的物件。
- 說出**欄位（Field）**、**屬性（Property）**、**建構式（Constructor）**與**方法（Method）**各自的分工，以及 C# 預設成員存取權為 `private` 的規則。
- 了解為何 C# `class` 屬於參考型別（Reference Type），並認識 `class`、`struct`、`record` 的基本差異。
- 在下方的互動概念模擬中，觀察對其中一個學生物件呼叫 `UpdateScore(...)` 時，為何不會改變另一個物件的分數。

## 觀念圖解

把 `Student` 想像成一張「學生資料卡設計圖」：

1. **設計藍圖（Class：`Student`）**
   - 定義結構：每位學生都會有 `StudentId`（學號）、`Name`（姓名）與 `_score`（內部成績欄位）。
   - 定義行為：所有學生都能執行 `UpdateScore(int newScore)` 與 `GetSummary()`。
2. **實體化個體（Objects：`studentA`、`studentB`）**
   - 執行 `new Student("S101", "林小安", 78)` 會在受控堆積（Managed Heap）配置第一份獨立資料，由變數 `studentA` 持有其參考。
   - 執行 `new Student("S102", "陳以樂", 54)` 會配置第二份獨立資料，由變數 `studentB` 持有參考。
   - `studentA` 與 `studentB` 共用同一份 `Student` 類別的方法邏輯，但各自的狀態（欄位與屬性值）完全分開存放。

## C# 範例

本單元程式碼置於 `examples/csharp/01-classes-and-objects/` 專案中（**執行範圍說明**：`Program.cs` 為 `.NET 8 Console` 最小專案進入點，與同目錄 `Student.cs` 搭配即可執行；未安裝本地 `.NET SDK` 的環境標示為靜態教材範例）。

### 逐行重點解說
- **`Student.cs` 第 5–8 行**：`private int _score;` 是內部欄位，保留為類別內部狀態；`StudentId`、`Name` 採唯讀公開屬性（只有 `get;`），避免建立後隨意換人名或改錯學號。在 C# 中，若類別成員未寫存取修飾詞，預設一律為 `private`。
- **`Student.cs` 第 10–15 行**：建構式 `Student(string studentId, string name, int initialScore)` 在 `new Student(...)` 時立刻執行，負責寫入初始狀態並限制分數落在 `0` 到 `100` 之間，避免誕生資料殘缺的物件。
- **`Student.cs` 第 17–28 行**：`UpdateScore(int newScore)` 與 `GetSummary()` 是實例方法，操作的是呼叫當下那一個物件實例（`this`）自己的 `_score` 與 `Name`。
- **`Program.cs` 第 4–12 行**：先透過同一份 `Student` 藍圖建出 `studentA` 與 `studentB`，接著僅對 `studentB` 呼叫 `UpdateScore(82)`，驗證兩個實例狀態互不干擾。

## 預期結果

執行 `Program.cs` 後，主控台會先印出兩位學生的初始摘要；接著僅對 `studentB` 呼叫 `UpdateScore(82)`，再次輸出時會發現只有陳以樂的成績改變，林小安維持原本的 `78` 分：

```text
S101 林小安｜成績：78 分（及格）
S102 陳以樂｜成績：54 分（需加強）
更新陳以樂成績後：
S101 林小安｜成績：78 分（及格）
S102 陳以樂｜成績：82 分（及格）
```

## 修改需求的比較

假設教務處提出新需求：「學生成績必須介於 0 到 100 分之間，且摘要要加上『優等（90分以上）』等級標示。」

- **未使用類別（散落變數與多個獨立函式）**：你必須搜尋程式裡所有直接改寫分數變數的地方，逐一補上 `if` 檢查；所有負責格式化列印的函式也都要確認參數順序是否一致，漏改一處就會出現資料不一致。
- **使用 `Student` 類別之後**：檢查規則集中在 `Student.UpdateScore`，等級判斷集中在 `Student.GetSummary`。不管名冊上有 2 位還是 500 位學生，只要修改 `Student.cs` 這個單一藍圖，所有學生物件都會立即遵循新規則。

## 常見誤解

- **誤解 1：「Class 本身就能直接存學生的姓名和分數。」**  
  修正：一般實例成員（沒有 `static`）屬於個別物件，而不是類別本身。`Student` 只是藍圖，必須透過 `new Student(...)` 產生具體物件後，才各自擁有 `Name` 與 `Score`。
- **誤解 2：「兩個 `Student` 物件如果內容完全相同，用 `==` 比較就會相等。」**  
  修正：依據微軟官方文件對 `class` 的定義，`class` 屬於**參考型別（Reference Type）**，預設比較的是兩者是否指向同一個記憶體實例；若需要「依欄位值判斷相等」（Value Equality）的不可變資料載體，C# 提供 `record` 關鍵字（第 02 章的 `OperationResult` 與第 07 章的 `BookItem` 皆採用 `record`）。
- **誤解 3：「改了 `studentB.UpdateScore(82)`，同為 `Student` 型別的 `studentA` 也會變。」**  
  修正：方法程式碼雖然共用一份，但執行時隱含的 `this` 指向的是呼叫它的物件（`studentB`），因此只會改動 `studentB` 自己記憶體區塊中的 `_score`。

## 小練習與解析

### 檢查 1：建構式多載與重用初始化邏輯
如果希望在建立學生時，「沒有提供初始成績就預設為 `0` 分」，同時保留原本三個參數的建構式，應該如何在 `Student` 類別中設計，才不會重複寫一次初始化與防呆檢查？

- **參考解析**：可以在 `Student` 中進行**建構式多載（Constructor Overloading）**，新增一個只接收 `(string studentId, string name)` 的建構式，並使用 `: this(studentId, name, 0)` 轉呼叫原本的三參數建構式。這樣既能避免重複初始化程式碼，又能讓呼叫端依情境選擇建立方式。

### 檢查 2：兩個變數指向同一個物件實例
假設寫了以下兩行 C# 程式：
```csharp
var s1 = new Student("S101", "林小安", 78);
var s2 = s1;
s2.UpdateScore(95);
```
請問此時 `s1.Score` 會是多少？為什麼與下方的互動模擬中「`studentA` 與 `studentB` 互不影響」不同？

- **參考解析**：`s1.Score` 會變成 **`95`**。因為 `Student` 是 `class`（參考型別），`var s2 = s1;` 並沒有呼叫 `new`，只是把 `s1` 指向物件實例的**參考位址**複製一份給 `s2`，所以 `s1` 與 `s2` 指向的是同一個學生物件；只有分別執行兩次 `new Student(...)` 時，才會在記憶體建立兩個獨立實例。

## 相關概念及資料來源

- **後續接軌**：理解類別與物件如何打包資料與行為後，下一章「02 封裝」將進一步探討為什麼只隱藏欄位並不夠，還必須把規則檢查寫進操作方法裡。
- **已整合來源（Ingested）**：
  - `src-ms-csharp-classes`（Microsoft Learn《Classes, structs, and records in C#》）：提供藍圖與實例、預設 `private` 存取權限與 `class`/`struct`/`record` 型別性質之官方定義。
  - `src-igouist-oo-series`（伊果《菜雞與物件導向 (1) Class 與 Object》）：輔助建立「設計圖與實體個體」之繁體中文教學脈絡。
- **補充來源狀態說明**：`src-medium-oop-concept`（Medium 補充文章）因 Cloudflare HTTP 403 防護未能讀取全文，目前維持 `unavailable`，未納入本篇引用。
