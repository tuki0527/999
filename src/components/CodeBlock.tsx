import React, { useEffect, useState } from 'react';
import { Check, Copy, Maximize2, X } from 'lucide-react';
import type { CSharpExampleFile, CompileStatus } from '../types/wiki';

interface CodeBlockProps {
  files: CSharpExampleFile[];
  activeFileName?: string;
  onFileChange?: (fileName: string) => void;
  highlightLines?: number[];
  compileStatus?: CompileStatus;
  title?: string;
}

const CSHARP_KEYWORDS = new Set([
  'using',
  'namespace',
  'public',
  'private',
  'protected',
  'internal',
  'class',
  'interface',
  'abstract',
  'virtual',
  'override',
  'sealed',
  'static',
  'readonly',
  'void',
  'int',
  'decimal',
  'string',
  'bool',
  'var',
  'new',
  'return',
  'if',
  'else',
  'for',
  'foreach',
  'while',
  'true',
  'false',
  'null',
  'get',
  'set',
  'throw',
]);

function highlightCSharpLine(line: string): React.ReactNode {
  if (!line) return ' ';

  const tokens: React.ReactNode[] = [];
  // Matches: comments, interpolated/normal strings, numbers, identifiers, or punctuation
  const regex = /(\/\/.*$|\$?"(?:\\.|[^"\\])*"|\b\d+(?:\.\d+)?m?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIdx) {
      tokens.push(line.slice(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith('//')) {
      tokens.push(
        <span key={key++} className="text-[#94A3B8] italic">
          {token}
        </span>
      );
    } else if (token.startsWith('"') || token.startsWith('$"')) {
      tokens.push(
        <span key={key++} className="text-[#FDE68A]">
          {token}
        </span>
      );
    } else if (/^\d/.test(token)) {
      tokens.push(
        <span key={key++} className="text-[#FCA5A5]">
          {token}
        </span>
      );
    } else if (CSHARP_KEYWORDS.has(token)) {
      tokens.push(
        <span key={key++} className="font-medium text-[#93C5FD]">
          {token}
        </span>
      );
    } else if (/^[A-Z][A-Za-z0-9_]*$/.test(token)) {
      tokens.push(
        <span key={key++} className="text-[#5EEAD4]">
          {token}
        </span>
      );
    } else {
      tokens.push(token);
    }
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < line.length) {
    tokens.push(line.slice(lastIdx));
  }

  return tokens;
}

