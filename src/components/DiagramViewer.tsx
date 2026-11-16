import React from 'react';

interface DiagramViewerProps {
  demoId: string | null;
}

export function DiagramViewer({ demoId }: DiagramViewerProps) {
  if (demoId === 'student-roster') {
    return (
      <figure className="my-5 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
          <figcaption className="text-sm font-semibold text-[#1F2937]">
            圖解：一份 Student 類別藍圖與兩個獨立物件實例
          </figcaption>
          <span className="text-xs text-[#4B5563]">藍圖定義結構 · new 配置獨立狀態</span>
        </div>

        <div className="grid gap-5 md:grid-cols-12 md:items-center">
          <div className="rounded-lg border border-[#3458A4]/40 bg-[#F8FAFC] p-4 md:col-span-5">
            <div className="text-xs font-semibold text-[#3458A4]">類別藍圖（Class）</div>
            <div className="mt-1 font-mono text-base font-semibold text-[#111827]">
              class Student
            </div>
            <div className="mt-3 space-y-1.5 border-t border-[#E5E7EB] pt-3 font-mono text-xs text-[#374151]">
              <div>private int _score（欄位）</div>
              <div>public string StudentId（屬性）</div>
              <div>public string Name（屬性）</div>
            </div>
            <div className="mt-3 space-y-1 border-t border-[#E5E7EB] pt-3 font-mono text-xs text-[#247C74]">
              <div>+ Student(id, name, score)（建構式）</div>
              <div>+ UpdateScore(newScore)（方法）</div>
              <div>+ GetSummary()（方法）</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 text-center text-xs font-medium text-[#4B5563] md:col-span-2">
            <span className="hidden md:inline">new Student(...) →</span>
            <span className="md:hidden">↓ new Student(...)</span>
            <span className="text-[#3458A4]">各自配置記憶體</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:col-span-5 md:grid-cols-1">
            <div className="rounded-lg border border-[#247C74]/40 bg-[#F8FAFC] p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#247C74]">物件實例 A（studentA）</span>
                <span className="font-mono text-[#4B5563]">Instance #01</span>
              </div>
              <div className="mt-2 font-mono text-xs text-[#1F2937] tabular-nums">
                StudentId = &quot;S101&quot; · Name = &quot;林小安&quot; · _score = 78
              </div>
            </div>
            <div className="rounded-lg border border-[#247C74]/40 bg-[#F8FAFC] p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#247C74]">物件實例 B（studentB）</span>
                <span className="font-mono text-[#4B5563]">Instance #02</span>
              </div>
              <div className="mt-2 font-mono text-xs text-[#1F2937] tabular-nums">
                StudentId = &quot;S102&quot; · Name = &quot;陳以樂&quot; · _score = 54 → 82
              </div>
            </div>
          </div>
        </div>
      </figure>
    );
  }

  if (demoId === 'bank-account') {
    return (
      <figure className="my-5 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
          <figcaption className="text-sm font-semibold text-[#1F2937]">
            圖解：封裝邊界如何保護內部餘額不被非法請求破壞
          </figcaption>
          <span className="text-xs text-[#4B5563]">外部禁止直寫 _balance · 必須經過方法檢查</span>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:items-stretch">
          <div className="flex flex-col justify-between rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4">
            <div>
              <div className="text-xs font-semibold text-[#4B5563]">1. 外部呼叫端</div>
              <div className="mt-1 font-mono text-sm font-semibold text-[#111827]">Program.cs</div>
              <ul className="mt-3 space-y-2 font-mono text-xs text-[#374151]">
                <li className="text-[#1F6E58]">✓ account.Deposit(250.50m)</li>
                <li className="text-[#B91C1C]">✕ account.Deposit(-100m)</li>
                <li className="text-[#B91C1C]">✕ account._balance = -500</li>
              </ul>
            </div>
            <div className="mt-3 border-t border-[#E5E7EB] pt-2 text-xs text-[#4B5563]">
              編譯期阻擋直接存取 private 欄位
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg border border-[#3458A4]/40 bg-[#F8FAFC] p-4">
            <div>
              <div className="text-xs font-semibold text-[#3458A4]">2. 公開把關窗口（public）</div>
              <div className="mt-1 font-mono text-sm font-semibold text-[#111827]">
                Deposit() / Withdraw()
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-[#374151]">
                <li>規則 A：金額必須大於 0</li>
                <li>規則 B：提款不可大於目前餘額</li>
                <li>失敗：立即攔截並回傳原因，不改狀態</li>
              </ul>
            </div>
            <div className="mt-3 border-t border-[#E5E7EB] pt-2 text-xs text-[#3458A4]">
              只有規則全部通過才進入內部異動
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg border border-[#247C74]/40 bg-[#F8FAFC] p-4">
            <div>
              <div className="text-xs font-semibold text-[#247C74]">3. 受保護狀態（private）</div>
              <div className="mt-1 font-mono text-sm font-semibold text-[#111827]">
                private decimal _balance
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#374151]">
                外部只能透過唯讀屬性 <code className="font-mono">Balance</code> 讀取數值，確保餘額不變量永遠成立。
              </p>
            </div>
            <div className="mt-3 border-t border-[#E5E7EB] pt-2 font-mono text-xs text-[#247C74]">
              Invariant：_balance &gt;= 0
            </div>
          </div>
        </div>
      </figure>
    );
  }

  if (demoId === 'vehicle-engine') {
    return (
      <figure className="my-5 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <figcaption className="mb-4 border-b border-[#E5E7EB] pb-3 text-sm font-semibold text-[#1F2937]">
          圖解：繼承（is-a）固定型別樹 vs 組合（has-a）可抽換零件
        </figcaption>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-xs">
            <div className="font-semibold text-[#3458A4]">繼承（Inheritance：is-a）</div>
            <div className="mt-2 font-mono text-[#111827]">VehicleBase ← SedanByInheritance</div>
            <p className="mt-2 leading-relaxed text-[#374151]">
              子類別編譯期就綁定單一父類別，若動力組合多樣化，類別階層容易快速膨脹。
            </p>
          </div>
          <div className="rounded-lg border border-[#247C74]/40 bg-[#F8FAFC] p-4 text-xs">
            <div className="font-semibold text-[#247C74]">組合（Composition：has-a）</div>
            <div className="mt-2 font-mono text-[#111827]">
              CarWithComposition ◆── IPowerUnit（PetrolEngine / ElectricMotor）
            </div>
            <p className="mt-2 leading-relaxed text-[#374151]">
              汽車「持有」動力介面而非寫死動力類別，執行期即可透過 <code className="font-mono">SwapEngine()</code> 抽換實作。
            </p>
          </div>
        </div>
      </figure>
    );
  }

  if (demoId === 'animal-chorus') {
    return (
      <figure className="my-5 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <figcaption className="mb-4 border-b border-[#E5E7EB] pb-3 text-sm font-semibold text-[#1F2937]">
          圖解：宣告型別相同（Animal），執行期依實際物件派發對應 override
        </figcaption>
        <div className="grid gap-3 md:grid-cols-4 text-xs">
          <div className="rounded-lg border border-[#3458A4]/40 bg-[#F8FAFC] p-3.5">
            <div className="font-semibold text-[#3458A4]">共同呼叫入口</div>
            <div className="mt-1 font-mono text-[#111827]">foreach (Animal a in list)</div>
            <div className="mt-2 text-[#4B5563]">呼叫 a.Speak()</div>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-3.5">
            <div className="font-mono font-semibold text-[#111827]">Dog（override）</div>
            <div className="mt-2 text-[#247C74]">執行期派發 → 「汪汪！」</div>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-3.5">
            <div className="font-mono font-semibold text-[#111827]">Cat（override）</div>
            <div className="mt-2 text-[#247C74]">執行期派發 → 「喵～」</div>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-3.5">
            <div className="font-mono font-semibold text-[#111827]">Duck（override）</div>
            <div className="mt-2 text-[#247C74]">執行期派發 → 「呱呱！」</div>
          </div>
        </div>
      </figure>
    );
  }

  if (demoId === 'shape-canvas') {
    return (
      <figure className="my-5 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <figcaption className="mb-4 border-b border-[#E5E7EB] pb-3 text-sm font-semibold text-[#1F2937]">
          圖解：抽象類別（共用狀態家族）與介面（跨類別能力契約）並存
        </figcaption>
        <div className="grid gap-4 md:grid-cols-2 text-xs">
          <div className="rounded-lg border border-[#3458A4]/40 bg-[#F8FAFC] p-4">
            <div className="font-semibold text-[#3458A4]">abstract class Shape（單一家族繼承）</div>
            <div className="mt-1 font-mono text-[#111827]">保有 Name、Color 欄位與 protected 建構式</div>
            <div className="mt-2 text-[#374151]">Circle 繼承 Shape，實作 GetArea() 面積規則。</div>
          </div>
          <div className="rounded-lg border border-[#247C74]/40 bg-[#F8FAFC] p-4">
            <div className="font-semibold text-[#247C74]">interface IDrawable（跨階層能力）</div>
            <div className="mt-1 font-mono text-[#111827]">無實例欄位；現代 C# 支援預設成員實作</div>
            <div className="mt-2 text-[#374151]">Circle 與非圖形的 TextLabel 都能放進 List&lt;IDrawable&gt; 繪製。</div>
          </div>
        </div>
      </figure>
    );
  }

  if (demoId === 'order-notifier') {
    return (
      <figure className="my-5 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <figcaption className="mb-4 border-b border-[#E5E7EB] pb-3 text-sm font-semibold text-[#1F2937]">
          圖解：高內聚分工與依賴反轉（OrderProcessor 依賴 INotifier 介面而非 Email 實作）
        </figcaption>
        <div className="grid gap-3 md:grid-cols-3 text-xs">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
            <div className="font-mono font-semibold text-[#111827]">PriceCalculator</div>
            <div className="mt-1 text-[#374151]">單一職責：計算稅額與總價</div>
          </div>
          <div className="rounded-lg border border-[#3458A4]/40 bg-[#F8FAFC] p-3.5">
            <div className="font-mono font-semibold text-[#3458A4]">OrderProcessor</div>
            <div className="mt-1 text-[#374151]">協調計算並呼叫介面 INotifier.Notify()</div>
          </div>
          <div className="rounded-lg border border-[#247C74]/40 bg-[#F8FAFC] p-3.5">
            <div className="font-mono font-semibold text-[#247C74]">INotifier ← Email / SMS</div>
            <div className="mt-1 text-[#374151]">外掛可替換管道，不改動 OrderProcessor</div>
          </div>
        </div>
      </figure>
    );
  }

  if (demoId === 'book-mvc-flow') {
    return (
      <figure className="my-5 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <figcaption className="mb-4 border-b border-[#E5E7EB] pb-3 text-sm font-semibold text-[#1F2937]">
          圖解：ASP.NET Core MVC 網頁請求與三層依賴方向
        </figcaption>
        <div className="grid gap-3 md:grid-cols-4 text-xs">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
            <div className="font-semibold text-[#111827]">1. HTTP Request</div>
            <div className="mt-1 font-mono text-[#4B5563]">GET /Books/Index?keyword=MVC</div>
          </div>
          <div className="rounded-lg border border-[#3458A4]/40 bg-[#F8FAFC] p-3.5">
            <div className="font-semibold text-[#3458A4]">2. Controller</div>
            <div className="mt-1 text-[#374151]">接收參數、委派 Model、選擇 View</div>
          </div>
          <div className="rounded-lg border border-[#247C74]/40 bg-[#F8FAFC] p-3.5">
            <div className="font-semibold text-[#247C74]">3. Model（獨立核心）</div>
            <div className="mt-1 text-[#374151]">執行查詢規則，不依賴 Controller/View</div>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
            <div className="font-semibold text-[#111827]">4. Razor View</div>
            <div className="mt-1 text-[#374151]">讀取 Model 產生 HTML 回應</div>
          </div>
        </div>
      </figure>
    );
  }

  if (demoId === 'todo-refactor') {
    return (
      <figure className="my-5 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <figcaption className="mb-4 border-b border-[#E5E7EB] pb-3 text-sm font-semibold text-[#1F2937]">
          圖解：將單檔混合腳本整理為「資料與規則 / 操作協調 / 畫面呈現」三層分工
        </figcaption>
        <div className="grid gap-3 md:grid-cols-3 text-xs">
          <div className="rounded-lg border border-[#247C74]/40 bg-[#F8FAFC] p-3.5">
            <div className="font-mono font-semibold text-[#247C74]">TodoItem（資料與規則）</div>
            <div className="mt-1 text-[#374151]">封裝標題檢核、完成切換與 DueDate</div>
          </div>
          <div className="rounded-lg border border-[#3458A4]/40 bg-[#F8FAFC] p-3.5">
            <div className="font-mono font-semibold text-[#3458A4]">TodoService（操作協調）</div>
            <div className="mt-1 text-[#374151]">管理集合與 Add / Toggle / Remove</div>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
            <div className="font-mono font-semibold text-[#111827]">TodoConsoleView（畫面呈現）</div>
            <div className="mt-1 text-[#374151]">只負責輸出格式，可輕鬆替換成網頁畫面</div>
          </div>
        </div>
      </figure>
    );
  }

  if (demoId === 'file-processor-di') {
    return (
      <figure className="my-5 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <figcaption className="mb-4 border-b border-[#E5E7EB] pb-3 text-sm font-semibold text-[#1F2937]">
          圖解：依賴反轉（面向 IProcessingLogger）與依賴注入（外部建構式傳入實例）
        </figcaption>
        <div className="grid gap-3 md:grid-cols-3 text-xs">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
            <div className="font-mono font-semibold text-[#111827]">組裝端（Program.cs）</div>
            <div className="mt-1 text-[#374151]">
              DI（提供方式）：決定建立哪個實例並傳入{' '}
              <code className="font-mono">new FileProcessor(logger)</code>
            </div>
          </div>
          <div className="rounded-lg border border-[#3458A4]/40 bg-[#F8FAFC] p-3.5">
            <div className="font-mono font-semibold text-[#3458A4]">
              FileProcessor(IProcessingLogger)
            </div>
            <div className="mt-1 text-[#374151]">
              DIP（設計原則）：只依賴介面契約，內部不自己 <code className="font-mono">new</code>
            </div>
          </div>
          <div className="rounded-lg border border-[#247C74]/40 bg-[#F8FAFC] p-3.5">
            <div className="font-mono font-semibold text-[#247C74]">
              Console / FileAudit / SilentNull
            </div>
            <div className="mt-1 text-[#374151]">
              可隨時抽換的具體紀錄實作，核心流程零修改
            </div>
          </div>
        </div>
      </figure>
    );
  }

  return null;
}
