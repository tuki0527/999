import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  createInitialBankAccount,
  executeBankOperation,
  formatCents,
  parseDecimalToCents,
} from '../src/domain/bankAccountSim.ts';
import { simulateFileProcessingDI } from '../src/domain/dependencyInjectionSim.ts';
import { buildMvcRequestTrace, searchBooksModel } from '../src/domain/mvcBooksSim.ts';
import { ANIMAL_COLLECTION } from '../src/domain/polymorphismSim.ts';
import { TODO_LAYERS, createInitialTodos } from '../src/domain/todoRefactorSim.ts';
import { parseConceptDocument } from '../src/lib/wikiParser.ts';
import {
  loadUserProgress,
  resetUserProgress,
  saveUserProgress,
} from '../src/lib/storage.ts';

const ROOT = process.cwd();

test('Ch 02 銀行帳戶：存款與提款規則保護不變量與整數分精度', () => {
  const initial = createInitialBankAccount();
  assert.equal(initial.balanceCents, 100000);

  // 浮點數邊界測試：0.10 + 0.20 必須精確為 30 分
  const c1 = parseDecimalToCents('0.1');
  const c2 = parseDecimalToCents('0.2');
  assert.equal(c1, 10);
  assert.equal(c2, 20);
  assert.equal((c1 ?? 0) + (c2 ?? 0), 30);

  // 非法負數與 0 存款：失敗且餘額維持不變
  const negDeposit = executeBankOperation(initial, 'deposit', -5000);
  assert.equal(negDeposit.outcome.success, false);
  assert.equal(negDeposit.nextState.balanceCents, initial.balanceCents);

  const zeroWithdraw = executeBankOperation(initial, 'withdraw', 0);
  assert.equal(zeroWithdraw.outcome.success, false);
  assert.equal(zeroWithdraw.nextState.balanceCents, initial.balanceCents);

  // 超額提款：失敗且餘額維持不變
  const overWithdraw = executeBankOperation(initial, 'withdraw', 150000);
  assert.equal(overWithdraw.outcome.success, false);
  assert.equal(overWithdraw.nextState.balanceCents, initial.balanceCents);
  assert.match(overWithdraw.outcome.message, /餘額不足/);

  // 合法提款與存款
  const okDeposit = executeBankOperation(initial, 'deposit', 25050);
  assert.equal(okDeposit.outcome.success, true);
  assert.equal(okDeposit.nextState.balanceCents, 125050);
  assert.equal(formatCents(okDeposit.nextState.balanceCents), '1,250.50');

  const okWithdraw = executeBankOperation(okDeposit.nextState, 'withdraw', 25050);
  assert.equal(okWithdraw.outcome.success, true);
  assert.equal(okWithdraw.nextState.balanceCents, 100000);
});

test('Ch 04 多型：切換實作輸出與 AnimalChorus.cs 行號範圍一致', () => {
  const animalLines = fs
    .readFileSync(path.join(ROOT, 'examples/csharp/04-polymorphism/AnimalChorus.cs'), 'utf8')
    .split(/\r?\n/);

  const dog = ANIMAL_COLLECTION.find((a) => a.id === 'dog');
  const cat = ANIMAL_COLLECTION.find((a) => a.id === 'cat');
  const duck = ANIMAL_COLLECTION.find((a) => a.id === 'duck');
  assert.ok(dog && cat && duck);
  assert.notEqual(dog.soundOutput, cat.soundOutput);
  assert.notEqual(cat.soundOutput, duck.soundOutput);

  for (const item of ANIMAL_COLLECTION) {
    assert.ok(item.overrideLineRange.length > 0);
    for (const ln of item.overrideLineRange) {
      assert.ok(ln >= 1 && ln <= animalLines.length, `行號超出範圍: ${ln}`);
    }
  }
});

test('Ch 07 MVC：更換查詢關鍵字後 Model 資料與流程步驟同步更新', () => {
  const allTrace = buildMvcRequestTrace('');
  assert.equal(allTrace.results.length, 3);
  assert.match(allTrace.steps[2].summary, /3 筆/);

  const mvcTrace = buildMvcRequestTrace('mvc');
  assert.equal(mvcTrace.results.length, 1);
  assert.equal(mvcTrace.results[0].id, 'B02');
  assert.match(mvcTrace.steps[0].summary, /keyword=mvc/);
  assert.match(mvcTrace.steps[3].summary, /1 筆/);
  assert.deepEqual(mvcTrace.steps[3].highlightLines, [16, 17, 18, 19, 20, 21, 22, 23, 24]);

  const emptyTrace = buildMvcRequestTrace('完全不存在書名');
  assert.equal(emptyTrace.results.length, 0);
  assert.equal(searchBooksModel('完全不存在書名').length, 0);
  assert.match(emptyTrace.steps[3].summary, /找不到符合館藏/);
  assert.deepEqual(emptyTrace.steps[3].highlightLines, [12, 13, 14, 15]);
});

