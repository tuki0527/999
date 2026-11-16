import React, { useEffect, useState } from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import type { ConceptDocument, UserProgress } from '../types/wiki';

interface LayoutProps {
  concepts: ConceptDocument[];
  progress: UserProgress;
  showSidebar?: boolean;
  children: React.ReactNode;
}

export function Layout({
  concepts,
  progress,
  showSidebar = false,
  children,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const completedSet = new Set(progress.completedIds);

  const renderChapterList = () => (
    <nav aria-label="章節目錄" className="space-y-1">
      <div className="mb-3 px-2 text-xs font-semibold text-[#4B5563]">
        八章學習路線（已完成 {progress.completedIds.length} / {concepts.length}）
      </div>
      {concepts.map((doc) => {
        const orderLabel = String(doc.metadata.order).padStart(2, '0');
        const isDone = completedSet.has(doc.metadata.id);
        const statusHint =
          doc.metadata.status === 'planned'
            ? '規劃中'
            : doc.metadata.status === 'draft'
              ? '草稿'
              : '已查核';

        return (
          <NavLink
            key={doc.metadata.id}
            to={`/wiki/${doc.metadata.slug}`}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4] ${
                isActive
                  ? 'bg-[#3458A4]/10 font-semibold text-[#3458A4]'
                  : 'text-[#374151] hover:bg-[#F1F5F9] hover:text-[#111827]'
              }`
            }
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">
                <span className="mr-1.5 font-mono text-xs tabular-nums">{orderLabel}.</span>
                {doc.metadata.title}
              </span>
              <span className="text-[11px] font-normal text-[#6B7280] shrink-0">
                {isDone ? '已讀' : statusHint}
              </span>
            </div>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7FB] text-[#1F2937]">
      {/* Top Navigation Bar (Strict 3-zone contract) */}
      <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
          {/* Zone 1: Single-line Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            {showSidebar && (
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="開啟章節導覽"
                className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <Link
              to="/"
              className="text-lg font-bold tracking-tight text-[#111827] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
            >
              程式觀念實驗室
            </Link>
          </div>

          {/* Zone 2: Clean single-line text nav links */}
          <nav
            aria-label="主要功能導覽"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4B5563]"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `py-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#111827] ${
                  isActive || location.pathname.startsWith('/wiki/')
                    ? 'text-[#3458A4] underline decoration-2 underline-offset-8'
                    : ''
                }`
              }
            >
              教材知識庫
            </NavLink>
            <NavLink
              to="/slides"
              className={({ isActive }) =>
                `py-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#111827] ${
                  isActive ? 'text-[#3458A4] underline decoration-2 underline-offset-8' : ''
                }`
              }
            >
              教學簡報
            </NavLink>
            <NavLink
              to="/process"
              className={({ isActive }) =>
                `py-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#111827] ${
                  isActive ? 'text-[#3458A4] underline decoration-2 underline-offset-8' : ''
                }`
              }
            >
              資料來源與製作流程
            </NavLink>
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/wiki/classes-and-objects"
              className="inline-flex min-h-[40px] items-center rounded-lg bg-[#3458A4] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#2B4887] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
            >
              開始第 01 章
            </Link>
          </div>
        </div>

        {/* Mobile Secondary Nav Bar for 3 main hubs */}
        <nav
          aria-label="手機版主選單"
          className="flex items-center justify-around border-t border-[#E5E7EB] bg-[#F8FAFC] px-2 py-2 text-xs font-medium text-[#4B5563] md:hidden"
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-2 py-1 whitespace-nowrap ${
                isActive || location.pathname.startsWith('/wiki/')
                  ? 'font-semibold text-[#3458A4]'
                  : ''
              }`
            }
          >
            教材知識庫
          </NavLink>
          <NavLink
            to="/slides"
            className={({ isActive }) =>
              `px-2 py-1 whitespace-nowrap ${isActive ? 'font-semibold text-[#3458A4]' : ''}`
            }
          >
            教學簡報
          </NavLink>
          <NavLink
            to="/process"
            className={({ isActive }) =>
              `px-2 py-1 whitespace-nowrap ${isActive ? 'font-semibold text-[#3458A4]' : ''}`
            }
          >
            來源與流程
          </NavLink>
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {showSidebar && (
          <>
            {/* Desktop Collapsible Sidebar */}
            <aside
              aria-label="章節側邊欄"
              className={`hidden lg:block shrink-0 transition-all ${
                sidebarOpen ? 'w-72' : 'w-11'
              }`}
            >
              <div className="sticky top-24 rounded-xl border border-[#E5E7EB] bg-white p-3">
                <div className="flex items-center justify-between">
                  {sidebarOpen && (
                    <span className="px-2 text-xs font-semibold text-[#111827]">
                      課程目錄
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setSidebarOpen((v) => !v)}
                    aria-label={sidebarOpen ? '收合章節側欄' : '展開章節側欄'}
                    title={sidebarOpen ? '收合側欄' : '展開側欄'}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3458A4]"
                  >
                    {sidebarOpen ? (
                      <PanelLeftClose className="h-4 w-4" />
                    ) : (
                      <PanelLeftOpen className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {sidebarOpen && <div className="mt-3">{renderChapterList()}</div>}
              </div>
            </aside>

            {/* Mobile Drawer */}
            {mobileDrawerOpen && (
              <div
                className="fixed inset-0 z-50 flex lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label="章節抽屜導覽"
              >
                <div
                  className="fixed inset-0 bg-black/40"
                  onClick={() => setMobileDrawerOpen(false)}
                />
                <div className="relative z-10 flex w-72 max-w-[85vw] flex-col bg-white p-4 shadow-xl">
                  <div className="mb-4 flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                    <span className="text-sm font-bold text-[#111827]">章節導覽</span>
                    <button
                      type="button"
                      onClick={() => setMobileDrawerOpen(false)}
                      aria-label="關閉導覽"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#4B5563] hover:bg-[#F3F4F6]"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="overflow-y-auto">{renderChapterList()}</div>
                </div>
              </div>
            )}
          </>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-5 text-xs text-[#4B5563] sm:px-6">
          <div>
            程式觀念實驗室 · 從物件導向到 MVC 與低耦合設計 · C# 教學範例搭配靜態前端概念模擬
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-[#111827]">
              知識庫總覽
            </Link>
            <Link to="/slides" className="hover:text-[#111827]">
              教學簡報
            </Link>
            <Link to="/process" className="hover:text-[#111827]">
              資料來源與製作流程
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
