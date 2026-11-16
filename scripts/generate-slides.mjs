import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONCEPTS_DIR = path.join(ROOT, 'wiki', 'concepts');
const EXAMPLES_DIR = path.join(ROOT, 'examples', 'csharp');
const REGISTRY_PATH = path.join(ROOT, 'sources', 'registry.json');
const OUTPUT_PATH = path.join(ROOT, 'public', 'slides.html');

function stripComment(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  const idx = trimmed.indexOf(' #');
  return (idx >= 0 ? trimmed.slice(0, idx) : trimmed).trim();
}

function parseFrontmatter(raw) {
  const normalized = raw.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return { data: {}, body: normalized };
  const endMarker = normalized.indexOf('\n---\n', 4);
  if (endMarker === -1) return { data: {}, body: normalized };

  const yamlBlock = normalized.slice(4, endMarker);
  const body = normalized.slice(endMarker + 5).trim();
  const data = {};
  let currentArrayKey = null;

  for (const rawLine of yamlBlock.split('\n')) {
    const line = rawLine.trimEnd();
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (currentArrayKey && /^\s*-\s+/.test(line)) {
      data[currentArrayKey].push(stripComment(line.replace(/^\s*-\s+/, '')));
      continue;
    }
    currentArrayKey = null;
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const rawValue = line.slice(colonIdx + 1).trim();
    if (rawValue === '' || rawValue.startsWith('#')) {
      data[key] = [];
      currentArrayKey = key;
    } else if (rawValue === '[]') {
      data[key] = [];
    } else {
      data[key] = stripComment(rawValue);
    }
  }
  return { data, body };
}

function parseSections(body) {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let currentTitle = null;
  let buffer = [];
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentTitle !== null) sections.push({ title: currentTitle, body: buffer.join('\n').trim() });
      currentTitle = line.slice(3).trim();
      buffer = [];
    } else if (currentTitle !== null) {
      buffer.push(line);
    }
  }
  if (currentTitle !== null) sections.push({ title: currentTitle, body: buffer.join('\n').trim() });
  return sections;
}

function cleanBullet(line) {
  return line
    .trim()
    .replace(/^-\s+/, '')
    .replace(/^\d+\.\s+/, '')
    .replace(/\*\*/g, '')
    .replace(/`([^`]+)`/g, '$1');
}

function extractBullets(body, limit = 4) {
  return body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- ') || /^\d+\.\s+/.test(l))
    .map(cleanBullet)
    .filter(Boolean)
    .slice(0, limit);
}

function extractFirstParagraph(body) {
  const blocks = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b && !b.startsWith('#') && !b.startsWith('-') && !b.startsWith('```'));
  return cleanBullet(blocks[0] ?? '');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const conceptFiles = fs.readdirSync(CONCEPTS_DIR).filter((f) => f.endsWith('.md')).sort();
const concepts = conceptFiles.map((fileName) => {
  const raw = fs.readFileSync(path.join(CONCEPTS_DIR, fileName), 'utf8');
  const { data, body } = parseFrontmatter(raw);
  return {
    metadata: {
      id: data.id,
      slug: data.slug,
      order: Number.parseInt(data.order, 10) || 99,
      title: data.title,
      subtitle: data.subtitle,
      summary: data.summary,
      compileStatus: data.compileStatus || 'unverified-no-dotnet',
      sourceIds: Array.isArray(data.sourceIds) ? data.sourceIds : [],
      exampleIds: Array.isArray(data.exampleIds) ? data.exampleIds : [],
      slideExampleId: data.slideExampleId,
      slideLineRange: data.slideLineRange,
    },
    sections: parseSections(body),
  };
}).sort((a, b) => a.metadata.order - b.metadata.order);

const slides = [];

slides.push({
  id: 'cover',
  groupLabel: '導論｜讀者前提與定位',
  title: '程式觀念實驗室：從物件導向到 MVC 與低耦合設計',
  subtitle: '以 C# 範例為載體，建立跨語言通用的模組化與架構設計思維',
  bullets: [
    '讀者前提：已熟悉變數、型別、條件判斷（if/else）、迴圈與函式（method）。',
    '解決痛點：克服「程式碼全寫在單一檔案、改一處壞三處」的維護困境。',
    '技術邊界：教材範例採 C# 12（.NET 8）；互動實驗為 TypeScript 前端概念模擬。',
    '單一資料來源：本簡報直接產生自 wiki/concepts/*.md 與 examples/csharp/。',
  ],
  calloutTitle: '本階段資料誠實原則',
  calloutBody: '所有觀念均附來源登錄紀錄；因環境未安裝 .NET SDK，C# 範例維持標示 unverified-no-dotnet。',
});

