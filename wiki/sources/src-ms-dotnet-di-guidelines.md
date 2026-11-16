---
sourceId: src-ms-dotnet-di-guidelines
title: Dependency injection guidelines - .NET (S09)
authorOrOrg: Microsoft Learn (.NET Docs)
url: https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection-guidelines
status: ingested
readDate: 2026-11-14
---

## 來源基本資訊
- **讀取日期與方式**：2026-11-14（透過 Node `fetch` 取得 HTTP 200 完整正文並人工消化整理）
- **對應教材章節**：`09-dependency-injection`

## 核心摘要（自撰整理）
本篇官方實務指南說明在 .NET 專案設計支援 DI 的服務時應遵守的結構原則：
1. **避免在服務內部直接具現化相依類別**：在業務服務中直接 `new` 具體工具會造成實作耦合；應交由建構式從外部注入。
2. **避免有狀態的靜態（`static`）類別或全域可變狀態**：靜態全域狀態會隱藏依賴並干擾測試隔離；若需要全程式共用單一實例，應在組裝端以單例（Singleton）或單一注入實例管理。
3. **透過建構式參數數量檢視單一職責（SRP）**：官方特別提醒，如果一個類別的建構式需要注入非常多服務，往往代表這個類別承擔過多職責，應思考拆分為更小、內聚性更高的服務。
4. **生命週期與資源釋放邊界**：使用容器時，由容器建立的 `IDisposable` 實例應由容器依 Transient / Scoped / Singleton 範圍負責釋放，使用端不應手動處置外部傳入的服務。

## 與其他來源的關聯或差異
- 補強 `src-ms-dotnet-di` 著重「如何注入」，而本篇著重「建構式變胖怎麼辦、為何不該用 `static` 繞過注入」，並再次把第 06 章的單一職責與第 09 章的依賴注入扣合在一起。

## 來源限制與備註
- Transient / Scoped / Singleton 生命週期與 `IServiceScope` 屬於導入容器後的進階議題；第 09 章作為「依賴注入入門」，先專注把**建構式注入、Composition Root 組裝點**及**DI 與 DIP 的區分**講清楚，避免初學者一次被生命週期陷阱淹沒。
