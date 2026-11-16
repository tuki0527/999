import type {
  CSharpExampleFile,
  ConceptDocument,
  DocDocument,
  SourceEntry,
  SourceNoteDoc,
  SourceRegistryFile,
} from '../types/wiki';
import { parseConceptDocument, parseFrontmatter } from './wikiParser';

const conceptRawMap = import.meta.glob('../../wiki/concepts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const sourceNotesRawMap = import.meta.glob('../../wiki/sources/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const registryRawMap = import.meta.glob('../../sources/registry.json', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const csharpRawMap = import.meta.glob('../../examples/csharp/**/*.{cs,cshtml}', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const wikiIndexRawMap = import.meta.glob('../../wiki/index.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const wikiLogRawMap = import.meta.glob('../../wiki/log.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const agentsRawMap = import.meta.glob('../../AGENTS.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const docsRawMap = import.meta.glob('../../docs/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function fileNameFromPath(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1] ?? path;
}

const concepts: ConceptDocument[] = Object.entries(conceptRawMap)
  .map(([path, raw]) => {
    const fileName = fileNameFromPath(path).replace(/\.md$/, '');
    return parseConceptDocument(raw, fileName);
  })
  .sort((a, b) => a.metadata.order - b.metadata.order);

const conceptsBySlug = new Map<string, ConceptDocument>();
const conceptsById = new Map<string, ConceptDocument>();
for (const doc of concepts) {
  conceptsBySlug.set(doc.metadata.slug, doc);
  conceptsById.set(doc.metadata.id, doc);
}

function resolveExampleScope(
  id: string,
  fileName: string,
  chapterId: string
): {
  scopeKind: CSharpExampleFile['scopeKind'];
  projectNote: string;
} {
  if (
    fileName.startsWith('Tight') ||
    fileName.endsWith('Before.cs') ||
    id.includes('TightCoupledOrder') ||
    id.includes('MixedTodoBefore')
  ) {
    return {
      scopeKind: 'concept-snippet',
      projectNote: '概念片段｜對照反例（不單獨執行）',
    };
  }
  if (chapterId === '07-mvc-architecture') {
    return {
      scopeKind: 'project-file',
      projectNote: '需放在指定專案｜ASP.NET Core MVC Web App（.NET 8，不可混入 Console）',
    };
  }
  if (fileName === 'Program.cs') {
    return {
      scopeKind: 'standalone',
      projectNote: `可獨立執行｜.NET 8 Console 最小專案（${chapterId}）`,
    };
  }
  return {
    scopeKind: 'project-file',
    projectNote: `需放在指定專案｜.NET 8 Console 專案（${chapterId}）`,
  };
}

const examplesList: CSharpExampleFile[] = Object.entries(csharpRawMap)
  .map(([path, code]) => {
    const marker = '/examples/csharp/';
    const idx = path.indexOf(marker);
    const id = idx >= 0 ? path.slice(idx + marker.length) : fileNameFromPath(path);
    const parts = id.split('/');
    const chapterId = parts.length > 1 ? parts[0] : '';
    const fileName = parts[parts.length - 1] ?? id;
    const { scopeKind, projectNote } = resolveExampleScope(id, fileName, chapterId);
    return {
      id,
      fileName,
      chapterId,
      code: code.replace(/\r\n/g, '\n').trimEnd(),
      scopeKind,
      projectNote,
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

const examplesById = new Map<string, CSharpExampleFile>();
for (const example of examplesList) {
  examplesById.set(example.id, example);
}

let parsedRegistry: SourceRegistryFile = {
  schemaVersion: '1.0.0',
  lastUpdated: '',
  sources: [],
};

const registryRaw = Object.values(registryRawMap)[0];
if (registryRaw) {
  try {
    parsedRegistry = JSON.parse(registryRaw) as SourceRegistryFile;
  } catch {
    parsedRegistry = { schemaVersion: '1.0.0', lastUpdated: '', sources: [] };
  }
}

const sourcesById = new Map<string, SourceEntry>();
for (const src of parsedRegistry.sources) {
  sourcesById.set(src.id, src);
}

const sourceNotes: SourceNoteDoc[] = Object.entries(sourceNotesRawMap)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw);
    const fileName = fileNameFromPath(path);
    const sourceId = Array.isArray(data.sourceId) ? (data.sourceId[0] ?? '') : (data.sourceId ?? '');
    const title = Array.isArray(data.title) ? (data.title[0] ?? fileName) : (data.title ?? fileName);
    const status = Array.isArray(data.status) ? (data.status[0] ?? 'registered') : (data.status ?? 'registered');
    return {
      fileName,
      sourceId,
      title,
      status,
      body,
    };
  })
  .sort((a, b) => a.fileName.localeCompare(b.fileName));

const DOC_TITLE_MAP: Record<string, string> = {
  'AGENTS.md': 'AGENTS.md 開發與維護規範',
  'requirements.md': '需求規格與選題說明',
  'workflow.md': '知識處理與開發流程',
  'process-log.md': '製作與討論歷程',
  'verification.md': '驗證項目與執行紀錄',
  'reflection.md': '執行反思與限制紀錄',
  'submission-guide.md': '期末繳交 PDF 資料清單',
  'index.md': 'Wiki 主題索引（wiki/index.md）',
  'log.md': 'Wiki 異動日誌（wiki/log.md）',
};

const DOC_ORDER = [
  'AGENTS.md',
  'requirements.md',
  'workflow.md',
  'process-log.md',
  'verification.md',
  'reflection.md',
  'submission-guide.md',
  'index.md',
  'log.md',
];

const projectDocs: DocDocument[] = [
  ...Object.entries(agentsRawMap).map(([path, content]) => {
    const fileName = fileNameFromPath(path);
    return {
      id: 'agents',
      title: DOC_TITLE_MAP[fileName] ?? fileName,
      fileName,
      content,
    };
  }),
  ...Object.entries(docsRawMap).map(([path, content]) => {
    const fileName = fileNameFromPath(path);
    return {
      id: fileName.replace(/\.md$/, ''),
      title: DOC_TITLE_MAP[fileName] ?? fileName,
      fileName,
      content,
    };
  }),
  ...Object.entries(wikiIndexRawMap).map(([, content]) => ({
    id: 'wiki-index',
    title: DOC_TITLE_MAP['index.md'],
    fileName: 'wiki/index.md',
    content,
  })),
  ...Object.entries(wikiLogRawMap).map(([, content]) => ({
    id: 'wiki-log',
    title: DOC_TITLE_MAP['log.md'],
    fileName: 'wiki/log.md',
    content,
  })),
].sort((a, b) => {
  const aKey = a.fileName.split('/').pop() ?? a.fileName;
  const bKey = b.fileName.split('/').pop() ?? b.fileName;
  const aIdx = DOC_ORDER.indexOf(aKey);
  const bIdx = DOC_ORDER.indexOf(bKey);
  return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
});

export function getAllConcepts(): ConceptDocument[] {
  return concepts;
}

export function getConceptBySlug(slug: string): ConceptDocument | undefined {
  return conceptsBySlug.get(slug);
}

export function getConceptById(id: string): ConceptDocument | undefined {
  return conceptsById.get(id);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const concept of concepts) {
    for (const tag of concept.metadata.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet);
}

export function getExamplesForConcept(concept: ConceptDocument): CSharpExampleFile[] {
  return concept.metadata.exampleIds
    .map((id) => examplesById.get(id))
    .filter((item): item is CSharpExampleFile => Boolean(item));
}

export function getSourceRegistry(): SourceRegistryFile {
  return parsedRegistry;
}

export function getSourcesForConcept(concept: ConceptDocument): SourceEntry[] {
  return concept.metadata.sourceIds
    .map((id) => sourcesById.get(id))
    .filter((item): item is SourceEntry => Boolean(item));
}

export function getAllSourceNotes(): SourceNoteDoc[] {
  return sourceNotes;
}

export function getAllProjectDocs(): DocDocument[] {
  return projectDocs;
}