slides.push({
  id: 'roadmap',
  groupLabel: `導論｜${concepts.length} 章學習地圖`,
  title: `從單一類別到系統組裝：${concepts.length} 章完整學習路線`,
  subtitle: '每一章皆聚焦一個明確的生活／系統情境，逐層推演設計原因',
  bullets: [],
  tableRows: concepts.map((c) => ({
    col1: `${String(c.metadata.order).padStart(2, '0')} · ${c.metadata.title}`,
    col2: (c.metadata.subtitle.split('：')[0] ?? c.metadata.subtitle),
    col3: c.metadata.summary,
  })),
});

for (const c of concepts) {
  const m = c.metadata;
  const orderStr = String(m.order).padStart(2, '0');
  const problemSec = c.sections.find((s) => s.title === '問題情境');
  const goalSec = c.sections.find((s) => s.title === '學習目標');
  const diffSec = c.sections.find((s) => s.title === '修改需求的比較');
  const expectedSec = c.sections.find((s) => s.title === '預期結果');

  const goalBullets = goalSec ? extractBullets(goalSec.body, 3) : [];
  const problemIntro = problemSec ? extractFirstParagraph(problemSec.body) : m.summary;

  slides.push({
    id: `${m.id}-concept`,
    groupLabel: `第 ${orderStr} 章｜觀念與問題`,
    title: `${orderStr}. ${m.title}：為什麼需要這個設計？`,
    subtitle: m.subtitle,
    chapterId: m.id,
    chapterSlug: m.slug,
    sourceIds: m.sourceIds,
    exampleIds: m.exampleIds,
    calloutTitle: '核心問題情境',
    calloutBody: problemIntro,
    bullets: goalBullets.length > 0 ? goalBullets : [m.summary],
  });

  const targetEx = m.slideExampleId || m.exampleIds[0];
  let snippet = null;
  if (targetEx) {
    const fullPath = path.join(EXAMPLES_DIR, targetEx);
    const codeLines = fs.readFileSync(fullPath, 'utf8').replace(/\r\n/g, '\n').trimEnd().split('\n');
    const rm = (m.slideLineRange || '').match(/^(\d+)\s*-\s*(\d+)$/);
    const startLine = rm ? Math.min(Number.parseInt(rm[1], 10), codeLines.length) : 1;
    const endLine = rm ? Math.min(Number.parseInt(rm[2], 10), codeLines.length) : Math.min(22, codeLines.length);
    snippet = {
      exampleId: targetEx,
      fileName: path.basename(targetEx),
      startLine,
      endLine,
      code: codeLines.slice(startLine - 1, endLine).join('\n'),
      projectNote: targetEx.startsWith('07-mvc-architecture')
        ? '需放在指定專案｜ASP.NET Core MVC Web App（.NET 8，不可混入 Console）'
        : `可搭配所屬單元專案執行｜.NET 8 Console（${m.id}）`,
      compileStatus: m.compileStatus,
    };
  }

  const diffBullets = diffSec ? extractBullets(diffSec.body, 2) : [];
  const expectedIntro = expectedSec ? extractFirstParagraph(expectedSec.body) : '';

  slides.push({
    id: `${m.id}-code`,
    groupLabel: `第 ${orderStr} 章｜C# 範例片段與比較`,
    title: `${orderStr}. ${m.title}：核心 C# 結構與變更影響`,
    subtitle: m.summary,
    chapterId: m.id,
    chapterSlug: m.slug,
    sourceIds: m.sourceIds,
    exampleIds: m.exampleIds,
    snippet,
    bullets: diffBullets.length > 0 ? diffBullets : [expectedIntro].filter(Boolean),
    calloutTitle: '完整程式與互動模擬',
    calloutBody: `完整檔案清單：${m.exampleIds.join('、')}。需要操作步驟模擬與互動檢查解析，請點上方「回到對應完整教材」。`,
  });
}

