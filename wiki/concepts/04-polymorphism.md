---
id: 04-polymorphism
slug: polymorphism
order: 4
title: 多型
subtitle: 不同動物發聲：共同型別與執行期動態分派
summary: 透過動物合唱團情境，理解宣告型別與執行期實際型別的差異，掌握 virtual、override 動態分派與 Overload 的區別。
status: verified
compileStatus: unverified-no-dotnet
prerequisites:
  - 01-classes-and-objects
  - 03-inheritance-and-composition
tags:
  - 多型
  - virtual 與 override
  - 動態分派
sourceIds:
  - src-ms-csharp-polymorphism
  - src-ms-csharp-inheritance
exampleIds:
  - 04-polymorphism/AnimalChorus.cs
  - 04-polymorphism/Program.cs
slideExampleId: 04-polymorphism/AnimalChorus.cs
slideLineRange: 3-25
demoId: animal-chorus
relatedIds:
  - 03-inheritance-and-composition
  - 05-abstract-class-and-interface
---

## 問題情境

假設你在開發一款兒童語言教學軟體，畫面上要一次讓一群動物依序發出叫聲。如果沒有利用物件導向的共同型別與多型，你可能會寫出這樣的判斷式：

- 用 `List<object>` 裝所有動物；
- 每次要發聲就寫一長串 `if (item is Dog d) d.Bark(); else if (item is Cat c) c.Meow(); else if (item is Duck k) k.Quack();`。

只要動物種類增加到 20 種（企鵝、綿羊、青蛙……），所有走訪動物清單的地方就得重複打開來補 `else if`。真正理想的寫法，是讓呼叫端只需統一面對 `List<Animal>` 呼叫 `animal.Speak()`，而每隻動物在執行當下自動發出屬於自己的聲音。這就是**多型（Polymorphism）**的核心威力。

## 學習目標

- 區分變數的**宣告型別（Declared / Compile-time Type）**與物件的**執行期實際型別（Runtime Type）**。
- 理解 C# 如何透過 **`virtual`** 與 **`override`** 在執行期進行**動態分派（Dynamic Dispatch）**。
- 分辨 **Override（覆寫：執行期依實際物件分派）** 與 **Overload（多載：編譯期依參數簽章決定）** 的差異，並認識方法隱藏（`new`）可能帶來的陷阱。
- 在互動模擬器中逐一呼叫 `List<Animal>` 元素，觀察相同呼叫語句如何分派至不同子類別實作。

## 觀念圖解

在 `foreach (Animal animal in chorus)` 迴圈裡，發生了兩件不同階段的事情：

1. **編譯期檢視（Compile-time）**
   - 變數 `animal` 的**宣告型別**是 `Animal`。編譯器只檢查 `Animal` 身上有沒有公開的 `Speak()` 方法。
2. **執行期分派（Runtime）**
   - 當迴圈走到第 0 個元素，記憶體裡實際上是一隻 `Dog`，CLR（.NET 執行時期）會查找實際物件的虛擬方法表，分派到 **`Dog.Speak()`**（輸出「汪汪！」）。
   - 走到第 1 個元素 `Cat`，自動分派到 **`Cat.Speak()`**（輸出「喵～」）。
   - 若集合裡放了一個沒有覆寫、或本身就是 `new Animal("未分類動物")` 的物件，則執行基底類別的 `virtual Speak()` 預設實作。

## C# 範例

本單元程式碼位於 `examples/csharp/04-polymorphism/`（**執行範圍說明**：`Program.cs` 與 `AnimalChorus.cs` 組成可獨立執行的 `.NET 8 Console` 最小專案）。

### 逐行重點解說
- **`AnimalChorus.cs` 第 8–9 行**：在基底類別 `Animal` 加上 `virtual`，明確開放子類別可以安全覆寫 `Speak()` 的實作內容。
- **`AnimalChorus.cs` 第 11–12 行**：`public string Speak(int times)` 則是**方法多載（Overload）**——它與 `Speak()` 同名但參數不同，編譯器在編譯當下就已確定呼叫這支版本；不過它內部呼叫 `Speak()` 時，依然會觸發動態分派！
- **`AnimalChorus.cs` 第 15–31 行**：`Dog`、`Cat`、`Duck` 各自透過 `override` 提供自己的叫聲版本。注意 `override` 必須精確符合基底 `virtual` 方法的簽章。
- **`Program.cs` 第 3–17 行**：將 `Dog`、`Cat`、`Duck` 與 `Animal` 一起放進同一個 `List<Animal>`，只靠同一行 `animal.Speak()` 就能印出四種不同聲音。

## 預期結果

執行 `Program.cs` 時，相同的 `foreach` 迴圈依序呼叫每個元素的 `Speak()`，會依物件實際型別印出各自叫聲，最後示範 `chorus[0].Speak(2)` 呼叫多載方法：

