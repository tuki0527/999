import React, { useState } from 'react';
import { GitBranch, Info, RotateCcw } from 'lucide-react';

interface WorkflowNodeSpec {
  id: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  shortTitle: string;
  fullTitle: string;
  input: string;
  output: string;
  passCriteria: string;
  onFailure: string;
  rationale: string;
}

const WORKFLOW_NODES: WorkflowNodeSpec[] = [
  {
    id: 'A',
    shortTitle: '取得來源與登錄',
    fullTitle: 'A. 取得來源與登錄（sources/registry.json）',
    input: '候選官方文件 URL、補充文章連結與 AGENTS.md 登錄規範。',
    output: '含穩定 src-* ID、對應章節、readDate（未讀前必為 null）與狀態之登錄條目。',
    passCriteria: '所有來源皆有唯一識別碼與明確狀態（pending / unavailable），未實讀前不填寫虛構日期。',
    onFailure: '若遇到 HTTP 403 等存取阻擋，標記 unavailable 並記明原因，改查其他可實讀官方文件。',
    rationale: '先把「看到網址」與「實際讀懂正文」拆開，從源頭防止未讀先引用。',
  },
  {
    id: 'B',
    shortTitle: 'Ingest 與 Wiki 整合',
    fullTitle: 'B. Ingest 與 Wiki 整合（wiki/sources & concepts）',
    input: '實際抓取並完整閱讀的外部來源正文。',
    output: 'wiki/sources/<id>.md 摘要筆記、更新 readDate/ingested，並修訂對應 wiki/concepts/*.md。',
    passCriteria: '筆記以自己話整理且區分來源限制；教材只引用 ingested 來源，缺漏處誠實標「待驗證」。',
    onFailure: '若現有來源不足以支撐某項觀念或跨維度比較，退回節點 A 補充來源。',
    rationale: '遵守「原始來源 → 來源筆記 → 教材正文」的 LLM Wiki 三層累積結構。',
  },
  {
    id: 'C',
    shortTitle: '觀念與程式碼檢查',
    fullTitle: 'C. 觀念、來源及程式碼檢查',
    input: '九段式教材 Markdown、examples/csharp/*.cs 與 src/domain/*.ts 模擬邏輯。',
    output: '行號對齊確認、專案範圍標籤（Console / MVC Web / 反例）與誠實編譯標記。',
    passCriteria: 'C# 語意符合官方來源；無本地 .NET SDK 時標示 unverified-no-dotnet；互動高亮與簡報行號一致。',
    onFailure: '來源依據不足退回 A；觀念說明或引用衝突退回 B；程式碼與行號對不上立即修正重測。',
    rationale: '在整合與渲染前先做技術真實性與結構對齊，降低後期大面積返工風險。',
  },
  {
    id: 'D',
    shortTitle: '生成教材與 HTML 簡報',
    fullTitle: 'D. 依規則生成教材與 HTML 簡報',
    input: '通過節點 C 的教材、C# 範例與 AGENTS.md 簡報同步規則。',
    output: '知識庫教材頁、內建簡報（#/slides）與同步產出之獨立 HTML 簡報（public/slides.html，21 頁）。',
    passCriteria: '簡報與教材共用相同 ID、摘要與程式碼片段，一頁一重點，支援鍵盤保護與列印分頁。',
    onFailure: '若簡報片段過長、行號切片錯誤或內容與教材分歧，退回節點 C 調整或重跑同步腳本。',
    rationale: '確保教材與簡報共用單一資料來源，避免維護出兩套內容彼此打架的系統。',
  },
  {
    id: 'E',
    shortTitle: '瀏覽、互動及建置檢查',
    fullTitle: 'E. 瀏覽、互動及建置檢查',
    input: '前端程式碼（src/）、靜態內容、HTML 簡報與 vite.config.ts（base: ./）。',
    output: 'tsc --noEmit、vite build 產出 dist/、自動化一致性檢查輸出與跨裝置版面確認。',
    passCriteria: '零型別錯誤、靜態建置通過、HashRouter 與 ./ 相對路徑正確、手機無水平溢出且備援按鈕有效。',
    onFailure: '畫面、互動、列印或鍵盤行為異常退回 D 或對應 UI 元件；資料解析異常退回 C。',
    rationale: '以自動化型別與建置檢查搭配人工操作確認，確保產物可直接部署於靜態空間。',
  },
  {
    id: 'F',
    shortTitle: '公開部署與執行反思',
    fullTitle: 'F. 公開部署與執行反思',
    input: '通過 E 的 dist/ 產物與真實執行觀察數據。',
    output: 'wiki/log.md、docs/process-log.md、verification.md、reflection.md 與 GitHub Pages 公開網站。',
    passCriteria: '紀錄只記載實際結果與尚未完成項，不捏造統計數據；公開連結可正常讀取全部頁面。',
    onFailure: '公開子路徑載入異常退回 E 修正；後續新增擴充章節（如 09 DI）則從 F 回到 A 重啟流程。',
    rationale: '把真實限制與下次擴充入口制度化，讓後續協作者只看紀錄就能接手。',
  },
];

