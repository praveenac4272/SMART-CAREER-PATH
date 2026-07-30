import fs from 'fs';
import path from 'path';
import { TestCaseDefinition } from '../data/testData';

export class MarkdownReporter {
  private static outputDir = path.join(process.cwd(), 'Test Results', 'Summary');

  public static async generateReport(testCases: TestCaseDefinition[]): Promise<string> {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    const total = testCases.length;
    const passed = testCases.filter(t => t.status === 'PASSED').length;
    const failed = testCases.filter(t => t.status === 'FAILED').length;
    const skipped = testCases.filter(t => t.status === 'SKIPPED').length;
    const blocked = testCases.filter(t => t.status === 'BLOCKED').length;
    const passPct = total > 0 ? ((passed / total) * 100).toFixed(2) : '0';

    const passedList = testCases.filter(t => t.status === 'PASSED').slice(0, 10).map(t => `✓ ${t.id} - ${t.testName}`).join('\n');
    const failedList = testCases.filter(t => t.status === 'FAILED').map(t => `✗ ${t.id} - ${t.testName}\n  Reason: ${t.failureReason || 'Assertion mismatch'}`).join('\n');
    const skippedList = testCases.filter(t => t.status === 'SKIPPED' || t.status === 'BLOCKED').slice(0, 10).map(t => `- ${t.id}\n  Reason: Feature Disabled / Dependency Pending`).join('\n');

    const markdown = `# Android Appium E2E Execution Summary

**Build Number:** ${process.env.GITHUB_RUN_NUMBER || 'LOCAL_BUILD'}
**Execution Date:** ${new Date().toUTCString()}
**Git Commit:** ${process.env.GITHUB_SHA || 'LOCAL_HEAD'}
**Branch:** ${process.env.GITHUB_REF_NAME || 'main'}

**APK Version:** 1.0 (debug)
**Device:** Android Emulator (API 34)
**Android Version:** 14.0

### Execution Metrics

- **Total Test Cases:** ${total}
- **Executed:** ${passed + failed}
- **Passed:** ${passed}
- **Failed:** ${failed}
- **Skipped:** ${skipped}
- **Blocked:** ${blocked}

**Pass Percentage:** ${passPct}%
**Fail Percentage:** ${(100 - parseFloat(passPct)).toFixed(2)}%

---

### VALID TEST CASE SUMMARY

#### PASSED TESTS (Sample)
\`\`\`
${passedList || 'None'}
\`\`\`

#### FAILED TESTS
\`\`\`
${failedList || 'None (All tests passed successfully!)'}
\`\`\`

#### SKIPPED TESTS
\`\`\`
${skippedList || 'None'}
\`\`\`
`;

    fs.writeFileSync(path.join(this.outputDir, 'summary.md'), markdown);
    return markdown;
  }
}
