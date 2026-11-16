export interface BookRecord {
  id: string;
  title: string;
  author: string;
  category: string;
}

export const BOOK_CATALOG: BookRecord[] = [
  { id: 'B01', title: '深入淺出 C# 物件導向', author: '林子軒', category: '程式語言' },
  { id: 'B02', title: 'ASP.NET Core MVC 實戰手冊', author: '陳怡君', category: '網頁架構' },
  { id: 'B03', title: '低耦合軟體設計與重構', author: '張書豪', category: '軟體工程' },
];

export interface MvcTraceStep {
  stepIndex: number;
  stageName: string;
  activeLayer: 'Request' | 'Controller' | 'Model' | 'View';
  csharpFile: 'BooksController.cs' | 'BookCatalogModel.cs' | 'Index.cshtml';
  highlightLines: number[];
  summary: string;
  detail: string;
}

export function searchBooksModel(keyword: string): BookRecord[] {
  const term = keyword.trim().toLowerCase();
  if (!term) return BOOK_CATALOG;
  return BOOK_CATALOG.filter(
    (b) =>
      b.title.toLowerCase().includes(term) ||
      b.category.toLowerCase().includes(term)
  );
}

export function buildMvcRequestTrace(keyword: string): {
  results: BookRecord[];
  steps: MvcTraceStep[];
} {
  const trimmed = keyword.trim();
  const results = searchBooksModel(trimmed);
  const queryUrl = trimmed
    ? `/Books/Index?keyword=${encodeURIComponent(trimmed)}`
    : '/Books/Index';

  const steps: MvcTraceStep[] = [
    {
      stepIndex: 0,
      stageName: '1. 瀏覽器送出 HTTP GET 請求與路由比對',
      activeLayer: 'Request',
      csharpFile: 'BooksController.cs',
      highlightLines: [11, 12],
      summary: `Routing 解析網址 ${queryUrl}，對應至 BooksController.Index(keyword)。`,
      detail:
        'ASP.NET Core 路由與 Model Binding 自動把查詢字串中的 keyword 綁定為 Action 方法的參數，Controller 不需要手動解析原始 HTTP 字串。',
    },
    {
      stepIndex: 1,
      stageName: '2. Controller 協調請求並呼叫 Model',
      activeLayer: 'Controller',
      csharpFile: 'BooksController.cs',
      highlightLines: [14, 15, 16],
      summary: `BooksController 呼叫 _catalog.Search("${trimmed || ''}") 委派查詢。`,
      detail:
        'Controller 扮演交通指揮角色：它不自己寫 LINQ 篩選書單的商業規則，而是將查詢工作交給 Model（BookCatalogModel），保持 Controller 精簡。',
    },
    {
      stepIndex: 2,
      stageName: '3. Model 執行查詢規則並回傳資料',
      activeLayer: 'Model',
      csharpFile: 'BookCatalogModel.cs',
      highlightLines: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
      summary: `BookCatalogModel 依規則篩選，找到 ${results.length} 筆符合結果。`,
      detail:
        'Model 封裝館藏資料與比對邏輯（不區分大小寫比對書名或分類），且完全不知道 Controller 或 HTML View 的存在，因此可獨立單元測試。',
    },
    {
      stepIndex: 3,
      stageName: '4. Controller 選擇 View 並注入結果渲染 HTML',
      activeLayer: 'View',
      csharpFile: 'Index.cshtml',
      highlightLines: results.length === 0 ? [12, 13, 14, 15] : [16, 17, 18, 19, 20, 21, 22, 23, 24],
      summary:
        results.length === 0
          ? 'View 收到空清單，渲染「找不到符合館藏」提示畫面。'
          : `View 收到 ${results.length} 筆 BookItem，透過 Razor @foreach 產生清單 HTML。`,
      detail:
        'Views/Books/Index.cshtml 只負責把 Model 資料排版成網頁，不包含資料篩選或業務規則；之後若改版面樣式，Model 完全不需要變動。',
    },
  ];

  return { results, steps };
}
