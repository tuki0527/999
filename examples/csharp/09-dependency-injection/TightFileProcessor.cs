using System;

namespace ConceptLab.Ch09.Tight;

public sealed class ConsoleAuditLogger
{
    public void Log(string message) => Console.WriteLine($"[Console] {message}");
}

// 反例：雖然有獨立的 Logger 類別，卻在內部直接 new 寫死具體實作
public sealed class TightFileProcessor
{
    private readonly ConsoleAuditLogger _logger = new ConsoleAuditLogger();

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
