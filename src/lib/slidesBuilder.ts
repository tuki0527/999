import type {
  CompileStatus,
  ConceptDocument,
  CSharpExampleFile,
  SourceRegistryFile,
} from '../types/wiki';

export interface SlideCodeSnippet {
  exampleId: string;
  fileName: string;
  startLine: number;
  endLine: number;
  code: string;
  projectNote: string;
  compileStatus: CompileStatus;
}

export interface SlidePageData {
  id: string;
  pageNumber: number;
  groupLabel: string;
  title: string;
  subtitle: string;
  kind: 'cover' | 'roadmap' | 'concept' | 'code' | 'synthesis' | 'sources' | 'closing';
  chapterId?: string;
  chapterSlug?: string;
  chapterOrder?: number;
  summaryText?: string;
  sourceIds?: string[];
  exampleIds?: string[];
  bullets: string[];
  calloutTitle?: string;
  calloutBody?: string;
  snippet?: SlideCodeSnippet;
  tableRows?: { col1: string; col2: string; col3: string }[];
}

function cleanBullet(line: string): string {
  return line
    .trim()
    .replace(/^-\s+/, '')
    .replace(/^\d+\.\s+/, '')
    .replace(/\*\*/g, '')
    .replace(/`([^`]+)`/g, '$1');
}

function extractBullets(body: string, limit = 4): string[] {
  return body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- ') || /^\d+\.\s+/.test(l))
    .map(cleanBullet)
    .filter(Boolean)
    .slice(0, limit);
}

function extractFirstParagraph(body: string): string {
  const blocks = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b && !b.startsWith('#') && !b.startsWith('-') && !b.startsWith('```'));
  return cleanBullet(blocks[0] ?? '');
}

function parseLineRange(rangeStr?: string): [number, number] | null {
  if (!rangeStr) return null;
  const m = rangeStr.match(/^(\d+)\s*-\s*(\d+)$/);
  if (!m) return null;
  const start = Number.parseInt(m[1], 10);
  const end = Number.parseInt(m[2], 10);
  if (Number.isNaN(start) || Number.isNaN(end) || start < 1 || end < start) return null;
  return [start, end];
}

function buildSnippet(
  concept: ConceptDocument,
  examples: CSharpExampleFile[]
): SlideCodeSnippet | undefined {
  const targetId = concept.metadata.slideExampleId ?? concept.metadata.exampleIds[0];
  if (!targetId) return undefined;
  const file = examples.find((e) => e.id === targetId) ?? examples[0];
  if (!file) return undefined;

  const allLines = file.code.split('\n');
  const range = parseLineRange(concept.metadata.slideLineRange);
  const startLine = range ? Math.min(range[0], allLines.length) : 1;
  const endLine = range ? Math.min(range[1], allLines.length) : Math.min(22, allLines.length);

  return {
    exampleId: file.id,
    fileName: file.fileName,
    startLine,
    endLine,
    code: allLines.slice(startLine - 1, endLine).join('\n'),
    projectNote: file.projectNote,
    compileStatus: concept.metadata.compileStatus,
  };
}

