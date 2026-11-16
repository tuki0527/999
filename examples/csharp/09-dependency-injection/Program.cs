using System;
using ConceptLab.Ch09.DI;

// 組裝端（Composition Root）：由外部決定要注入哪一個 IProcessingLogger 實作
Console.WriteLine("=== 情境 1：注入 ConsoleProcessingLogger ===");
var consoleProcessor = new FileProcessor(new ConsoleProcessingLogger());
consoleProcessor.ProcessFile("orders_2026.csv", 120);

Console.WriteLine("=== 情境 2：替換注入 FileAuditProcessingLogger（FileProcessor 零修改） ===");
var auditLogger = new FileAuditProcessingLogger();
var auditProcessor = new FileProcessor(auditLogger);
auditProcessor.ProcessFile("orders_2026.csv", 120);
Console.WriteLine($"稽核紀錄總筆數：{auditLogger.Records.Count}");

Console.WriteLine("=== 情境 3：測試／靜音模式注入 SilentNullLogger ===");
var silentProcessor = new FileProcessor(new SilentNullLogger());
bool ok = silentProcessor.ProcessFile("   ", 0);
Console.WriteLine($"靜音處理結果：{ok}");