export function WorkflowGraph() {
  const [selectedId, setSelectedId] = useState<WorkflowNodeSpec['id']>('A');
  const activeNode = WORKFLOW_NODES.find((n) => n.id === selectedId) ?? WORKFLOW_NODES[0];

  return (
    <div className="space-y-6">
      {/* Diagram 1: Engineering Workflow Graph (SVG + Interactive Node Inspector) */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#E5E7EB] pb-3">
          <div>
            <span className="text-xs font-semibold text-[#3458A4]">
              圖 1｜開發、查核與產出工作流程圖（Workflow Graph）
            </span>
            <h3 className="mt-0.5 text-lg font-bold text-[#111827]">
              A–F 六階段閉環與退回修正回路（點擊任一節點查看五項規格）
            </h3>
          </div>
          <span className="text-xs text-[#4B5563]">
            主線實線推進 · 虛線表示檢查未過之退回與擴充回路
          </span>
        </div>

        {/* Desktop Interactive SVG Graph */}
        <div className="mt-5 hidden overflow-x-auto md:block">
          <svg
            viewBox="0 0 960 320"
            className="w-full min-w-[780px]"
            role="img"
            aria-label="A 到 F 六階段開發與查核工作流程圖，含資料不足回 A、觀念問題回 B/C、互動或建置問題回 D 與擴充回 A 的退回箭頭"
          >
            <defs>
              <marker
                id="arrow-forward"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#3458A4" />
              </marker>
              <marker
                id="arrow-back-red"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#B91C1C" />
              </marker>
              <marker
                id="arrow-back-teal"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#247C74" />
              </marker>
            </defs>

            {/* Forward Main Path A -> B -> C -> D -> E -> F */}
            {[0, 1, 2, 3, 4].map((idx) => {
              const x1 = 15 + idx * 158 + 136;
              const x2 = 15 + (idx + 1) * 158 - 4;
              return (
                <line
                  key={idx}
                  x1={x1}
                  y1={120}
                  x2={x2}
                  y2={120}
                  stroke="#3458A4"
                  strokeWidth="2"
                  markerEnd="url(#arrow-forward)"
                />
              );
            })}

            {/* Loop 1: C -> A (Data insufficient / unavailable) */}
            <path
              d="M 400 84 C 400 32, 84 32, 84 82"
              fill="none"
              stroke="#B91C1C"
              strokeWidth="1.75"
              strokeDasharray="5 4"
              markerEnd="url(#arrow-back-red)"
            />
            <text x="242" y="28" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#B91C1C">
              資料不足 / 存取受阻 → 退回 A
            </text>

            {/* Loop 2: C -> B (Concept or citation error) */}
            <path
              d="M 380 156 C 380 198, 242 198, 242 158"
              fill="none"
              stroke="#B91C1C"
              strokeWidth="1.75"
              strokeDasharray="5 4"
              markerEnd="url(#arrow-back-red)"
            />
            <text x="311" y="212" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#B91C1C">
              觀念或引用有誤 → 退回 B
            </text>

            {/* Loop 3: E -> D / C (UI, Slide, or Code check failure) */}
            <path
              d="M 716 156 C 716 198, 558 198, 558 158"
              fill="none"
              stroke="#B91C1C"
              strokeWidth="1.75"
              strokeDasharray="5 4"
              markerEnd="url(#arrow-back-red)"
            />
            <text x="637" y="212" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#B91C1C">
              互動 / 簡報 / 建置失敗 → 退回 D 或 C
            </text>

            {/* Loop 4: F -> A (Stage 4 Extension Experiment e.g. DI) */}
            <path
              d="M 874 156 L 874 268 L 84 268 L 84 160"
              fill="none"
              stroke="#247C74"
              strokeWidth="1.75"
              strokeDasharray="6 4"
              markerEnd="url(#arrow-back-teal)"
            />
            <text x="479" y="288" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#247C74">
              後續階段擴充新主題（如第 09 章依賴注入）→ 從 F 回到 A 重新走過閉環
            </text>

            {/* Clickable Nodes A–F */}
            {WORKFLOW_NODES.map((node, idx) => {
              const x = 15 + idx * 158;
              const y = 84;
              const w = 136;
              const h = 72;
              const isSelected = node.id === selectedId;
              return (
                <g
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`檢視節點 ${node.id}：${node.shortTitle}`}
                  onClick={() => setSelectedId(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(node.id);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx={10}
                    fill={isSelected ? '#3458A4' : '#F8FAFC'}
                    stroke={isSelected ? '#1E3A8A' : '#CBD5E1'}
                    strokeWidth={isSelected ? 2 : 1.25}
                  />
                  <text
                    x={x + 12}
                    y={y + 24}
                    fontSize="12"
                    fontWeight="700"
                    fill={isSelected ? '#DBEAFE' : '#3458A4'}
                  >
                    節點 {node.id}
                  </text>
                  <text
                    x={x + 12}
                    y={y + 46}
                    fontSize="12.5"
                    fontWeight="700"
                    fill={isSelected ? '#FFFFFF' : '#111827'}
                  >
                    {node.shortTitle}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Mobile Node Selector Cards */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2 md:hidden">
          {WORKFLOW_NODES.map((node) => {
            const isSelected = node.id === selectedId;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedId(node.id)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  isSelected
                    ? 'border-[#3458A4] bg-[#3458A4] text-white'
                    : 'border-[#E5E7EB] bg-[#F8FAFC] text-[#111827]'
                }`}
              >
                <div className={`font-mono text-xs font-bold ${isSelected ? 'text-[#DBEAFE]' : 'text-[#3458A4]'}`}>
                  節點 {node.id}
                </div>
                <div className="mt-0.5 text-sm font-semibold">{node.shortTitle}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Node 5-part Specification Panel */}
        <div className="mt-5 rounded-lg border border-[#3458A4]/30 bg-[#F8FAFC] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-2.5">
            <h4 className="text-base font-bold text-[#111827]">{activeNode.fullTitle}</h4>
            <span className="text-xs font-medium text-[#3458A4]">節點檢核規格</span>
          </div>

          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold text-[#4B5563]">輸入（Input）</dt>
              <dd className="mt-0.5 leading-relaxed text-[#1F2937]">{activeNode.input}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-[#4B5563]">產出（Output）</dt>
              <dd className="mt-0.5 leading-relaxed text-[#1F2937]">{activeNode.output}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-[#1F6E58]">通過條件（Pass Criteria）</dt>
              <dd className="mt-0.5 leading-relaxed text-[#1F2937]">{activeNode.passCriteria}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-[#B91C1C]">失敗或不足時的下一步</dt>
              <dd className="mt-0.5 leading-relaxed text-[#1F2937]">{activeNode.onFailure}</dd>
            </div>
            <div className="sm:col-span-2 border-t border-[#E5E7EB] pt-2.5">
              <dt className="text-xs font-semibold text-[#247C74]">設計理由（Rationale）</dt>
              <dd className="mt-0.5 leading-relaxed text-[#374151]">{activeNode.rationale}</dd>
            </div>
          </dl>
        </div>

        {/* Explicit Loop Summary Strip */}
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#B91C1C]">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>回路 1：資料不足 → 回 A</span>
            </div>
            <p className="mt-1 text-[#4B5563]">官方依據未讀齊或遇 HTTP 403 時，回 A 補登錄或換來源。</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#B91C1C]">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>回路 2：觀念／引用異常 → 回 B/C</span>
            </div>
            <p className="mt-1 text-[#4B5563]">教材用語與來源定義衝突時，退回重寫筆記並重新對齊。</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#B91C1C]">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>回路 3：互動／建置失敗 → 回 D/C</span>
            </div>
            <p className="mt-1 text-[#4B5563]">簡報切片、UI 或型別檢查失敗時，退回修正後再驗證。</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#247C74]">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>回路 4：擴充新主題 → F 回 A</span>
            </div>
            <p className="mt-1 text-[#4B5563]">第 4 階段實作第 09 章 DI 時，從 A 重走完整閉環。</p>
          </div>
        </div>
      </section>

      {/* Diagram 2: Concept Knowledge Map (Explicitly distinguished from Workflow Graph) */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E5E7EB] pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#247C74]">
              <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
              <span>圖 2｜學習輔助圖：教學概念知識關聯圖（Concept Knowledge Map）</span>
            </div>
            <h3 className="mt-0.5 text-base font-bold text-[#111827]">
              九章程式設計觀念之先修與整合關係（與上方工作流程圖屬不同圖種）
            </h3>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#4B5563]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#3458A4]" aria-hidden="true" />
          <span>
            <strong>兩圖區分說明：</strong>上方「圖 1 工作流程圖」規範作者／AI 如何製作、查核與部署內容；下方「圖 2 知識關聯圖」僅作為學習者理解 01–09 章先修依賴與整合順序之輔助地圖。
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
            <div className="font-semibold text-[#3458A4]">第一層：物件基礎</div>
            <ul className="mt-1.5 space-y-1 text-[#1F2937]">
              <li>01 類別與物件（起點）</li>
              <li>02 封裝 ← 先修 01</li>
              <li>03 繼承與組合 ← 先修 01、02</li>
            </ul>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
            <div className="font-semibold text-[#3458A4]">第二層：抽象與多型</div>
            <ul className="mt-1.5 space-y-1 text-[#1F2937]">
              <li>04 多型 ← 先修 01、03</li>
              <li>05 抽象類別與介面 ← 先修 03、04</li>
            </ul>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
            <div className="font-semibold text-[#247C74]">第三層：架構分工</div>
            <ul className="mt-1.5 space-y-1 text-[#1F2937]">
              <li>06 耦合與內聚 ← 先修 02、05</li>
              <li>07 MVC 架構 ← 先修 06</li>
            </ul>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
            <div className="font-semibold text-[#111827]">第四層：綜合與擴充</div>
            <ul className="mt-1.5 space-y-1 text-[#1F2937]">
              <li>08 整合與重構 ← 匯整 02、06、07</li>
              <li className="font-medium text-[#247C74]">09 依賴注入入門 ← 先修 05、06（已完成擴充）</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
