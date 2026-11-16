using System;
using System.Collections.Generic;

namespace ConceptLab.Ch08.Before;

// 重構前：資料結構、商業規則與主控台輸出全混在單一方法
public class MixedTodoApp
{
    public void Run()
    {
        var items = new List<string> { "[ ] 閱讀封裝章節", "[x] 建立專案" };
        // 若要新增「截止日期」或改用網頁呈現，所有字串格式解析與輸出都要重改
        foreach (var raw in items) Console.WriteLine(raw);
    }
}