export function CodeBlock({
  files,
  activeFileName,
  onFileChange,
  highlightLines = [],
  compileStatus = 'unverified-no-dotnet',
  title,
}: CodeBlockProps) {
  const [internalFile, setInternalFile] = useState<string>(files[0]?.fileName ?? '');
  const [copied, setCopied] = useState(false);
  const [manualCopyOpen, setManualCopyOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const selectedFileName = activeFileName ?? internalFile;
  const currentFile =
    files.find((f) => f.fileName === selectedFileName) ?? files[0];

  useEffect(() => {
    setManualCopyOpen(false);
  }, [currentFile?.id]);

  useEffect(() => {
    if (!expanded) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expanded]);

  if (!currentFile) {
    return null;
  }

  const lines = currentFile.code.split('\n');
  const highlightSet = new Set(highlightLines);

  const handleSelectFile = (name: string) => {
    if (onFileChange) {
      onFileChange(name);
    } else {
      setInternalFile(name);
    }
  };

  const handleCopy = async () => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(currentFile.code);
        setCopied(true);
        setManualCopyOpen(false);
        window.setTimeout(() => setCopied(false), 1800);
        return;
      } catch {
        // Fallback below
      }
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = currentFile.code;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (ok) {
        setCopied(true);
        setManualCopyOpen(false);
        window.setTimeout(() => setCopied(false), 1800);
        return;
      }
    } catch {
      // Fall through to manual copy box
    }

    setCopied(false);
    setManualCopyOpen((v) => !v);
  };

  const compileLabel =
    compileStatus === 'verified'
      ? '已本地編譯驗證'
      : '靜態教材範例 · 未本地編譯驗證';

  const renderCodeContent = (isModal: boolean) => (
    <div className="overflow-hidden rounded-lg border border-[#1E293B] bg-[#0F172A] text-[#F1F5F9]">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] bg-[#111827] px-4 py-2.5">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {files.length > 1 ? (
            <div className="flex items-center gap-1 rounded-md bg-[#0F172A] p-0.5" role="tablist" aria-label="C# 範例檔案切換">
              {files.map((file) => {
                const isActive = file.fileName === currentFile.fileName;
                return (
                  <button
                    key={file.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelectFile(file.fileName)}
                    className={`rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93C5FD] ${
                      isActive
                        ? 'bg-[#3458A4] text-white'
                        : 'text-[#CBD5E1] hover:text-white'
                    }`}
                  >
                    {file.fileName}
                  </button>
                );
              })}
            </div>
          ) : (
            <span className="font-mono text-sm font-medium text-[#E2E8F0]">
              {currentFile.fileName}
            </span>
          )}
          {title && <span className="text-xs text-[#94A3B8]">{title}</span>}
        </div>

        <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
          <span className="hidden sm:inline whitespace-nowrap">
            C# 12 · .NET 8 · {compileLabel}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-[32px] items-center gap-1.5 rounded border border-[#334155] bg-[#1E293B] px-2.5 py-1 text-xs font-medium text-[#E2E8F0] transition-colors hover:bg-[#334155] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93C5FD]"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[#5EEAD4]" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? '已複製' : '複製'}</span>
          </button>
          {!isModal ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              aria-label="放大檢視程式碼"
              className="inline-flex min-h-[32px] items-center gap-1.5 rounded border border-[#334155] bg-[#1E293B] px-2.5 py-1 text-xs font-medium text-[#E2E8F0] transition-colors hover:bg-[#334155] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93C5FD]"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>放大</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="關閉放大檢視"
              className="inline-flex min-h-[32px] items-center gap-1.5 rounded border border-[#334155] bg-[#1E293B] px-2.5 py-1 text-xs font-medium text-[#E2E8F0] transition-colors hover:bg-[#334155] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93C5FD]"
            >
              <X className="h-3.5 w-3.5" />
              <span>關閉</span>
            </button>
          )}
        </div>
      </div>

      {/* Scope & Environment Sub-bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] bg-[#0B1120] px-4 py-1.5 text-xs text-[#94A3B8]">
        <span>{currentFile.projectNote}</span>
        <span className="sm:hidden">C# 12 · .NET 8 · {compileLabel}</span>
      </div>

      {manualCopyOpen && (
        <div className="border-b border-[#1E293B] bg-[#1E293B] px-4 py-3 text-xs text-[#E2E8F0]">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span>系統剪貼簿權限受限，請在下方選取後按 Ctrl+C / Cmd+C 複製：</span>
            <button
              type="button"
              onClick={() => setManualCopyOpen(false)}
              className="text-[#93C5FD] hover:underline"
            >
              收合
            </button>
          </div>
          <textarea
            readOnly
            value={currentFile.code}
            onFocus={(e) => e.currentTarget.select()}
            rows={4}
            aria-label="手動複製程式碼區塊"
            className="w-full rounded border border-[#334155] bg-[#0F172A] p-2 font-mono text-xs text-[#F1F5F9]"
          />
        </div>
      )}

      {/* Code Lines */}
      <div className={`overflow-x-auto ${isModal ? 'max-h-[75vh] overflow-y-auto' : ''}`}>
        <pre className="py-3 font-mono text-[15px] leading-[1.65] sm:text-[15.5px]">
          <code>
            {lines.map((line, index) => {
              const lineNum = index + 1;
              const isHighlighted = highlightSet.has(lineNum);
              return (
                <div
                  key={lineNum}
                  className={`flex min-w-max px-4 ${
                    isHighlighted
                      ? 'bg-[#3458A4]/35 ring-1 ring-inset ring-[#60A5FA]/40'
                      : 'hover:bg-[#1E293B]/50'
                  }`}
                >
                  <span
                    className={`mr-5 inline-block w-7 select-none text-right tabular-nums ${
                      isHighlighted ? 'font-semibold text-[#93C5FD]' : 'text-[#64748B]'
                    }`}
                  >
                    {lineNum}
                  </span>
                  <span className="whitespace-pre text-[#E2E8F0]">
                    {highlightCSharpLine(line)}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );

  return (
    <div className="min-w-0">
      {renderCodeContent(false)}
      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={`${currentFile.fileName} 放大檢視`}
          onClick={() => setExpanded(false)}
        >
          <div
            className="w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {renderCodeContent(true)}
          </div>
        </div>
      )}
    </div>
  );
}
