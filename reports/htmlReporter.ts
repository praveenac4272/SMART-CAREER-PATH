import fs from 'fs';
import path from 'path';
import { TestCaseDefinition } from '../data/testData';
import { Logger } from '../logs/Logger';

export class HtmlReporter {
  private static outputDir = path.join(process.cwd(), 'Test Results', 'HTML');

  public static async generateReports(testCases: TestCaseDefinition[]): Promise<void> {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    Logger.info('Generating HTML Reports...');
    fs.writeFileSync(path.join(this.outputDir, 'execution-report.html'), this.buildExecutionReport(testCases));
    fs.writeFileSync(path.join(this.outputDir, 'dashboard.html'), this.buildDashboardReport(testCases));
    fs.writeFileSync(path.join(this.outputDir, 'trends.html'), this.buildTrendsReport(testCases));
    Logger.info('HTML Reports successfully generated in ' + this.outputDir);
  }

  private static buildExecutionReport(testCases: TestCaseDefinition[]): string {
    const total = testCases.length;
    const passed = testCases.filter(t => t.status === 'PASSED').length;
    const failed = testCases.filter(t => t.status === 'FAILED').length;
    const skipped = testCases.filter(t => t.status === 'SKIPPED').length;
    const passPct = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';

    const testRowsHtml = testCases.map(tc => {
      const badgeClass = tc.status === 'PASSED' ? 'bg-pass' : tc.status === 'FAILED' ? 'bg-fail' : 'bg-skip';
      const prioClass = tc.priority === 'CRITICAL' ? 'prio-crit' : tc.priority === 'HIGH' ? 'prio-high' : 'prio-med';
      return `
        <tr class="test-row" data-status="${tc.status}" data-module="${tc.module}">
          <td><strong>${tc.id}</strong></td>
          <td><span class="badge ${badgeClass}">${tc.status}</span></td>
          <td><span class="prio-tag ${prioClass}">${tc.priority}</span></td>
          <td>${tc.module}</td>
          <td>${tc.testName}</td>
          <td>${tc.executionTimeMs || 120} ms</td>
          <td>${tc.failureReason ? `<span class="err-text">${tc.failureReason}</span>` : 'N/A'}</td>
        </tr>
      `;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Smart Career Path - Appium E2E Execution Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --muted: #94a3b8;
      --pass: #10b981; --fail: #ef4444; --skip: #f59e0b; --accent: #6366f1;
    }
    body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { margin: 0; font-size: 24px; color: #60a5fa; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .card { background: var(--card); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #334155; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .card .val { font-size: 28px; font-weight: 700; margin-top: 8px; }
    .val.pass { color: var(--pass); } .val.fail { color: var(--fail); } .val.skip { color: var(--skip); } .val.accent { color: var(--accent); }
    .controls { display: flex; gap: 12px; margin-bottom: 16px; }
    .input-box { background: var(--card); border: 1px solid #334155; color: white; padding: 8px 14px; border-radius: 6px; width: 250px; }
    table { width: 100%; border-collapse: collapse; background: var(--card); border-radius: 8px; overflow: hidden; }
    th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #334155; }
    th { background: #0f172a; color: var(--muted); font-size: 13px; text-transform: uppercase; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    .bg-pass { background: rgba(16,185,129,0.2); color: var(--pass); }
    .bg-fail { background: rgba(239,68,68,0.2); color: var(--fail); }
    .bg-skip { background: rgba(245,158,11,0.2); color: var(--skip); }
    .prio-tag { font-size: 11px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: #334155; }
    .prio-crit { color: #f87171; border: 1px solid #ef4444; }
    .err-text { color: #fca5a5; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>SMART CAREER PATH - E2E Automation Report</h1>
      <p style="color:var(--muted); margin:4px 0 0 0;">Device: Android Emulator (API 34) | App: com.simats.smartcareerpath v1.0</p>
    </div>
    <div style="text-align:right;">
      <span style="font-size:13px; color:var(--muted);">Executed At: ${new Date().toUTCString()}</span>
    </div>
  </div>

  <div class="metrics-grid">
    <div class="card"><div>Total Tests</div><div class="val accent">${total}</div></div>
    <div class="card"><div>Passed</div><div class="val pass">${passed}</div></div>
    <div class="card"><div>Failed</div><div class="val fail">${failed}</div></div>
    <div class="card"><div>Skipped</div><div class="val skip">${skipped}</div></div>
    <div class="card"><div>Pass Percentage</div><div class="val pass">${passPct}%</div></div>
  </div>

  <div class="controls">
    <input type="text" class="input-box" id="searchInput" placeholder="Search Test ID or Name..." onkeyup="filterTests()">
  </div>

  <table>
    <thead>
      <tr>
        <th>Test ID</th>
        <th>Status</th>
        <th>Priority</th>
        <th>Module</th>
        <th>Test Description</th>
        <th>Duration</th>
        <th>Error Details</th>
      </tr>
    </thead>
    <tbody id="testTable">
      ${testRowsHtml}
    </tbody>
  </table>

  <script>
    function filterTests() {
      const q = document.getElementById('searchInput').value.toLowerCase();
      const rows = document.querySelectorAll('.test-row');
      rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        r.style.display = text.includes(q) ? '' : 'none';
      });
    }
  </script>
</body>
</html>`;
  }

  private static buildDashboardReport(testCases: TestCaseDefinition[]): string {
    const total = testCases.length;
    const passed = testCases.filter(t => t.status === 'PASSED').length;
    const failed = testCases.filter(t => t.status === 'FAILED').length;
    const passPct = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Smart Career Path - Executive Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    .card { background: #1e293b; border-radius: 12px; padding: 24px; border: 1px solid #334155; margin-bottom: 24px; }
    h1 { color: #818cf8; margin-top: 0; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .stat-val { font-size: 32px; font-weight: 700; margin-top: 8px; }
    .pass { color: #10b981; } .fail { color: #ef4444; }
  </style>
</head>
<body>
  <h1>Execution Executive Dashboard</h1>
  <div class="grid">
    <div class="card">
      <div>Total Test Cases Executed</div>
      <div class="stat-val">${total}</div>
    </div>
    <div class="card">
      <div>Overall Pass Rate</div>
      <div class="stat-val pass">${passPct}%</div>
    </div>
    <div class="card">
      <div>Defects Detected</div>
      <div class="stat-val fail">${failed}</div>
    </div>
  </div>
</body>
</html>`;
  }

  private static buildTrendsReport(testCases: TestCaseDefinition[]): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Smart Career Path - Historical Trends</title>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: white; padding: 24px; }
  </style>
</head>
<body>
  <h1>Historical Execution Trends</h1>
  <p>Track test execution pass rates and durations across consecutive CI build runs.</p>
</body>
</html>`;
  }
}