slides.push({
  id: 'architecture-synthesis',
  groupLabel: '總結｜跨章維度對照',
  title: '一次釐清：OOP、低耦合、MVC 與網頁渲染維度',
  subtitle: '不同層級的設計工具各司其職，避免混為一談',
  bullets: [
    'OOP（第 01–05 章）：以類別、封裝、組合、多型與介面組織個別物件與能力契約。',
    '低耦合與 DI（第 06、09 章）：以依賴反轉原則（DIP）面向介面，再用建構式注入（DI）由外部組裝實例。',
    'MVC（第 07 章）：將應用切為 Model（規則狀態）、Controller（協調）、View（呈現）；Model 不依賴 View/Controller。',
    '渲染維度（SSR / SPA）：處理 HTML 在伺服器或瀏覽器生成；第 07 章進階歷史對照因 Medium 403 標記待驗證。',
  ],
  calloutTitle: '延伸整合實戰（第 08–09 章）',
  calloutBody: '重構待辦系統後，即可進一步以第 09 章「建構式注入」把服務所需紀錄器或儲存介面交由組裝端傳入。',
});

const ingestedTopic = registry.sources.filter((s) => s.status === 'ingested' && s.category !== 'methodology');
const ingestedMethod = registry.sources.filter((s) => s.status === 'ingested' && s.category === 'methodology');
const unavailable = registry.sources.filter((s) => s.status === 'unavailable');
const pending = registry.sources.filter((s) => s.status === 'pending');

slides.push({
  id: 'sources-status',
  groupLabel: '總結｜來源與驗證透明紀錄',
  title: '知識來源 Ingest 與環境驗證實況',
  subtitle: `依據 sources/registry.json（Schema v${registry.schemaVersion} · 更新 ${registry.lastUpdated}）`,
  bullets: [
    `已實讀整合（ingested）主題／補充來源共 ${ingestedTopic.length} 篇：${ingestedTopic.map((s) => s.id).join('、')}。`,
    `方法論參考（另計，不列入主題數）共 ${ingestedMethod.length} 篇：${ingestedMethod.map((s) => s.id).join('、')}。`,
    `存取受阻（unavailable，readDate: null）共 ${unavailable.length} 篇：${unavailable.map((s) => s.id).join('、')}（Medium HTTP 403）。`,
    `待讀取（pending）共 ${pending.length} 篇：${pending.map((s) => s.id).join('、')}；C# 編譯狀態為 unverified-no-dotnet。`,
  ],
  calloutTitle: '嚴格誠實原則',
  calloutBody: '凡未取得正文之網址一律保持 readDate: null，不以搜尋摘要充數；無 .NET SDK 環境亦明確揭露未本地編譯。',
});

const totalSlideCount = slides.length + 1;
slides.push({
  id: 'closing-next',
  groupLabel: '結語｜互動實驗與擴充實證',
  title: '前往知識庫操作模擬，並檢視製作流程與擴充驗證紀錄',
  subtitle: '教材、簡報、Workflow 與驗證紀錄共同構成可持續維護的 LLM Wiki',
  bullets: [
    `互動概念模擬：第 01–${String(concepts.length).padStart(2, '0')} 章皆配有雙欄程式碼高亮模擬器與 2 題可展開檢核解析。`,
    '工作流程追蹤：前往主網站「資料來源與製作流程」查看 A–F 六階段迴圈圖與驗證反思。',
    '擴充實證完成：已依 AGENTS.md 新增第 09 章「依賴注入入門」並自動匯入知識庫、搜尋與本簡報。',
    `列印與離線保存：點擊上方「列印 / 另存 PDF」可展開全部 ${totalSlideCount} 頁自動分頁排版輸出。`,
  ],
});

