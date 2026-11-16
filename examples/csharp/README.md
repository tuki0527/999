# C# 範例原始碼與執行環境說明

本目錄存放「程式觀念實驗室」第 01 至 09 章對應的 C# 12（.NET 8.0）範例原始碼與專案設定檔。

## 專案類型分界

1. **純 C# 主控台最小專案（第 01–06、08、09 章）**
   - 每個章節資料夾內皆附有 `.csproj`（`Microsoft.NET.Sdk`，目標框架 `net8.0`），可直接在該章目錄執行。
   - **執行指令**：
     ```bash
     cd examples/csharp/01-classes-and-objects
     dotnet run
     ```
2. **ASP.NET Core MVC Web App 專案（第 07 章 `07-mvc-architecture`）**
   - 第 07 章包含 `Controllers/BooksController.cs`、`Models/BookCatalogModel.cs` 與 Razor View `Views/Books/Index.cshtml`，使用 `Microsoft.NET.Sdk.Web`（`ConceptLabMvc.csproj`），**不可混入主控台 Console 專案執行**。
   - **執行指令**：
     ```bash
     cd examples/csharp/07-mvc-architecture
     dotnet run
     # 啟動後以瀏覽器開啟終端機顯示之本機網址，例如 http://localhost:5000/Books/Index?keyword=MVC
     ```

## 開發環境驗證狀態

目前網站建置環境僅具備 Node.js / Vite，**未安裝 `.NET SDK`（`dotnet --version` 確認不存在）**，因此全站所有 C# 範例目前誠實標記為「未本地編譯驗證」。於具備 .NET 8 SDK 之環境完成 `dotnet build` / `dotnet run` 實測後，再同步更新 `docs/verification.md`。
