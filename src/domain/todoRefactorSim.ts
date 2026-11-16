export interface SimTodoItem {
  id: number;
  title: string;
  isDone: boolean;
  dueDate: string | null;
}

export type TodoLayerInspect = 'data' | 'service' | 'view' | 'before';

export interface TodoLayerInfo {
  id: TodoLayerInspect;
  label: string;
  csharpFile: 'RefactoredTodo.cs' | 'MixedTodoBefore.cs';
  highlightLines: number[];
  responsibility: string;
  dueDateImpact: string;
}

export const TODO_LAYERS: Record<TodoLayerInspect, TodoLayerInfo> = {
  data: {
    id: 'data',
    label: '資料與規則（TodoItem）',
    csharpFile: 'RefactoredTodo.cs',
    highlightLines: [7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 22],
    responsibility: '封裝單筆待辦的狀態與不變量（例如標題不可空白、ToggleDone 控制完成狀態）。',
    dueDateImpact: '新增「截止日期」時：在此補上 DueDate 屬性與建構式可選參數，不破壞其他流程。',
  },
  service: {
    id: 'service',
    label: '操作協調（TodoService）',
    csharpFile: 'RefactoredTodo.cs',
    highlightLines: [27, 28, 32, 34, 41, 49],
    responsibility: '管理待辦清單的新增、切換完成與刪除協調邏輯，對外提供明確方法操作。',
    dueDateImpact: '新增「截止日期」時：僅在 Add() 轉傳可選 dueDate，Toggle 與 Remove 完全不用改。',
  },
  view: {
    id: 'view',
    label: '畫面呈現（TodoConsoleView）',
    csharpFile: 'RefactoredTodo.cs',
    highlightLines: [53, 55, 57, 59, 60, 61],
    responsibility: '專注將 IReadOnlyList<TodoItem> 格式化為使用者畫面，不直接改寫清單資料。',
    dueDateImpact: '新增「截止日期」時：僅調整輸出字串格式化，與規則檢查完全隔離。',
  },
  before: {
    id: 'before',
    label: '重構前對照（MixedTodoBefore）',
    csharpFile: 'MixedTodoBefore.cs',
    highlightLines: [7, 8, 9, 10, 11, 12, 13],
    responsibility: '把資料格式（"[ ] 標題" 字串）、清單操作與輸出混在同一個 Run() 方法中。',
    dueDateImpact: '新增「截止日期」或換成網頁顯示時：所有字串切割與輸出都要全部重寫，極易改壞。',
  },
};

export function createInitialTodos(): SimTodoItem[] {
  return [
    { id: 1, title: '完成物件導向筆記', isDone: true, dueDate: '2026-11-20' },
    { id: 2, title: '練習 MVC 三層職責分工', isDone: false, dueDate: '2026-11-24' },
  ];
}
