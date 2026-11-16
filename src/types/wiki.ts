export type ConceptStatus = 'draft' | 'verified' | 'planned';

export type CompileStatus = 'verified' | 'unverified-no-dotnet';

export interface ConceptMetadata {
  id: string;
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  summary: string;
  status: ConceptStatus;
  compileStatus: CompileStatus;
  prerequisites: string[];
  tags: string[];
  sourceIds: string[];
  exampleIds: string[];
  slideExampleId?: string;
  slideLineRange?: string;
  demoId: string | null;
  relatedIds: string[];
}

export interface ConceptSection {
  title: string;
  body: string;
}

export interface ConceptDocument {
  metadata: ConceptMetadata;
  rawMarkdown: string;
  sections: ConceptSection[];
}

export type SourceStatus = 'pending' | 'unavailable' | 'ingested' | 'needs-review';

export interface SourceEntry {
  id: string;
  title: string;
  authorOrOrg: string;
  url: string;
  category?: 'domain' | 'supplement' | 'methodology';
  topics: string[];
  readDate: string | null;
  readMethod: string;
  status: SourceStatus;
  notes: string;
}

export interface SourceRegistryFile {
  schemaVersion: string;
  lastUpdated: string;
  sources: SourceEntry[];
}

export interface SourceNoteDoc {
  fileName: string;
  sourceId: string;
  title: string;
  status: string;
  body: string;
}

export type CodeScopeKind = 'standalone' | 'project-file' | 'concept-snippet';

export interface CSharpExampleFile {
  id: string;
  fileName: string;
  chapterId: string;
  code: string;
  scopeKind: CodeScopeKind;
  projectNote: string;
}

export interface DocDocument {
  id: string;
  title: string;
  fileName: string;
  content: string;
}

export interface UserProgress {
  favorites: string[];
  completedIds: string[];
  storageAvailable: boolean;
}

export interface DemoComponentProps {
  examples: CSharpExampleFile[];
}
