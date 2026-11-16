import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SourceEntry } from '../types/wiki';

interface SourceCitationListProps {
  sources: SourceEntry[];
}

const STATUS_TEXT: Record<SourceEntry['status'], string> = {
  pending: '待讀取（pending）',
  unavailable: '環境受阻無法讀取（unavailable）',
  ingested: '已完成讀取與知識整合（ingested）',
  'needs-review': '待重新複核（needs-review）',
};

export function SourceCitationList({ sources }: SourceCitationListProps) {
  if (sources.length === 0) {
    return (
      <p className="text-sm text-[#4B5563]">
        本單元尚未綁定參考來源，請於 <code className="font-mono">sources/registry.json</code> 補齊。
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {sources.map((src) => (
        <div
          key={src.id}
          className="rounded-lg border border-[#E5E7EB] bg-white p-4"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-base font-semibold text-[#1F2937]">{src.title}</h4>
            <span className="font-mono text-xs text-[#4B5563]">{src.id}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#4B5563]">
            <span>{src.authorOrOrg}</span>
            <span aria-hidden="true">·</span>
            <span>{STATUS_TEXT[src.status]}</span>
            <span aria-hidden="true">·</span>
            <span>讀取日期：{src.readDate ?? '尚未讀取（null）'}</span>
          </div>
          <p className="mt-2 text-sm text-[#374151]">{src.notes}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs">
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-[#3458A4] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
            >
              <span>檢視外部官方文件</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Link
              to="/process"
              className="font-medium text-[#247C74] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#247C74]"
            >
              前往來源登錄總表
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
