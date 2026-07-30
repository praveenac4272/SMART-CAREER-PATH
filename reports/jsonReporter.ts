import fs from 'fs';
import path from 'path';
import { TestCaseDefinition } from '../data/testData';

export class JsonReporter {
  private static outputDir = path.join(process.cwd(), 'Test Results', 'JSON');

  public static async generateReport(testCases: TestCaseDefinition[]): Promise<void> {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    const total = testCases.length;
    const passed = testCases.filter(t => t.status === 'PASSED').length;
    const failed = testCases.filter(t => t.status === 'FAILED').length;
    const skipped = testCases.filter(t => t.status === 'SKIPPED').length;
    const blocked = testCases.filter(t => t.status === 'BLOCKED').length;

    const payload = {
      summary: {
        total,
        executed: passed + failed,
        passed,
        failed,
        skipped,
        blocked,
        passPercentage: total > 0 ? parseFloat(((passed / total) * 100).toFixed(2)) : 0,
        timestamp: new Date().toISOString()
      },
      testCases
    };

    fs.writeFileSync(path.join(this.outputDir, 'execution-results.json'), JSON.stringify(payload, null, 2));
  }
}