export function buildDeckSlides(
  concepts: ConceptDocument[],
  examplesByConceptId: (concept: ConceptDocument) => CSharpExampleFile[],
  registry: SourceRegistryFile
): SlidePageData[] {
  const ordered = [...concepts].sort((a, b) => a.metadata.order - b.metadata.order);
  const slides: SlidePageData[] = [];

  // 1. Cover & Prerequisites
  slides.push({
    id: 'cover',
    pageNumber: 1,
    groupLabel: '導論｜讀者前提與定位',
    title: '程式觀念實驗室：從物件導向到 MVC 與低耦合設計',
    subtitle: '以 C# 範例為載體，建立跨語言通用的模組化與架構設計思維',
    kind: 'cover',
    bullets: [
      '讀者前提：已熟悉變數、型別、條件判斷（if/else）、迴圈與函式（method）。',
      '解決痛點：克服「程式碼全寫在單一檔案、改一處壞三處」的維護困境。',
      '技術邊界：教材範例採 C# 12（.NET 8）；互動實驗為 TypeScript 前端概念模擬。',
      '單一資料來源：本簡報內容直接抽取自 wiki/concepts/*.md 與 examples/csharp/。',
    ],
    calloutTitle: '本階段資料誠實原則',
    calloutBody:
      '所有觀念均附來源登錄紀錄；因本建置環境未安裝 .NET SDK，C# 範例維持標示 unverified-no-dotnet。',
  });

  // 2. Chapter Roadmap
  slides.push({
    id: 'roadmap',
    pageNumber: 2,
    groupLabel: `導論｜${ordered.length} 章學習地圖`,
    title: `從單一類別到系統組裝：${ordered.length} 章完整學習路線`,
    subtitle: '每一章皆聚焦一個明確的生活／系統情境，逐層推演設計原因',
    kind: 'roadmap',
    bullets: [],
    tableRows: ordered.map((c) => ({
      col1: `${String(c.metadata.order).padStart(2, '0')} · ${c.metadata.title}`,
      col2: c.metadata.subtitle.split('：')[0] ?? c.metadata.subtitle,
      col3: c.metadata.summary,
    })),
  });

  // 3–18. Two focused slides per chapter (Concept + Code Highlight)
  for (const concept of ordered) {
    const { metadata, sections } = concept;
    const orderStr = String(metadata.order).padStart(2, '0');
    const problemSec = sections.find((s) => s.title === '問題情境');
    const goalSec = sections.find((s) => s.title === '學習目標');
    const diffSec = sections.find((s) => s.title === '修改需求的比較');
    const expectedSec = sections.find((s) => s.title === '預期結果');

    const goalBullets = goalSec ? extractBullets(goalSec.body, 3) : [];
    const problemIntro = problemSec ? extractFirstParagraph(problemSec.body) : metadata.summary;

    // Slide A: Concept & Problem
    slides.push({
      id: `${metadata.id}-concept`,
      pageNumber: slides.length + 1,
      groupLabel: `第 ${orderStr} 章｜觀念與問題`,
      title: `${orderStr}. ${metadata.title}：為什麼需要這個設計？`,
      subtitle: metadata.subtitle,
      kind: 'concept',
      chapterId: metadata.id,
      chapterSlug: metadata.slug,
      chapterOrder: metadata.order,
      summaryText: metadata.summary,
      sourceIds: metadata.sourceIds,
      exampleIds: metadata.exampleIds,
      calloutTitle: '核心問題情境',
      calloutBody: problemIntro,
      bullets: goalBullets.length > 0 ? goalBullets : [metadata.summary],
    });

    // Slide B: C# Code Snippet + Change Comparison
    const diffBullets = diffSec ? extractBullets(diffSec.body, 2) : [];
    const expectedIntro = expectedSec ? extractFirstParagraph(expectedSec.body) : '';
    const snippet = buildSnippet(concept, examplesByConceptId(concept));

    slides.push({
      id: `${metadata.id}-code`,
      pageNumber: slides.length + 1,
      groupLabel: `第 ${orderStr} 章｜C# 範例片段與比較`,
      title: `${orderStr}. ${metadata.title}：核心 C# 結構與變更影響`,
      subtitle: metadata.summary,
      kind: 'code',
      chapterId: metadata.id,
      chapterSlug: metadata.slug,
      chapterOrder: metadata.order,
      summaryText: metadata.summary,
      sourceIds: metadata.sourceIds,
      exampleIds: metadata.exampleIds,
      snippet,
      bullets: diffBullets.length > 0 ? diffBullets : [expectedIntro].filter(Boolean),
      calloutTitle: '完整程式與互動模擬',
      calloutBody: `完整檔案清單：${metadata.exampleIds.join('、')}。需要執行全部步驟高亮與測驗檢查，請回到完整教材頁。`,
    });
  }

  // 19. Architecture Synthesis (OOP vs Low Coupling vs MVC vs Rendering)
  slides.push({
    id: 'architecture-synthesis',
    pageNumber: slides.length + 1,
    groupLabel: '總結｜跨章維度對照',
    title: '一次釐清：OOP、低耦合、MVC 與網頁渲染維度',
    subtitle: '不同層級的設計工具各司其職，避免混為一談',
    kind: 'synthesis',
    bullets: [
      'OOP（第 01–05 章）：以類別、封裝、組合、多型與介面組織個別物件與能力契約。',
      '低耦合與 DI（第 06、09 章）：以依賴反轉原則（DIP）面向介面，再用建構式注入（DI）由外部組裝實例。',
      'MVC（第 07 章）：將應用切為 Model（規則狀態）、Controller（協調）、View（呈現）；Model 不依賴 View/Controller。',
      '渲染維度（SSR / SPA）：處理 HTML 在伺服器或瀏覽器生成；第 07 章進階歷史對照因 Medium 403 標記待驗證。',
    ],
    calloutTitle: '延伸整合實戰（第 08–09 章）',
    calloutBody:
      '重構待辦系統後，即可進一步以第 09 章「建構式注入」把服務所需紀錄器或儲存介面交由組裝端傳入。',
  });

  // 20. Sources & Verification Registry Snapshot
  const ingestedTopic = registry.sources.filter(
    (s) => s.status === 'ingested' && s.category !== 'methodology'
  );
  const ingestedMethod = registry.sources.filter(
    (s) => s.status === 'ingested' && s.category === 'methodology'
  );
  const unavailable = registry.sources.filter((s) => s.status === 'unavailable');
  const pending = registry.sources.filter((s) => s.status === 'pending');

  slides.push({
    id: 'sources-status',
    pageNumber: slides.length + 1,
    groupLabel: '總結｜來源與驗證透明紀錄',
    title: '知識來源 Ingest 與環境驗證實況',
    subtitle: `依據 sources/registry.json（Schema v${registry.schemaVersion} · 更新 ${registry.lastUpdated}）`,
    kind: 'sources',
    bullets: [
      `已實讀整合（ingested）主題／補充來源共 ${ingestedTopic.length} 篇：${ingestedTopic.map((s) => s.id).join('、')}。`,
      `方法論參考（另計，不列入主題數）共 ${ingestedMethod.length} 篇：${ingestedMethod.map((s) => s.id).join('、')}。`,
      `存取受阻（unavailable，readDate: null）共 ${unavailable.length} 篇：${unavailable.map((s) => s.id).join('、')}（Medium HTTP 403）。`,
      `待讀取（pending）共 ${pending.length} 篇：${pending.map((s) => s.id).join('、')}；C# 編譯狀態為 unverified-no-dotnet。`,
    ],
    calloutTitle: '嚴格誠實原則',
    calloutBody:
      '凡未取得正文之網址一律保持 readDate: null，不以搜尋摘要充數；無 .NET SDK 環境亦明確揭露未本地編譯。',
  });

  // 21. Closing & Next Extension
  const totalCount = slides.length + 1;
  slides.push({
    id: 'closing-next',
    pageNumber: totalCount,
    groupLabel: '結語｜互動實驗與擴充實證',
    title: '前往知識庫操作模擬，並檢視製作流程與擴充驗證紀錄',
    subtitle: '教材、簡報、Workflow 與驗證紀錄共同構成可持續維護的 LLM Wiki',
    kind: 'closing',
    bullets: [
      `互動概念模擬：第 01–${String(ordered.length).padStart(2, '0')} 章皆配有雙欄程式碼高亮模擬器與 2 題可展開檢核解析。`,
      '工作流程追蹤：前往「資料來源與製作流程」查看 A–F 六階段迴圈圖與驗證反思。',
      '擴充實證完成：已依 AGENTS.md 新增第 09 章「依賴注入入門」並自動匯入知識庫、搜尋與本簡報。',
      `列印與離線保存：點擊上方「列印 / 另存 PDF」可展開全部 ${totalCount} 頁自動分頁排版輸出。`,
    ],
  });

  return slides;
}
