import React from 'react';

interface MarkdownRendererProps {
  content: string;
  compact?: boolean;
}

function renderInline(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      tokens.push(
        <code
          key={`code-${keyCounter++}`}
          className="rounded bg-[#E5E7EB]/70 px-1.5 py-0.5 text-[0.9em] font-medium text-[#1F2937]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      tokens.push(
        <strong key={`bold-${keyCounter++}`} className="font-semibold text-[#111827]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const isExternal = href.startsWith('http');
        tokens.push(
          <a
            key={`link-${keyCounter++}`}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-[#3458A4] underline decoration-[#3458A4]/40 underline-offset-4 hover:decoration-[#3458A4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
          >
            {label}
          </a>
        );
      } else {
        tokens.push(token);
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens;
}

export function MarkdownRenderer({ content, compact = false }: MarkdownRendererProps) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <div
          key={`pre-${blockKey++}`}
          className="my-4 overflow-hidden rounded-lg border border-[#1E293B] bg-[#0F172A] text-[#E2E8F0]"
        >
          {lang && (
            <div className="border-b border-[#1E293B] bg-[#111827] px-4 py-1.5 text-xs text-[#94A3B8]">
              {lang === 'text' ? '輸出結果' : lang}
            </div>
          )}
          <pre className="overflow-x-auto p-4 text-[15px] leading-relaxed">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      continue;
    }

    // Markdown table
    if (line.trim().startsWith('|') && i + 1 < lines.length && lines[i + 1].includes('---')) {
      const headerCells = line
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());
      i += 2; // skip header and separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const rowCells = lines[i]
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        rows.push(rowCells);
        i++;
      }
      blocks.push(
        <div key={`tbl-${blockKey++}`} className="my-5 overflow-x-auto rounded-lg border border-[#E5E7EB] bg-white">
          <table className="w-full border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                {headerCells.map((cell, idx) => (
                  <th key={idx} className="px-4 py-3 font-semibold text-[#1F2937]">
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#F9FAFB]">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 text-[#374151]">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      blocks.push(
        <h3
          key={`h3-${blockKey++}`}
          className="mt-6 mb-2 text-lg font-semibold text-[#111827]"
        >
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push(
        <h2
          key={`h2-${blockKey++}`}
          className="mt-7 mb-3 border-b border-[#E5E7EB] pb-2 text-xl font-semibold text-[#111827]"
        >
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={`h1-${blockKey++}`} className="mt-2 mb-4 text-2xl font-bold text-[#111827]">
          {renderInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    // Blockquote (subtle hairline box without thick left bar)
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <blockquote
          key={`quote-${blockKey++}`}
          className="my-4 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-[16px] leading-relaxed text-[#374151]"
        >
          {renderInline(quoteLines.join(' '))}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        let itemText = lines[i].replace(/^\s*[-*]\s+/, '');
        i++;
        while (
          i < lines.length &&
          lines[i].trim() !== '' &&
          !/^\s*[-*]\s+/.test(lines[i]) &&
          !/^\d+\.\s+/.test(lines[i]) &&
          !lines[i].startsWith('#') &&
          !lines[i].trim().startsWith('```')
        ) {
          itemText += ' ' + lines[i].trim();
          i++;
        }
        items.push(itemText);
      }
      blocks.push(
        <ul
          key={`ul-${blockKey++}`}
          className={`my-3 list-disc space-y-2 pl-6 ${compact ? 'text-[16px] leading-7' : 'prose-reading'}`}
        >
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        let itemText = lines[i].replace(/^\d+\.\s+/, '');
        i++;
        while (
          i < lines.length &&
          lines[i].trim() !== '' &&
          !/^\d+\.\s+/.test(lines[i]) &&
          !/^\s*[-*]\s+/.test(lines[i]) &&
          !lines[i].startsWith('#')
        ) {
          itemText += ' ' + lines[i].trim();
          i++;
        }
        items.push(itemText);
      }
      blocks.push(
        <ol
          key={`ol-${blockKey++}`}
          className={`my-3 list-decimal space-y-2 pl-6 ${compact ? 'text-[16px] leading-7' : 'prose-reading'}`}
        >
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Horizontal rule
    if (line.trim() === '---') {
      blocks.push(<hr key={`hr-${blockKey++}`} className="my-6 border-[#E5E7EB]" />);
      i++;
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('> ') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('|') &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      lines[i].trim() !== '---'
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    blocks.push(
      <p
        key={`p-${blockKey++}`}
        className={`my-3 ${compact ? 'text-[16px] leading-7 text-[#374151]' : 'prose-reading'}`}
      >
        {renderInline(paraLines.join(' '))}
      </p>
    );
  }

  return <div className="min-w-0">{blocks}</div>;
}
