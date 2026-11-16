using System;
using System.Collections.Generic;

namespace ConceptLab.Ch09.DI;

// 1. 抽象契約：只定義「記錄訊息」的能力（依賴反轉的抽象邊界）
public interface IProcessingLogger
{
    void Log(string message);
}

// 2. 實作 A：主控台即時輸出
public sealed class ConsoleProcessingLogger : IProcessingLogger
{
    public void Log(string message)
    {
        Console.WriteLine($"[Console] {message}");
    }
}

// 3. 實作 B：稽核紀錄檔緩衝模擬
public sealed class FileAuditProcessingLogger : IProcessingLogger
{
    private readonly List<string> _records = new List<string>();
    public IReadOnlyList<string> Records => _records;

    public void Log(string message)
    {
        string entry = $"[AuditFile] {message}";
        _records.Add(entry);
        Console.WriteLine($"已寫入稽核紀錄檔：{entry}");
    }
}

// 4. 實作 C：靜音紀錄器（測試或停用紀錄時使用）
public sealed class SilentNullLogger : IProcessingLogger
{
    public void Log(string message)
    {
        // 刻意不輸出任何內容，讓測試或靜音模式零副作用
    }
}

// 5. 使用端服務：透過建構式注入接收 IProcessingLogger，不在內部 new 具體實作
public sealed class FileProcessor
{
    private readonly IProcessingLogger _logger;

    public FileProcessor(IProcessingLogger logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public bool ProcessFile(string fileName, int lineCount)
    {
        if (string.IsNullOrWhiteSpace(fileName) || lineCount <= 0)
        {
            _logger.Log("檔案驗證失敗：檔名不可空白，且行數必須大於 0。");
            return false;
        }

        _logger.Log($"開始處理 {fileName}（共 {lineCount} 行）");
        _logger.Log($"完成處理 {fileName}，已通過格式檢查。");
        return true;
    }
}
