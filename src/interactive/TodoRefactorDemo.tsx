import React, { useState } from 'react';
import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import {
  TODO_LAYERS,
  type SimTodoItem,
  type TodoLayerInspect,
  createInitialTodos,
} from '../domain/todoRefactorSim';
import type { DemoComponentProps } from '../types/wiki';
import { CodeBlock } from '../components/CodeBlock';

export function TodoRefactorDemo({ examples }: DemoComponentProps) {
  const [todos, setTodos] = useState<SimTodoItem[]>(createInitialTodos);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-11-28');
  const [showDueDateFeature, setShowDueDateFeature] = useState(true);
  const [activeLayer, setActiveLayer] = useState<TodoLayerInspect>('data');
  const [inputError, setInputError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'state' | 'code'>('state');

  const layerInfo = TODO_LAYERS[activeLayer];

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setInputError('TodoItem 建構式規則：待辦標題不可為空白。');
      return;
    }
    setInputError(null);
    const nextId = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    setTodos((prev) => [
      ...prev,
      {
        id: nextId,
        title: trimmed,
        isDone: false,
        dueDate: showDueDateFeature && newDueDate ? newDueDate : null,
      },
    ]);
    setNewTitle('');
  };

  const handleToggle = (id: number) => {
    setTodos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isDone: !item.isDone } : item))
    );
  };

  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    setTodos(createInitialTodos());
    setNewTitle('');
    setNewDueDate('2026-11-28');
    setShowDueDateFeature(true);
    setActiveLayer('data');
    setInputError(null);
  };

  const layersOrder: TodoLayerInspect[] = ['data', 'service', 'view', 'before'];

  return (
    <section
      aria-label="待辦事項整合與重構互動概念模擬"
      className="my-6 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#E5E7EB] pb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">
            互動概念模擬：待辦事項系統（三層分工與加入新需求比較）
          </h3>
          <p className="mt-1 text-sm text-[#4B5563]">
            本區為 TypeScript 概念模擬（非瀏覽器執行 C#）。實際新增、完成、刪除待辦事項，並切換查看「資料與規則」「操作協調」「畫面」的對應 C# 位置。
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] whitespace-nowrap shrink-0"
        >
          <RotateCcw className="h-4 w-4" />
          <span>重置預設</span>
        </button>
      </div>

      {/* Layer Inspector Buttons */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="程式分層檢視">
          {layersOrder.map((key) => {
            const info = TODO_LAYERS[key];
            const active = activeLayer === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveLayer(key)}
                className={`min-h-[36px] rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? key === 'before'
                      ? 'border-[#B91C1C] bg-[#B91C1C] text-white'
                      : 'border-[#3458A4] bg-[#3458A4] text-white'
                    : 'border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F1F5F9]'
                }`}
              >
                {info.label}
              </button>
            );
          })}
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-[#1F2937]">
          <input
            type="checkbox"
            checked={showDueDateFeature}
            onChange={(e) => setShowDueDateFeature(e.target.checked)}
            className="h-4 w-4 rounded border-[#D1D5DB] text-[#3458A4]"
          />
          <span>模擬加入新需求：截止日期（DueDate）</span>
        </label>
      </div>

      {/* Mobile Tab */}
      <div className="mt-4 flex gap-1 rounded-lg bg-[#F1F5F9] p-1 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileView('state')}
          className={`flex-1 rounded-md py-2 text-xs font-semibold ${
            mobileView === 'state' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#4B5563]'
          }`}
        >
          待辦操作與影響分析
        </button>
        <button
          type="button"
          onClick={() => setMobileView('code')}
          className={`flex-1 rounded-md py-2 text-xs font-semibold ${
            mobileView === 'code' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#4B5563]'
          }`}
        >
          對應 C# 程式
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:items-start">
        <div className={`space-y-4 lg:col-span-6 ${mobileView === 'code' ? 'hidden lg:block' : ''}`}>
          {/* Interactive Todo List */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
            <form onSubmit={handleAddTodo} className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="新增待辦項目（空白送出可測試規則攔截）"
                aria-label="新增待辦標題"
                className="min-h-[38px] flex-1 min-w-[160px] rounded-lg border border-[#D1D5DB] px-3 py-1.5 text-sm text-[#111827] focus:border-[#3458A4] focus:outline-none"
              />
              {showDueDateFeature && (
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  aria-label="截止日期"
                  className="min-h-[38px] rounded-lg border border-[#D1D5DB] px-2.5 py-1.5 font-mono text-xs text-[#111827]"
                />
              )}
              <button
                type="submit"
                className="inline-flex min-h-[38px] items-center gap-1 rounded-lg bg-[#3458A4] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2B4887]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>新增</span>
              </button>
            </form>
            {inputError && (
              <p className="mt-2 text-xs text-[#B91C1C]" role="alert">
                {inputError}
              </p>
            )}

            <ul className="mt-4 divide-y divide-[#E5E7EB]">
              {todos.length === 0 ? (
                <li className="py-4 text-center text-xs text-[#6B7280]">目前沒有待辦項目。</li>
              ) : (
                todos.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                      <input
                        type="checkbox"
                        checked={item.isDone}
                        onChange={() => handleToggle(item.id)}
                        className="h-4 w-4 rounded border-[#D1D5DB] text-[#247C74]"
                      />
                      <span className={item.isDone ? 'line-through text-[#6B7280]' : 'text-[#111827]'}>
                        <span className="mr-1.5 font-mono text-xs text-[#4B5563]">#{item.id}</span>
                        {item.title}
                        {showDueDateFeature && item.dueDate && (
                          <span className="ml-2 font-mono text-xs text-[#247C74]">
                            （期限：{item.dueDate}）
                          </span>
                        )}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      aria-label={`刪除 ${item.title}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Layer & DueDate Requirement Change Explanation */}
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-sm">
            <div className="text-xs font-semibold text-[#3458A4]">
              檢視分層：{layerInfo.label}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[#374151]">
              <strong>職責說明：</strong>
              {layerInfo.responsibility}
            </p>
            <p className="mt-2 border-t border-[#E5E7EB] pt-2 text-xs leading-relaxed text-[#1F2937]">
              <strong>加入「截止日期」新需求之修改範圍：</strong>
              {layerInfo.dueDateImpact}
            </p>
          </div>
        </div>

        <div className={`min-w-0 lg:col-span-6 ${mobileView === 'state' ? 'hidden lg:block' : ''}`}>
          <CodeBlock
            files={examples}
            activeFileName={layerInfo.csharpFile}
            highlightLines={layerInfo.highlightLines}
            title={layerInfo.label}
          />
        </div>
      </div>
    </section>
  );
}
