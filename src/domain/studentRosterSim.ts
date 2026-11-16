export interface StudentInstanceState {
  varName: 'studentA' | 'studentB';
  memoryAddr: string;
  studentId: string;
  name: string;
  score: number;
  created: boolean;
}

export interface StudentStepSnapshot {
  stepIndex: number;
  title: string;
  csharpFile: 'Program.cs' | 'Student.cs';
  highlightLines: number[];
  explanation: string;
  consoleLines: string[];
  studentA: StudentInstanceState;
  studentB: StudentInstanceState;
}

export function createInitialStudentState(
  scoreA = 78,
  scoreB = 54,
  updatedScoreB = 82
): StudentStepSnapshot[] {
  const clamp = (val: number) => Math.max(0, Math.min(100, Math.round(val)));
  const sA = clamp(scoreA);
  const sB = clamp(scoreB);
  const sBNext = clamp(updatedScoreB);

  const summary = (id: string, name: string, score: number) =>
    `${id} ${name}｜成績：${score} 分（${score >= 60 ? '及格' : '需加強'}）`;

  const uncreatedA: StudentInstanceState = {
    varName: 'studentA',
    memoryAddr: '尚未配置',
    studentId: '—',
    name: '—',
    score: 0,
    created: false,
  };

  const uncreatedB: StudentInstanceState = {
    varName: 'studentB',
    memoryAddr: '尚未配置',
    studentId: '—',
    name: '—',
    score: 0,
    created: false,
  };

  const createdA: StudentInstanceState = {
    varName: 'studentA',
    memoryAddr: 'Instance #01',
    studentId: 'S101',
    name: '林小安',
    score: sA,
    created: true,
  };

  const createdB: StudentInstanceState = {
    varName: 'studentB',
    memoryAddr: 'Instance #02',
    studentId: 'S102',
    name: '陳以樂',
    score: sB,
    created: true,
  };

  const updatedB: StudentInstanceState = {
    ...createdB,
    score: sBNext,
  };

  return [
    {
      stepIndex: 0,
      title: '初始狀態：僅有 Student 類別藍圖',
      csharpFile: 'Student.cs',
      highlightLines: [3, 4, 5, 6, 7, 8, 9],
      explanation:
        '此時記憶體中只有 Student 類別定義（藍圖），尚未透過 new 建立任何實際學生物件。',
      consoleLines: [],
      studentA: uncreatedA,
      studentB: uncreatedB,
    },
    {
      stepIndex: 1,
      title: '建立第一個物件 studentA（林小安）',
      csharpFile: 'Program.cs',
      highlightLines: [4],
      explanation:
        '呼叫建構式 new Student("S101", "林小安", ...)，配置第一塊獨立記憶體並完成初始化。',
      consoleLines: [],
      studentA: createdA,
      studentB: uncreatedB,
    },
    {
      stepIndex: 2,
      title: '建立第二個物件 studentB（陳以樂）',
      csharpFile: 'Program.cs',
      highlightLines: [5],
      explanation:
        '使用同一份 Student 藍圖建立第二個個體，獲得另一塊互不干擾的狀態空間。',
      consoleLines: [],
      studentA: createdA,
      studentB: createdB,
    },
    {
      stepIndex: 3,
      title: '呼叫兩個物件的 GetSummary() 輸出初始名冊',
      csharpFile: 'Program.cs',
      highlightLines: [7, 8],
      explanation:
        '兩個物件共用 Student 類別的方法邏輯，但各自讀取自己的 _score 與 Name 產生輸出。',
      consoleLines: [summary('S101', '林小安', sA), summary('S102', '陳以樂', sB)],
      studentA: createdA,
      studentB: createdB,
    },
    {
      stepIndex: 4,
      title: '透過 studentB.UpdateScore(...) 只更新陳以樂成績',
      csharpFile: 'Program.cs',
      highlightLines: [10],
      explanation:
        `在合法範圍（0–100）內更新 studentB._score 為 ${sBNext}；studentA 的記憶體資料完全不受影響。`,
      consoleLines: [summary('S101', '林小安', sA), summary('S102', '陳以樂', sB)],
      studentA: createdA,
      studentB: updatedB,
    },
    {
      stepIndex: 5,
      title: '再次輸出名冊，驗證物件彼此獨立',
      csharpFile: 'Program.cs',
      highlightLines: [12, 13, 14],
      explanation:
        `結果顯示林小安仍維持 ${sA} 分，只有陳以樂更新為 ${sBNext} 分，證明相同藍圖下的物件各自保有獨立狀態。`,
      consoleLines: [
        summary('S101', '林小安', sA),
        summary('S102', '陳以樂', sB),
        '更新陳以樂成績後：',
        summary('S101', '林小安', sA),
        summary('S102', '陳以樂', sBNext),
      ],
      studentA: createdA,
      studentB: updatedB,
    },
  ];
}
