using System;
using System.Collections.Generic;

namespace ConceptLab.Ch08.Refactored;

// 1. 資料與規則層（Entity / Domain Rule）
public class TodoItem
{
    public int Id { get; }
    public string Title { get; }
    public bool IsDone { get; private set; }
    public string? DueDate { get; private set; } // 擴充截止日期只需加在資料模型

    public TodoItem(int id, string title, string? dueDate = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("待辦標題不可為空白。");
        Id = id;
        Title = title.Trim();
        DueDate = dueDate;
    }

    public void ToggleDone() => IsDone = !IsDone;
}

// 2. 操作協調層（Service / Coordinator）
public class TodoService
{
    private readonly List<TodoItem> _items = new();
    private int _nextId = 1;

    public IReadOnlyList<TodoItem> Items => _items;

    public TodoItem Add(string title, string? dueDate = null)
    {
        var item = new TodoItem(_nextId++, title, dueDate);
        _items.Add(item);
        return item;
    }

    public bool Toggle(int id)
    {
        var target = _items.Find(x => x.Id == id);
        if (target is null) return false;
        target.ToggleDone();
        return true;
    }

    public bool Remove(int id) => _items.RemoveAll(x => x.Id == id) > 0;
}

// 3. 畫面呈現層（View）
public class TodoConsoleView
{
    public void Render(IReadOnlyList<TodoItem> items)
    {
        foreach (var item in items)
        {
            string mark = item.IsDone ? "[x]" : "[ ]";
            string due = string.IsNullOrEmpty(item.DueDate) ? "" : $"（期限：{item.DueDate}）";
            Console.WriteLine($"{mark} #{item.Id} {item.Title}{due}");
        }
    }
}