function renderSlideArticle(slide, index, total) {
  const num = index + 1;
  const metaRow = (slide.chapterId || (slide.sourceIds && slide.sourceIds.length))
    ? `<div class="meta-row">${
        slide.chapterId ? `<span>主題 ID：<code>${escapeHtml(slide.chapterId)}</code></span>` : ''
      }${
        slide.sourceIds && slide.sourceIds.length
          ? `<span>· 來源 ID：<code>${escapeHtml(slide.sourceIds.join(', '))}</code></span>`
          : ''
      }</div>`
    : '';

  const tableHtml = slide.tableRows
    ? `<div class="table-wrap"><table><thead><tr><th>章節主題</th><th>情境</th><th>核心觀念摘要</th></tr></thead><tbody>${slide.tableRows
        .map(
          (r) =>
            `<tr><td><strong>${escapeHtml(r.col1)}</strong></td><td class="accent">${escapeHtml(
              r.col2
            )}</td><td>${escapeHtml(r.col3)}</td></tr>`
        )
        .join('')}</tbody></table></div>`
    : '';

  const bulletsHtml = slide.bullets.length
    ? `<ul class="points">${slide.bullets
        .map(
          (b, i) =>
            `<li><span class="num">${String(i + 1).padStart(2, '0')}</span><span>${escapeHtml(
              b
            )}</span></li>`
        )
        .join('')}</ul>`
    : '';

  const snippetHtml = slide.snippet
    ? `<div class="code-card" data-disable-slide-keys="true">
        <div class="code-head">
          <span><strong>${escapeHtml(slide.snippet.fileName)}</strong>（第 ${slide.snippet.startLine}–${slide.snippet.endLine} 行）· ${escapeHtml(slide.snippet.exampleId)}</span>
          <div class="code-actions">
            <span class="code-env">C# 12 · .NET 8 · 未本地編譯驗證</span>
            <button type="button" class="btn-copy no-print" data-copy-target="code-${index}">複製片段</button>
          </div>
        </div>
        <div class="code-sub">${escapeHtml(slide.snippet.projectNote)}</div>
        <div class="manual-copy-box no-print" id="manual-${index}" hidden>
          <div class="manual-copy-head">剪貼簿權限受限，請選取下方程式碼後按 Ctrl+C / Cmd+C：</div>
          <textarea readonly rows="4" aria-label="手動複製程式碼">${escapeHtml(slide.snippet.code)}</textarea>
        </div>
        <pre><code id="code-${index}">${slide.snippet.code
          .split('\n')
          .map(
            (line, li) =>
              `<span class="code-line"><span class="ln">${slide.snippet.startLine + li}</span><span>${escapeHtml(
                line || ' '
              )}</span></span>`
          )
          .join('')}</code></pre>
      </div>`
    : '';

  const calloutHtml =
    slide.calloutTitle && slide.calloutBody
      ? `<div class="callout"><div class="callout-title">${escapeHtml(
          slide.calloutTitle
        )}</div><p>${escapeHtml(slide.calloutBody)}</p></div>`
      : '';

  const backLink = slide.chapterSlug
    ? `<a class="btn-lesson no-print" href="./#/wiki/${escapeHtml(slide.chapterSlug)}">回到對應完整教材 →</a>`
    : `<a class="btn-lesson no-print" href="./#/">回到知識庫首頁 →</a>`;

  return `<article class="slide${index === 0 ? ' is-active' : ''}" data-slide-index="${index}" aria-label="第 ${num} 頁：${escapeHtml(slide.title)}">
    <div class="slide-top">
      <span class="group">${escapeHtml(slide.groupLabel)}</span>
      <div class="slide-top-right">
        <span class="page-badge">第 ${num} / ${total} 頁</span>
        ${backLink}
      </div>
    </div>
    <h2>${escapeHtml(slide.title)}</h2>
    <p class="subtitle">${escapeHtml(slide.subtitle)}</p>
    ${metaRow}
    ${tableHtml}
    ${bulletsHtml}
    ${snippetHtml}
    ${calloutHtml}
  </article>`;
}

const tocItemsHtml = slides
  .map(
    (s, i) =>
      `<button type="button" class="toc-item${i === 0 ? ' is-current' : ''}" data-jump="${i}"><span class="toc-num">${String(
        i + 1
      ).padStart(2, '0')}.</span><span>${escapeHtml(s.title)}</span></button>`
  )
  .join('');

