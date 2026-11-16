using Microsoft.AspNetCore.Mvc;
using ConceptLabMvc.Models;

namespace ConceptLabMvc.Controllers;

// Controller：接收查詢參數、協調 Model 查詢、選擇回傳的 View
public class BooksController : Controller
{
    private readonly BookCatalogModel _catalog = new();

    [HttpGet]
    public IActionResult Index(string? keyword)
    {
        var results = _catalog.Search(keyword);
        ViewData["Keyword"] = keyword ?? string.Empty;
        return View(results); // 傳遞結果給 Views/Books/Index.cshtml
    }
}
