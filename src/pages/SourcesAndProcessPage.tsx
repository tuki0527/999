import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { WorkflowGraph } from '../components/WorkflowGraph';
import {
  getAllProjectDocs,
  getAllSourceNotes,
  getSourceRegistry,
} from '../lib/contentLoader';

export function SourcesAndProcessPage() {
  const [activeTab, setActiveTab] = useState<'sources' | 'workflow' | 'docs'>('sources');
  const registry = getSourceRegistry();
  const sourceNotes = getAllSourceNotes();
  const docs = getAllProjectDocs();
  const [selectedDocId, setSelectedDocId] = useState(docs[0]?.id ?? 'agents');

  const activeDoc = docs.find((d) => d.id === selectedDocId) ?? docs[0];

  const ingestedTopicCount = registry.sources.filter(
    (s) => s.status === 'ingested' && s.category !== 'methodology'
  ).length;
  const ingestedMethodCount = registry.sources.filter(
    (s) => s.status === 'ingested' && s.category === 'methodology'
  ).length;
  const unavailableCount = registry.sources.filter((s) => s.status === 'unavailable').length;
  const pendingCount = registry.sources.filter((s) => s.status === 'pending').length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <div className="text-xs font-semibold text-[#3458A4]">
          開發治理 · 來源登錄 · Workflow 紀錄中心
        </div>
        <h1 className="mt-2 text-2xl font-bold text-[#111827] sm:text-3xl">
          資料來源與製作流程
        </h1>
        <p className="mt-2 max-w-[72ch] text-sm leading-relaxed text-[#4B5563]">
          為保持教材頁面單純聚焦於學習，本區集中管理外部資料來源登錄表、來源筆記、開發規範（AGENTS.md）、Workflow 流程與驗證反思紀錄。
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[#E5E7EB] pt-3 text-xs text-[#4B5563] tabular-nums">
          <span className="font-semibold text-[#1F6E58]">
            主題／補充來源已整合（ingested）：{ingestedTopicCount} 篇
          </span>
          <span aria-hidden="true">·</span>
          <span>方法論參考已整合：{ingestedMethodCount} 篇</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#B91C1C]">存取受阻（unavailable）：{unavailableCount} 篇</span>
          <span aria-hidden="true">·</span>
          <span>待讀取（pending）：{pendingCount} 篇</span>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex flex-wrap gap-1.5 rounded-lg bg-[#F1F5F9] p-1" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'sources'}
            onClick={() => setActiveTab('sources')}
            className={`min-h-[38px] rounded-md px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'sources'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            資料來源登錄（{registry.sources.length}）
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'workflow'}
            onClick={() => setActiveTab('workflow')}
            className={`min-h-[38px] rounded-md px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'workflow'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            Workflow 與迴圈圖
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'docs'}
            onClick={() => setActiveTab('docs')}
            className={`min-h-[38px] rounded-md px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'docs'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            規範與執行紀錄文件（{docs.length}）
          </button>
        </div>
      </section>

      {/* Tab 1: Sources Registry & Notes */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#E5E7EB] pb-3">
              <h2 className="text-lg font-bold text-[#111827]">
                來源登錄表（sources/registry.json）
              </h2>
              <span className="font-mono text-xs text-[#4B5563]">
                Schema v{registry.schemaVersion} · 更新日期 {registry.lastUpdated}
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-xs font-semibold text-[#4B5563]">
                    <th className="px-3 py-2.5">來源 ID</th>
                    <th className="px-3 py-2.5">文件標題與機構</th>
                    <th className="px-3 py-2.5">對應章節</th>
                    <th className="px-3 py-2.5">讀取日期</th>
                    <th className="px-3 py-2.5">狀態</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {registry.sources.map((src) => (
                    <tr key={src.id} className="align-top hover:bg-[#F9FAFB]">
                      <td className="px-3 py-3 font-mono text-xs text-[#3458A4] whitespace-nowrap">
                        {src.id}
                      </td>
                      <td className="px-3 py-3">
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[#111827] hover:text-[#3458A4] hover:underline"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        </a>
                        <div className="mt-0.5 text-xs text-[#4B5563]">{src.authorOrOrg}</div>
                        <p className="mt-1 text-xs text-[#6B7280]">{src.notes}</p>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-[#374151]">
                        {src.topics.join(', ')}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-[#4B5563] whitespace-nowrap">
                        {src.readDate ?? 'null（未讀取）'}
                      </td>
                      <td className="px-3 py-3 text-xs font-medium whitespace-nowrap">
                        <span
                          className={
                            src.status === 'ingested'
                              ? 'text-[#1F6E58]'
                              : src.status === 'unavailable'
                                ? 'text-[#B91C1C]'
                                : 'text-[#4B5563]'
                          }
                        >
                          {src.status === 'ingested'
                            ? 'ingested（已讀取整合）'
                            : src.status === 'unavailable'
                              ? 'unavailable（存取受阻）'
                              : src.status === 'pending'
                                ? 'pending（待讀取）'
                                : 'needs-review（待複核）'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
            <h2 className="border-b border-[#E5E7EB] pb-3 text-lg font-bold text-[#111827]">
              來源閱讀筆記（wiki/sources/*.md）
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {sourceNotes.map((note) => (
                <div
                  key={note.fileName}
                  className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-[#4B5563]">
                    <span className="font-mono font-semibold text-[#3458A4]">{note.sourceId}</span>
                    <span>{note.fileName}</span>
                  </div>
                  <h3 className="mt-1 text-base font-bold text-[#111827]">{note.title}</h3>
                  <div className="mt-2">
                    <MarkdownRenderer content={note.body} compact />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Tab 2: Workflow Graph */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          <WorkflowGraph />
          {docs.find((d) => d.id === 'workflow') && (
            <section className="rounded-xl border border-[#E5E7EB] bg-white p-6">
              <MarkdownRenderer
                content={docs.find((d) => d.id === 'workflow')!.content}
                compact
              />
            </section>
          )}
        </div>
      )}

      {/* Tab 3: All Project Rules & Governance Docs */}
      {activeTab === 'docs' && (
        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-3">
              <div className="mb-2 px-2 text-xs font-semibold text-[#4B5563]">
                專案文件清單
              </div>
              <div className="space-y-1">
                {docs.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      doc.id === selectedDocId
                        ? 'bg-[#3458A4]/10 font-semibold text-[#3458A4]'
                        : 'text-[#374151] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    <div>{doc.title}</div>
                    <div className="font-mono text-[11px] text-[#6B7280]">{doc.fileName}</div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-6 lg:col-span-8">
            {activeDoc && <MarkdownRenderer content={activeDoc.content} compact />}
          </section>
        </div>
      )}
    </div>
  );
}