const html = `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>程式觀念實驗室｜教學 HTML 簡報（共 ${slides.length} 頁）</title>
  <meta name="description" content="由 Wiki 知識庫同步產生之 ${slides.length} 頁 C# 程式觀念教學簡報，涵蓋物件導向、低耦合高內聚、MVC 架構與依賴注入入門。" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+TC:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #F6F7FB;
      --surface: #FFFFFF;
      --border: #E5E7EB;
      --text: #1F2937;
      --muted: #4B5563;
      --primary: #3458A4;
      --teal: #247C74;
      --sans: 'Plus Jakarta Sans', 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif;
      --mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: var(--sans);
      line-height: 1.7;
    }
    .shell {
      max-width: 1024px;
      margin: 0 auto;
      padding: 20px 16px 40px;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px 16px;
      margin-bottom: 12px;
    }
    .brand {
      font-weight: 700;
      font-size: 15px;
      color: #111827;
    }
    .brand small {
      display: block;
      font-weight: 500;
      font-size: 12px;
      color: var(--muted);
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    button, a.btn-lesson, a.btn-back {
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      min-height: 38px;
      padding: 7px 12px;
      border-radius: 8px;
      border: 1px solid #D1D5DB;
      background: #FFFFFF;
      color: var(--text);
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    button:hover, a.btn-lesson:hover, a.btn-back:hover { background: #F3F4F6; }
    button.primary { background: var(--primary); color: #FFFFFF; border-color: var(--primary); }
    button.primary:hover { background: #2B4887; }
    a.btn-lesson { background: var(--teal); color: #FFFFFF; border-color: var(--teal); min-height: 34px; font-size: 12px; }
    a.btn-lesson:hover { background: #1E665F; }
    button:disabled { opacity: 0.45; cursor: not-allowed; }
    button:focus-visible, a:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }

    .progress-track {
      height: 6px;
      background: var(--border);
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 14px;
    }
    .progress-fill {
      height: 100%;
      background: var(--primary);
      width: 5%;
      transition: width 150ms ease;
    }
    .notice {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 13px;
      color: #374151;
      margin-bottom: 12px;
    }
    .toc-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .toc-grid {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      margin-top: 10px;
    }
    .toc-item {
      justify-content: flex-start;
      text-align: left;
      font-size: 12px;
      font-weight: 500;
      padding: 8px 10px;
    }
    .toc-item.is-current {
      background: var(--primary);
      border-color: var(--primary);
      color: #FFFFFF;
      font-weight: 600;
    }
    .toc-num { font-family: var(--mono); }

    .slide {
      display: none;
      background: var(--surface);
      border: 1px solid #D1D5DB;
      border-radius: 12px;
      padding: 28px;
    }
    .slide.is-active { display: block; }
    .slide-top {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 12px;
    }
    .slide-top-right {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
    }
    .group { font-size: 13px; font-weight: 700; color: var(--primary); }
    .page-badge { font-family: var(--mono); font-size: 12px; color: var(--muted); }
    .slide h2 {
      margin: 0;
      font-size: 26px;
      line-height: 1.3;
      color: #111827;
    }
    .subtitle {
      margin: 8px 0 0;
      font-size: 16px;
      color: var(--muted);
    }
    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 14px;
      padding: 10px 0;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      font-size: 12px;
      color: var(--muted);
    }
    .meta-row code { font-family: var(--mono); color: #111827; }
    ul.points {
      list-style: none;
      padding: 0;
      margin: 18px 0 0;
      display: grid;
      gap: 12px;
      font-size: 17px;
    }
    ul.points li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    ul.points .num {
      font-family: var(--mono);
      font-size: 12px;
      font-weight: 700;
      color: var(--primary);
      margin-top: 5px;
      flex-shrink: 0;
    }
    .table-wrap {
      overflow-x: auto;
      margin-top: 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
    }
    table { width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; }
    th, td { padding: 9px 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
    th { background: #F8FAFC; font-size: 12px; color: var(--muted); }
    td.accent { color: var(--primary); font-weight: 500; white-space: nowrap; }

    .code-card {
      margin-top: 18px;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #1E293B;
      background: #0F172A;
      color: #E2E8F0;
    }
    .code-head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      background: #111827;
      padding: 10px 14px;
      border-bottom: 1px solid #1E293B;
      font-size: 13px;
    }
    .code-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    .code-env { font-size: 12px; color: #94A3B8; }
    .btn-copy {
      min-height: 30px;
      padding: 4px 10px;
      font-size: 12px;
      background: #1E293B;
      color: #E2E8F0;
      border-color: #334155;
    }
    .btn-copy:hover { background: #334155; }
    .code-sub {
      background: #0B1120;
      padding: 6px 14px;
      font-size: 12px;
      color: #94A3B8;
      border-bottom: 1px solid #1E293B;
    }
    .manual-copy-box {
      padding: 10px 14px;
      background: #1E293B;
      border-bottom: 1px solid #334155;
      font-size: 12px;
    }
    .manual-copy-box textarea {
      width: 100%;
      margin-top: 6px;
      background: #0F172A;
      color: #F8FAFC;
      border: 1px solid #475569;
      border-radius: 6px;
      padding: 8px;
      font-family: var(--mono);
      font-size: 12px;
    }
    pre {
      margin: 0;
      padding: 12px 0;
      overflow-x: auto;
      font-family: var(--mono);
      font-size: 14.5px;
      line-height: 1.6;
    }
    .code-line { display: flex; padding: 0 14px; min-width: max-content; }
    .ln { width: 32px; margin-right: 14px; text-align: right; color: #64748B; user-select: none; }

    .callout {
      margin-top: 18px;
      border: 1px solid var(--border);
      background: #F8FAFC;
      border-radius: 8px;
      padding: 12px 14px;
      font-size: 14px;
    }
    .callout-title { font-size: 12px; font-weight: 700; color: var(--teal); }
    .callout p { margin: 4px 0 0; color: #374151; }

    .nav-bottom {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-top: 16px;
    }
    .kbd-hint { font-size: 12px; color: var(--muted); }
    kbd {
      font-family: var(--mono);
      border: 1px solid #D1D5DB;
      background: #FFFFFF;
      border-radius: 4px;
      padding: 1px 6px;
    }

    body.focus-mode .shell { max-width: 1120px; padding-top: 12px; }
    body.focus-mode .hide-in-focus { display: none; }

    @media (max-width: 640px) {
      .slide { padding: 18px 16px; }
      .slide h2 { font-size: 21px; }
      ul.points { font-size: 16px; }
      pre { font-size: 13.5px; }
    }

    @media print {
      @page { size: A4 landscape; margin: 12mm; }
      body { background: #FFFFFF; color: #111827; }
      .no-print { display: none !important; }
      .shell { max-width: none; padding: 0; }
      .slide {
        display: block !important;
        border: 1px solid #D1D5DB;
        padding: 18px 22px;
        margin: 0;
        break-inside: avoid;
        page-break-inside: avoid;
        break-after: page;
        page-break-after: always;
      }
      .slide:last-child {
        break-after: auto;
        page-break-after: auto;
      }
      pre { white-space: pre-wrap; word-break: break-word; }
      .code-line { min-width: 0; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <div class="toolbar no-print">
      <div class="brand">
        程式觀念實驗室｜教學 HTML 簡報
        <small>由 wiki/concepts/*.md 與 examples/csharp/ 同步產生（共 ${slides.length} 頁）</small>
      </div>
      <div class="actions">
        <a class="btn-back hide-in-focus" href="./#/">返回知識庫</a>
        <button type="button" id="btn-toc">章節目錄</button>
        <button type="button" id="btn-fs">全螢幕 / 專注檢視</button>
        <button type="button" id="btn-print">列印 / 另存 PDF</button>
      </div>
    </div>

    <div class="progress-track no-print"><div class="progress-fill" id="progress-fill"></div></div>
    <div class="notice no-print" id="notice" hidden></div>
    <nav class="toc-panel no-print" id="toc-panel" aria-label="簡報頁次目錄" hidden>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong style="font-size:13px;">簡報頁次目錄（點擊跳轉）</strong>
        <button type="button" id="btn-toc-close" style="min-height:30px;padding:4px 10px;font-size:12px;">收合</button>
      </div>
      <div class="toc-grid">${tocItemsHtml}</div>
    </nav>

    <main id="deck">
      ${slides.map((s, idx) => renderSlideArticle(s, idx, slides.length)).join('\n')}
    </main>

    <div class="nav-bottom no-print">
      <button type="button" id="btn-prev">← 上一頁</button>
      <span class="kbd-hint">
        <span id="page-counter">第 1 / ${slides.length} 頁</span> · 鍵盤 <kbd>←</kbd> <kbd>→</kbd> 翻頁
      </span>
      <button type="button" id="btn-next" class="primary">下一頁 →</button>
    </div>
  </div>

  <script>
    (function () {
      const slideEls = Array.from(document.querySelectorAll('.slide'));
      const tocButtons = Array.from(document.querySelectorAll('.toc-item'));
      const btnPrev = document.getElementById('btn-prev');
      const btnNext = document.getElementById('btn-next');
      const btnToc = document.getElementById('btn-toc');
      const btnTocClose = document.getElementById('btn-toc-close');
      const tocPanel = document.getElementById('toc-panel');
      const btnFs = document.getElementById('btn-fs');
      const btnPrint = document.getElementById('btn-print');
      const progressFill = document.getElementById('progress-fill');
      const pageCounter = document.getElementById('page-counter');
      const notice = document.getElementById('notice');
      let current = 0;

      function showNotice(msg) {
        notice.textContent = msg;
        notice.hidden = false;
      }

      function render(idx) {
        current = Math.max(0, Math.min(slideEls.length - 1, idx));
        slideEls.forEach((el, i) => el.classList.toggle('is-active', i === current));
        tocButtons.forEach((btn, i) => btn.classList.toggle('is-current', i === current));
        btnPrev.disabled = current === 0;
        btnNext.disabled = current === slideEls.length - 1;
        const pct = Math.round(((current + 1) / slideEls.length) * 100);
        progressFill.style.width = pct + '%';
        pageCounter.textContent = '第 ' + (current + 1) + ' / ' + slideEls.length + ' 頁';
      }

      btnPrev.addEventListener('click', () => render(current - 1));
      btnNext.addEventListener('click', () => render(current + 1));
      btnToc.addEventListener('click', () => { tocPanel.hidden = !tocPanel.hidden; });
      btnTocClose.addEventListener('click', () => { tocPanel.hidden = true; });
      tocButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          render(Number(btn.dataset.jump || 0));
          tocPanel.hidden = true;
        });
      });

      btnFs.addEventListener('click', async () => {
        if (document.fullscreenElement) {
          try { await document.exitFullscreen(); } catch {}
          return;
        }
        if (document.body.classList.contains('focus-mode')) {
          document.body.classList.remove('focus-mode');
          notice.hidden = true;
          return;
        }
        if (document.fullscreenEnabled && document.documentElement.requestFullscreen) {
          try {
            await document.documentElement.requestFullscreen();
            return;
          } catch {}
        }
        document.body.classList.add('focus-mode');
        showNotice('此環境不允許原生全螢幕，已改用「專注閱讀模式」。再按一次「全螢幕 / 專注檢視」即可恢復。');
      });

      btnPrint.addEventListener('click', () => {
        showNotice('列印時會自動展開全部 ' + slideEls.length + ' 頁投影片並隱藏操作按鈕，請選擇「另存為 PDF」。');
        try { window.print(); } catch {}
      });

      document.querySelectorAll('.btn-copy').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const idx = btn.getAttribute('data-copy-target').replace('code-', '');
          const codeEl = document.getElementById('code-' + idx);
          const text = Array.from(codeEl.querySelectorAll('.code-line'))
            .map((lineEl) => lineEl.lastElementChild.textContent)
            .join('\\n');

          if (navigator.clipboard && window.isSecureContext) {
            try {
              await navigator.clipboard.writeText(text);
              btn.textContent = '已複製';
              setTimeout(() => (btn.textContent = '複製片段'), 1600);
              return;
            } catch {}
          }
          try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(ta);
            if (ok) {
              btn.textContent = '已複製';
              setTimeout(() => (btn.textContent = '複製片段'), 1600);
              return;
            }
          } catch {}
          const manualBox = document.getElementById('manual-' + idx);
          if (manualBox) manualBox.hidden = !manualBox.hidden;
        });
      });

      window.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
        const t = e.target;
        if (t instanceof HTMLElement) {
          const tag = t.tagName.toLowerCase();
          if (tag === 'input' || tag === 'textarea' || tag === 'select' || t.isContentEditable) return;
          if (t.closest('[data-disable-slide-keys="true"]')) return;
        }
        if (e.key === 'ArrowLeft') { e.preventDefault(); render(current - 1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); render(current + 1); }
      });

      render(0);
    })();
  </script>
</body>
</html>
`;

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, html, 'utf8');
console.log('Generated standalone HTML slides:', OUTPUT_PATH, 'total slides =', slides.length);
