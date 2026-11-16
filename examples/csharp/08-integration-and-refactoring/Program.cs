using ConceptLab.Ch08.Refactored;

var service = new TodoService();
var view = new TodoConsoleView();

service.Add("完成物件導向筆記", "2026-11-20");
service.Add("練習 MVC 分層");
service.Toggle(1);

view.Render(service.Items);
