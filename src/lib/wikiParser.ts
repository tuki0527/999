import type {
  CompileStatus,
  ConceptDocument,
  ConceptMetadata,
  ConceptSection,
  ConceptStatus,
} from '../types/wiki';

function stripInlineComment(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1);
  }
  const commentIndex = trimmed.indexOf(' #');
  return (commentIndex >= 0 ? trimmed.slice(0, commentIndex) : trimmed).trim();
}

export function parseFrontmatter(raw: string): {
  data: Record<string, string | string[]>;
  body: string;
} {
  const normalized = raw.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return { data: {}, body: normalized };
  }

  const endMarker = normalized.indexOf('\n---\n', 4);
  if (endMarker === -1) {
    return { data: {}, body: normalized };
  }

  const yamlBlock = normalized.slice(4, endMarker);
  const body = normalized.slice(endMarker + 5).trim();
  const data: Record<string, string | string[]> = {};

  let currentArrayKey: string | null = null;

  for (const rawLine of yamlBlock.split('\n')) {
    const line = rawLine.trimEnd();
    if (!line.trim() || line.trim().startsWith('#')) {
      continue;
    }

    if (currentArrayKey && /^\s*-\s+/.test(line)) {
      const itemValue = stripInlineComment(line.replace(/^\s*-\s+/, ''));
      const existing = data[currentArrayKey];
      if (Array.isArray(existing)) {
        existing.push(itemValue);
      }
      continue;
    }

    currentArrayKey = null;
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) {
      continue;
    }

    const key = line.slice(0, colonIdx).trim();
    const rawValue = line.slice(colonIdx + 1).trim();

    if (rawValue === '' || rawValue.startsWith('#')) {
      data[key] = [];
      currentArrayKey = key;
    } else if (rawValue === '[]') {
      data[key] = [];
    } else {
      data[key] = stripInlineComment(rawValue);
    }
  }

  return { data, body };
}

export function parseConceptSections(body: string): ConceptSection[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const sections: ConceptSection[] = [];
  let currentTitle: string | null = null;
  let buffer: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentTitle !== null) {
        sections.push({
          title: currentTitle,
          body: buffer.join('\n').trim(),
        });
      }
      currentTitle = line.slice(3).trim();
      buffer = [];
    } else if (currentTitle !== null) {
      buffer.push(line);
    }
  }

  if (currentTitle !== null) {
    sections.push({
      title: currentTitle,
      body: buffer.join('\n').trim(),
    });
  }

  return sections;
}

function asString(val: string | string[] | undefined, fallback = ''): string {
  if (Array.isArray(val)) return val[0] ?? fallback;
  return val ?? fallback;
}

function asStringArray(val: string | string[] | undefined): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.length > 0) return [val];
  return [];
}

export function parseConceptDocument(raw: string, fallbackId: string): ConceptDocument {
  const { data, body } = parseFrontmatter(raw);
  const statusVal = asString(data.status, 'draft');
  const status: ConceptStatus =
    statusVal === 'verified' || statusVal === 'planned' ? statusVal : 'draft';

  const compileVal = asString(data.compileStatus, 'unverified-no-dotnet');
  const compileStatus: CompileStatus =
    compileVal === 'verified' ? 'verified' : 'unverified-no-dotnet';

  const demoRaw = asString(data.demoId, '');

  const metadata: ConceptMetadata = {
    id: asString(data.id, fallbackId),
    slug: asString(data.slug, fallbackId),
    order: Number.parseInt(asString(data.order, '99'), 10) || 99,
    title: asString(data.title, fallbackId),
    subtitle: asString(data.subtitle, ''),
    summary: asString(data.summary, ''),
    status,
    compileStatus,
    prerequisites: asStringArray(data.prerequisites),
    tags: asStringArray(data.tags),
    sourceIds: asStringArray(data.sourceIds),
    exampleIds: asStringArray(data.exampleIds),
    slideExampleId: asString(data.slideExampleId, '') || undefined,
    slideLineRange: asString(data.slideLineRange, '') || undefined,
    demoId: demoRaw && demoRaw !== 'null' ? demoRaw : null,
    relatedIds: asStringArray(data.relatedIds),
  };

  return {
    metadata,
    rawMarkdown: body,
    sections: parseConceptSections(body),
  };
}
