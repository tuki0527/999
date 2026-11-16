using System;
using System.Collections.Generic;
using System.Linq;

namespace ConceptLabMvc.Models;

public sealed record BookItem(string Id, string Title, string Author, string Category);

// Model：保存應用狀態與查詢商業規則（不依賴 Controller 或 View）
public class BookCatalogModel
{
    private readonly List<BookItem> _books = new()
    {
        new("B01", "深入淺出 C# 物件導向", "林子軒", "程式語言"),
        new("B02", "ASP.NET Core MVC 實戰手冊", "陳怡君", "網頁架構"),
        new("B03", "低耦合軟體設計與重構", "張書豪", "軟體工程")
    };

    public IReadOnlyList<BookItem> Search(string? keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword)) return _books;
        string term = keyword.Trim();
        return _books
            .Where(b => b.Title.Contains(term, StringComparison.OrdinalIgnoreCase)
                     || b.Category.Contains(term, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }
}