test('Ch 08 待辦事項重構：初始狀態、層級對應與 RefactoredTodo.cs 行號有效', () => {
  const initial = createInitialTodos();
  assert.equal(initial.length, 2);
  assert.equal(initial[0].isDone, true);
  assert.equal(initial[1].isDone, false);

  const refactoredLines = fs
    .readFileSync(
      path.join(ROOT, 'examples/csharp/08-integration-and-refactoring/RefactoredTodo.cs'),
      'utf8'
    )
    .split(/\r?\n/);
  const beforeLines = fs
    .readFileSync(
      path.join(ROOT, 'examples/csharp/08-integration-and-refactoring/MixedTodoBefore.cs'),
      'utf8'
    )
    .split(/\r?\n/);

  for (const key of ['data', 'service', 'view', 'before'] as const) {
    const info = TODO_LAYERS[key];
    const targetLines = info.csharpFile === 'RefactoredTodo.cs' ? refactoredLines : beforeLines;
    for (const ln of info.highlightLines) {
      assert.ok(ln >= 1 && ln <= targetLines.length, `${key} 行號超出範圍: ${ln}`);
    }
  }
});

test('Ch 09 依賴注入入門：建構式替換紀錄實作零修改、驗證失敗攔截與反例對照', () => {
  const diFileLines = fs
    .readFileSync(
      path.join(ROOT, 'examples/csharp/09-dependency-injection/FileProcessingDI.cs'),
      'utf8'
    )
    .split(/\r?\n/);
  const tightFileLines = fs
    .readFileSync(
      path.join(ROOT, 'examples/csharp/09-dependency-injection/TightFileProcessor.cs'),
      'utf8'
    )
    .split(/\r?\n/);

  const consoleRun = simulateFileProcessingDI('constructor-di', 'console', 'orders.csv', 50);
  assert.equal(consoleRun.success, true);
  assert.equal(consoleRun.fileProcessorChanged, false);
  assert.equal(consoleRun.logEntries.length, 2);
  assert.match(consoleRun.logEntries[0], /^\[Console\]/);

  const fileRun = simulateFileProcessingDI('constructor-di', 'file', 'orders.csv', 50);
  assert.equal(fileRun.success, true);
  assert.equal(fileRun.fileProcessorChanged, false);
  assert.match(fileRun.logEntries[0], /AuditFile/);
  assert.match(fileRun.compositionCall, /new FileProcessor\(new FileAuditProcessingLogger\(\)\)/);

  const nullRun = simulateFileProcessingDI('constructor-di', 'null', 'orders.csv', 50);
  assert.equal(nullRun.success, true);
  assert.equal(nullRun.fileProcessorChanged, false);
  assert.equal(nullRun.logEntries.length, 0);

  const invalidRun = simulateFileProcessingDI('constructor-di', 'file', '   ', 0);
  assert.equal(invalidRun.success, false);
  assert.match(invalidRun.logEntries[0], /檔案驗證失敗/);

  const hardcodedSwap = simulateFileProcessingDI('hardcoded', 'file', 'orders.csv', 50);
  assert.equal(hardcodedSwap.fileProcessorChanged, true);
  assert.equal(hardcodedSwap.csharpFile, 'TightFileProcessor.cs');

  for (const ln of consoleRun.highlightLines.concat(fileRun.highlightLines, nullRun.highlightLines)) {
    assert.ok(ln >= 1 && ln <= diFileLines.length);
  }
  for (const ln of hardcodedSwap.highlightLines) {
    assert.ok(ln >= 1 && ln <= tightFileLines.length);
  }
});

test('localStorage 進度封裝：支援無 window 降級與讀寫／重置一致性', () => {
  // Node 環境下無 window 時，應安全降級而不拋例外
  const noWindowProgress = loadUserProgress();
  assert.equal(noWindowProgress.storageAvailable, false);
  assert.deepEqual(noWindowProgress.favorites, []);
  assert.equal(saveUserProgress({ favorites: ['01'], completedIds: [], storageAvailable: true }), false);

  // 模擬瀏覽器 window.localStorage 測試讀寫與重置
  const store = new Map<string, string>();
  (globalThis as unknown as { window?: unknown }).window = {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
    },
  };
  try {
    const saved = saveUserProgress({
      favorites: ['01-classes-and-objects', '09-dependency-injection'],
      completedIds: ['09-dependency-injection'],
      storageAvailable: true,
    });
    assert.equal(saved, true);
    const loaded = loadUserProgress();
    assert.equal(loaded.storageAvailable, true);
    assert.deepEqual(loaded.favorites, ['01-classes-and-objects', '09-dependency-injection']);
    assert.deepEqual(loaded.completedIds, ['09-dependency-injection']);

    const reset = resetUserProgress();
    assert.deepEqual(reset.favorites, []);
    assert.deepEqual(reset.completedIds, []);
  } finally {
    delete (globalThis as unknown as { window?: unknown }).window;
  }
});