```text
阿柴：汪汪！
橘貓：喵～
小鴨：呱呱！
未分類動物 發出一般動物聲音

多載方法呼叫示範（編譯期選 Speak(int)，內部再動態分派 Speak()）：
阿柴：汪汪！（重複 2 次）
```

## 修改需求的比較

假設教材團隊決定在合唱團裡加入「青蛙（Frog）：呱呱呱」與「綿羊（Sheep）：咩～」。

- **未使用多型（`if / else if` 判斷具體型別）**：你必須找出專案中所有列舉動物發聲的地方，逐一補上兩個 `else if` 分支，漏掉任何一處就會在執行時發出錯誤或空白聲音。
- **使用 `virtual` / `override` 多型**：只需新增 `Frog : Animal` 與 `Sheep : Animal` 並 `override Speak()`，原本處理 `List<Animal>` 的合唱迴圈一行都不必更改（符合開放封閉原則的精神）。

## 常見誤解

- **誤解 1：「多載（Overload）跟覆寫（Override）是同一件事，都是多寫幾個同名方法。」**  
  修正：兩者機制完全不同。**Overload** 發生在同一類別（或繼承鏈）中「同名但參數列表不同」，由編譯器在編譯期依傳入參數型別直接綁定；**Override** 是子類別針對父類別的 `virtual`/`abstract` 方法提供同名、同參數的新實作，由執行期依物件真實型別動態派發。
- **誤解 2：「子類別忘了寫 `override`，直接寫同名方法或加上 `new` 也能多型。」**  
  修正：依據微軟《Polymorphism - C#》（`src-ms-csharp-polymorphism`），如果子類別沒有寫 `override` 而使用 `new`（方法隱藏 Method Hiding），呼叫結果會取決於變數的「宣告型別」！當 `Dog` 被放進 `List<Animal>` 透過 `Animal` 參考呼叫時，寫了 `new Speak()` 反而只會叫出基底類別 `Animal` 的聲音，失去多型效果。
- **誤解 3：「子類別永遠都能無限覆寫下去，無法阻止。」**  
  修正：若某個衍生類別希望定案某個覆寫邏輯、不再讓下一代子類別改寫，C# 支援在方法宣告加上 `sealed override`（例如 `public sealed override string Speak()`），即可終止該方法的進一步覆寫。

## 小練習與解析

### 檢查 1：沒有加上 `virtual` 與 `override` 的結果
假設你把 `Animal.Speak()` 上的 `virtual` 拿掉，並把 `Dog.Speak()` 上的 `override` 改成 `new`（隱藏方法）。當執行以下程式時，會印出什麼？
```csharp
Animal pet = new Dog("阿柴");
Console.WriteLine(pet.Speak());
```

- **參考解析**：會印出 **`阿柴 發出一般動物聲音`**（而不是「汪汪！」）。因為方法隱藏（`new`）不會進入動態分派表，當變數宣告型別是 `Animal` 時，編譯器直接綁定了 `Animal.Speak()`。這就是為什麼要做到真正的多型，父類別必須是 `virtual`/`abstract`（或介面方法），子類別必須搭配 `override`。

### 檢查 2：Override 與 Overload 在一次呼叫中的協作
觀察 `AnimalChorus.cs` 第 12 行 `public string Speak(int times) => $"{Speak()}（重複 {times} 次）";`。如果對宣告為 `Animal pet = new Cat("橘貓");` 呼叫 `pet.Speak(2)`，請說明編譯期與執行期各發生了什麼事？

- **參考解析**：
  1. **編譯期**：編譯器看到參數 `2` 是 `int`，在 `Animal` 上找到符合簽章的 `Speak(int times)` 多載版本並固定呼叫它。
  2. **執行期**：進入 `Animal.Speak(int)` 後，它內部呼叫無參數的 `Speak()`；因為 `Speak()` 是 `virtual` 且 `pet` 實際上是 `Cat`，CLR 動態分派執行 `Cat.Speak()`，最終輸出「橘貓：喵～（重複 2 次）」。

## 相關概念及資料來源

- **先修與延伸**：在動物案例中，`Animal` 可以直接 `new Animal(...)` 當作具體物件；但如果「幾何圖形（Shape）」這種概念本身根本畫不出來、也不知道預設面積怎麼算，該怎麼辦？下一章「05 抽象類別與介面」將介紹 `abstract class` 與 `interface`。
- **已整合來源（Ingested）**：
  - `src-ms-csharp-polymorphism`（Microsoft Learn《Polymorphism - C#》）：定義宣告型別 vs 執行期型別、動態分派、`new` 方法隱藏與 `sealed override` 規則。
  - `src-ms-csharp-inheritance`（Microsoft Learn《Inheritance in C#》）：補充基底類別與衍生類別方法覆寫關係。
