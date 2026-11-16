export type DiArchitectureMode = 'hardcoded' | 'constructor-di';
export type LoggerImplKind = 'console' | 'file' | 'null';

export interface FileProcessOutcome {
  success: boolean;
  fileName: string;
  lineCount: number;
  mode: DiArchitectureMode;
  loggerImpl: LoggerImplKind;
  loggerClassName: string;
  csharpFile: 'TightFileProcessor.cs' | 'FileProcessingDI.cs';
  highlightLines: number[];
  compositionCall: string;
  fileProcessorChanged: boolean;
  logEntries: string[];
  summary: string;
  dipVsDiNote: string;
}

export interface LoggerOptionMeta {
  id: LoggerImplKind;
  className: string;
  label: string;
  description: string;
  lineRange: number[];
}

export const LOGGER_OPTIONS: Record<LoggerImplKind, LoggerOptionMeta> = {
  console: {
    id: 'console',
    className: 'ConsoleProcessingLogger',
    label: '主控台紀錄（ConsoleProcessingLogger）',
    description: '將處理訊息直接輸出至主控台，適合本機開發與即時觀察。',
    lineRange: [13, 14, 15, 16, 17, 18, 19],
  },
  file: {
    id: 'file',
    className: 'FileAuditProcessingLogger',
    label: '稽核檔案紀錄（FileAuditProcessingLogger）',
    description: '將處理事件寫入稽核清單／檔案緩衝區，適合正式環境留存紀錄。',
    lineRange: [22, 23, 24, 25, 27, 29, 30, 31, 32],
  },
  null: {
    id: 'null',
    className: 'SilentNullLogger',
    label: '靜音／測試替身（SilentNullLogger）',
    description: '實作 IProcessingLogger 但刻意不輸出任何內容，適合單元測試或靜音模式。',
    lineRange: [36, 37, 38, 39, 40, 41, 42],
  },
};

export function simulateFileProcessingDI(
  mode: DiArchitectureMode,
  loggerImpl: LoggerImplKind,
  fileName: string,
  lineCount: number
): FileProcessOutcome {
  const trimmedName = fileName.trim();
  const validInput = trimmedName.length > 0 && Number.isFinite(lineCount) && lineCount > 0;

  if (mode === 'hardcoded') {
    const rawLogs = validInput
      ? [
          `[Console] 開始處理 ${trimmedName}（共 ${lineCount} 行）`,
          `[Console] 完成處理 ${trimmedName}，已通過格式檢查。`,
        ]
      : ['[Console] 檔案驗證失敗：檔名不可空白，且行數必須大於 0。'];

    return {
      success: validInput,
      fileName: trimmedName || '(空白)',
      lineCount,
      mode,
      loggerImpl: 'console',
      loggerClassName: 'ConsoleAuditLogger（寫死在類別內）',
      csharpFile: 'TightFileProcessor.cs',
      highlightLines: [11, 13, 15, 17, 19, 23, 24],
      compositionCall: 'var processor = new TightFileProcessor(); // 外部無法傳入其他紀錄器',
      fileProcessorChanged: loggerImpl !== 'console',
      logEntries: rawLogs,
      summary:
        loggerImpl === 'console'
          ? '目前勉強能印出主控台訊息，但 TightFileProcessor 第 13 行直接寫死 new ConsoleAuditLogger()。'
          : `欲改用 ${LOGGER_OPTIONS[loggerImpl].className} 時失敗或被迫返工：TightFileProcessor 無法從外部注入，必須直接修改 TightFileProcessor.cs 原始碼。`,
      dipVsDiNote:
        '此寫法既違反依賴反轉（直接綁死具體類別），也缺乏依賴注入（相依物件在類別內部自行 new）。',
    };
  }

  const loggerMeta = LOGGER_OPTIONS[loggerImpl];
  const rawMessageStart = `開始處理 ${trimmedName}（共 ${lineCount} 行）`;
  const rawMessageDone = `完成處理 ${trimmedName}，已通過格式檢查。`;
  const rawMessageErr = '檔案驗證失敗：檔名不可空白，且行數必須大於 0。';

  let logEntries: string[] = [];
  if (loggerImpl === 'console') {
    logEntries = validInput
      ? [`[Console] ${rawMessageStart}`, `[Console] ${rawMessageDone}`]
      : [`[Console] ${rawMessageErr}`];
  } else if (loggerImpl === 'file') {
    logEntries = validInput
      ? [
          `已寫入稽核紀錄檔：[AuditFile] ${rawMessageStart}`,
          `已寫入稽核紀錄檔：[AuditFile] ${rawMessageDone}`,
        ]
      : [`已寫入稽核紀錄檔：[AuditFile] ${rawMessageErr}`];
  } else {
    logEntries = [];
  }

  const constructorAndProcessLines = [7, 8, 9, 45, 47, 49, 51, 56, 58, 62, 63];

  return {
    success: validInput,
    fileName: trimmedName || '(空白)',
    lineCount,
    mode,
    loggerImpl,
    loggerClassName: loggerMeta.className,
    csharpFile: 'FileProcessingDI.cs',
    highlightLines: Array.from(new Set([...constructorAndProcessLines, ...loggerMeta.lineRange])).sort(
      (a, b) => a - b
    ),
    compositionCall: `var processor = new FileProcessor(new ${loggerMeta.className}());`,
    fileProcessorChanged: false,
    logEntries,
    summary: validInput
      ? `FileProcessor 透過建構式接收 ${loggerMeta.className} 並成功處理 ${trimmedName}；FileProcessor 本身程式碼零修改。`
      : `檔案驗證未通過（檔名不可空白且行數須 > 0），由注入的 ${loggerMeta.className} 負責記錄失敗訊息。`,
    dipVsDiNote:
      'DIP（原則）：FileProcessor 只依賴 IProcessingLogger 介面；DI（技巧）：實際要哪一個 Logger 實例由外部建構式傳入。',
  };
}