test('Wiki 9 章結構、ID 唯一性、來源引用、互動登錄與簡報同步完整性', () => {
  const conceptsDir = path.join(ROOT, 'wiki/concepts');
  const files = fs.readdirSync(conceptsDir).filter((f) => f.endsWith('.md')).sort();
  assert.equal(files.length, 9, '目前應包含第 01 至 09 章共 9 篇教材');

  const registry = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'sources/registry.json'), 'utf8')
  ) as { sources: Array<{ id: string; status: string }> };
  const ingestedIds = new Set(
    registry.sources.filter((s) => s.status === 'ingested').map((s) => s.id)
  );
  const demoRegText = fs.readFileSync(path.join(ROOT, 'src/interactive/registry.ts'), 'utf8');
  const diagramText = fs.readFileSync(path.join(ROOT, 'src/components/DiagramViewer.tsx'), 'utf8');

  const requiredSections = [
    '問題情境',
    '學習目標',
    '觀念圖解',
    'C# 範例',
    '預期結果',
    '修改需求的比較',
    '常見誤解',
    '小練習與解析',
    '相關概念及資料來源',
  ];

  const docs = files.map((file) => {
    const raw = fs.readFileSync(path.join(conceptsDir, file), 'utf8');
    return parseConceptDocument(raw, file.replace(/\.md$/, ''));
  });

  const ids = new Set(docs.map((d) => d.metadata.id));
  const slugs = new Set(docs.map((d) => d.metadata.slug));
  const orders = new Set(docs.map((d) => d.metadata.order));
  assert.equal(ids.size, 9);
  assert.equal(slugs.size, 9);
  assert.equal(orders.size, 9);

  for (const doc of docs) {
    const m = doc.metadata;
    assert.ok(m.title && m.subtitle && m.summary);
    assert.equal(m.status, 'verified');
    assert.deepEqual(
      doc.sections.map((s) => s.title),
      requiredSections,
      `${m.id} 九大章節順序或標題不一致`
    );

    assert.ok(m.sourceIds.length > 0);
    for (const sid of m.sourceIds) {
      assert.ok(ingestedIds.has(sid), `${m.id} 引用了非 ingested 來源 ${sid}`);
    }
    for (const rid of m.relatedIds) {
      assert.ok(ids.has(rid), `${m.id} 的 relatedId ${rid} 不存在`);
    }
    for (const pid of m.prerequisites) {
      assert.ok(ids.has(pid), `${m.id} 的 prerequisite ${pid} 不存在`);
    }
    for (const eid of m.exampleIds) {
      assert.ok(
        fs.existsSync(path.join(ROOT, 'examples/csharp', eid)),
        `${m.id} 缺少範例檔 ${eid}`
      );
    }

    assert.ok(m.slideExampleId && m.slideLineRange);
    const slideExPath = path.join(ROOT, 'examples/csharp', m.slideExampleId);
    assert.ok(fs.existsSync(slideExPath), `缺少 slideExampleId ${m.slideExampleId}`);
    const rangeMatch = m.slideLineRange.match(/^(\d+)-(\d+)$/);
    assert.ok(rangeMatch, `${m.id} slideLineRange 格式錯誤`);
    const totalLines = fs.readFileSync(slideExPath, 'utf8').split(/\r?\n/).length;
    const start = Number(rangeMatch[1]);
    const end = Number(rangeMatch[2]);
    assert.ok(start >= 1 && end <= totalLines && start <= end);

    assert.ok(m.demoId);
    assert.ok(demoRegText.includes(`'${m.demoId}'`), `${m.demoId} 未登錄於 registry.ts`);
    assert.ok(diagramText.includes(`'${m.demoId}'`), `${m.demoId} 未定義於 DiagramViewer.tsx`);
  }

  // 模擬 KnowledgeBasePage 搜尋 9 章（包含新擴充之依賴注入）
  const diHits = docs.filter((d) =>
    [d.metadata.title, d.metadata.subtitle, d.metadata.summary, ...d.metadata.tags]
      .join(' ')
      .toLowerCase()
      .includes('依賴注入')
  );
  assert.ok(diHits.some((d) => d.metadata.id === '09-dependency-injection'));
});

test('GitHub Pages 相對路徑與生成版 HTML 簡報（23 頁）完整性', () => {
  const viteConfig = fs.readFileSync(path.join(ROOT, 'vite.config.ts'), 'utf8');
  assert.match(viteConfig, /base:\s*['"]\.\/['"]/);

  const appTsx = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf8');
  assert.match(appTsx, /HashRouter/);

  const slidesPath = path.join(ROOT, 'public/slides.html');
  assert.ok(fs.existsSync(slidesPath), 'public/slides.html 不存在');
  const html = fs.readFileSync(slidesPath, 'utf8');
  const slideArticles = html.match(/<article class="slide/g) ?? [];
  assert.equal(slideArticles.length, 23, '加入第 09 章後簡報應為 23 頁');
  assert.ok(html.includes('@media print'));
  assert.ok(html.includes('manual-copy-box'));
  assert.ok(html.includes('focus-mode'));
  assert.ok(html.includes('./#/wiki/dependency-injection'));

  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch);
  assert.doesNotThrow(() => new Function(scriptMatch[1]));
});
