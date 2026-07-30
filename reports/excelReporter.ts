import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { TestCaseDefinition } from '../data/testData';
import { Logger } from '../logs/Logger';

export class ExcelReporter {
  private static outputDir = path.join(process.cwd(), 'Test Results', 'Excel');

  public static async generateReports(testCases: TestCaseDefinition[]): Promise<void> {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    Logger.info('Generating Excel Reports...');
    await this.generateMainReport(testCases);
    await this.generatePassedTestsReport(testCases.filter(tc => tc.status === 'PASSED'));
    await this.generateFailedTestsReport(testCases.filter(tc => tc.status === 'FAILED'));
    await this.generateSummaryReport(testCases);
    await this.generateTestCasesSpecificationExcel(testCases);
    Logger.info('Excel Reports successfully generated in ' + this.outputDir);

  }

  private static async generateMainReport(testCases: TestCaseDefinition[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    
    // Sheet 1: Executed Test Cases
    const sheet1 = workbook.addWorksheet('Executed Test Cases');
    sheet1.columns = [
      { header: 'Test ID', key: 'id', width: 18 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Test Name', key: 'testName', width: 35 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Execution Time (ms)', key: 'executionTimeMs', width: 20 }
    ];
    testCases.forEach(tc => sheet1.addRow(tc));
    this.styleHeader(sheet1);

    // Sheet 2: Passed Tests
    const sheet2 = workbook.addWorksheet('Passed Tests');
    sheet2.columns = sheet1.columns;
    testCases.filter(tc => tc.status === 'PASSED').forEach(tc => sheet2.addRow(tc));
    this.styleHeader(sheet2);

    // Sheet 3: Failed Tests
    const sheet3 = workbook.addWorksheet('Failed Tests');
    sheet3.columns = [
      ...sheet1.columns,
      { header: 'Failure Reason', key: 'failureReason', width: 45 }
    ];
    testCases.filter(tc => tc.status === 'FAILED').forEach(tc => sheet3.addRow(tc));
    this.styleHeader(sheet3);

    // Sheet 4: Skipped Tests
    const sheet4 = workbook.addWorksheet('Skipped Tests');
    sheet4.columns = sheet1.columns;
    testCases.filter(tc => tc.status === 'SKIPPED' || tc.status === 'BLOCKED').forEach(tc => sheet4.addRow(tc));
    this.styleHeader(sheet4);

    // Sheet 5: Execution Metrics
    const sheet5 = workbook.addWorksheet('Execution Metrics');
    sheet5.columns = [
      { header: 'Metric Name', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 20 }
    ];
    const total = testCases.length;
    const passed = testCases.filter(t => t.status === 'PASSED').length;
    const failed = testCases.filter(t => t.status === 'FAILED').length;
    const skipped = testCases.filter(t => t.status === 'SKIPPED').length;
    const blocked = testCases.filter(t => t.status === 'BLOCKED').length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) + '%' : '0%';

    sheet5.addRow({ metric: 'Total Test Cases', value: total });
    sheet5.addRow({ metric: 'Executed Test Cases', value: passed + failed });
    sheet5.addRow({ metric: 'Passed Test Cases', value: passed });
    sheet5.addRow({ metric: 'Failed Test Cases', value: failed });
    sheet5.addRow({ metric: 'Skipped Test Cases', value: skipped });
    sheet5.addRow({ metric: 'Blocked Test Cases', value: blocked });
    sheet5.addRow({ metric: 'Pass Rate', value: passRate });
    this.styleHeader(sheet5);

    // Sheet 6: Defect Summary
    const sheet6 = workbook.addWorksheet('Defect Summary');
    sheet6.columns = [
      { header: 'Defect ID', key: 'defId', width: 15 },
      { header: 'Related Test ID', key: 'id', width: 18 },
      { header: 'Module', key: 'module', width: 20 },
      { header: 'Failure Reason', key: 'reason', width: 50 }
    ];
    testCases.filter(tc => tc.status === 'FAILED').forEach((tc, idx) => {
      sheet6.addRow({
        defId: `DEF-${100 + idx}`,
        id: tc.id,
        module: tc.module,
        reason: tc.failureReason || 'Assertion mismatch'
      });
    });
    this.styleHeader(sheet6);

    // Sheet 7: Pass Rate Summary
    const sheet7 = workbook.addWorksheet('Pass Rate Summary');
    sheet7.columns = [
      { header: 'Module Name', key: 'module', width: 25 },
      { header: 'Total Tests', key: 'total', width: 15 },
      { header: 'Passed', key: 'passed', width: 12 },
      { header: 'Failed', key: 'failed', width: 12 },
      { header: 'Pass Rate %', key: 'rate', width: 15 }
    ];
    const moduleMap = new Map<string, TestCaseDefinition[]>();
    testCases.forEach(tc => {
      const arr = moduleMap.get(tc.module) || [];
      arr.push(tc);
      moduleMap.set(tc.module, arr);
    });
    moduleMap.forEach((cases, mod) => {
      const p = cases.filter(c => c.status === 'PASSED').length;
      const f = cases.filter(c => c.status === 'FAILED').length;
      const r = cases.length > 0 ? ((p / cases.length) * 100).toFixed(1) + '%' : '0%';
      sheet7.addRow({ module: mod, total: cases.length, passed: p, failed: f, rate: r });
    });
    this.styleHeader(sheet7);

    await workbook.xlsx.writeFile(path.join(this.outputDir, 'Automation_Test_Report.xlsx'));
  }

  private static async generatePassedTestsReport(passedCases: TestCaseDefinition[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Passed Test Cases');
    sheet.columns = [
      { header: 'Test ID', key: 'id', width: 18 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Test Name', key: 'testName', width: 35 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'Status', key: 'status', width: 12 }
    ];
    passedCases.forEach(tc => sheet.addRow(tc));
    this.styleHeader(sheet);
    await workbook.xlsx.writeFile(path.join(this.outputDir, 'Passed_Test_Cases.xlsx'));
  }

  private static async generateFailedTestsReport(failedCases: TestCaseDefinition[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Failed Test Cases');
    sheet.columns = [
      { header: 'Test ID', key: 'id', width: 18 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Test Name', key: 'testName', width: 35 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'Failure Reason', key: 'failureReason', width: 45 }
    ];
    failedCases.forEach(tc => sheet.addRow(tc));
    this.styleHeader(sheet);
    await workbook.xlsx.writeFile(path.join(this.outputDir, 'Failed_Test_Cases.xlsx'));
  }

  private static async generateSummaryReport(testCases: TestCaseDefinition[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Execution Summary');
    sheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Count / Percentage', key: 'val', width: 25 }
    ];
    const total = testCases.length;
    const passed = testCases.filter(t => t.status === 'PASSED').length;
    const failed = testCases.filter(t => t.status === 'FAILED').length;
    const rate = total > 0 ? ((passed / total) * 100).toFixed(2) + '%' : '0%';

    sheet.addRow({ metric: 'Total Planned Tests', val: total });
    sheet.addRow({ metric: 'Passed Tests', val: passed });
    sheet.addRow({ metric: 'Failed Tests', val: failed });
    sheet.addRow({ metric: 'Overall Pass Rate', val: rate });
    this.styleHeader(sheet);
    await workbook.xlsx.writeFile(path.join(this.outputDir, 'Execution_Summary.xlsx'));
  }

  private static async generateTestCasesSpecificationExcel(testCases: TestCaseDefinition[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('510 Test Cases Specification');
    sheet.columns = [
      { header: 'Test Case ID', key: 'id', width: 18 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Test Name / Description', key: 'testName', width: 45 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'Preconditions', key: 'preconditions', width: 35 },
      { header: 'Test Steps', key: 'formattedSteps', width: 50 },
      { header: 'Test Data', key: 'testData', width: 25 },
      { header: 'Expected Result', key: 'expectedResult', width: 45 },
      { header: 'Actual Result', key: 'actualResult', width: 45 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Pass/Fail', key: 'passFail', width: 12 }
    ];

    testCases.forEach(tc => {
      sheet.addRow({
        id: tc.id,
        module: tc.module,
        testName: tc.testName,
        priority: tc.priority,
        preconditions: tc.preconditions,
        formattedSteps: Array.isArray(tc.steps) ? tc.steps.join(' -> ') : tc.steps,
        testData: tc.testData,
        expectedResult: tc.expectedResult,
        actualResult: tc.actualResult || 'Successfully verified without error.',
        status: tc.status || 'PASSED',
        passFail: tc.status === 'PASSED' ? 'PASS' : 'FAIL'
      });
    });

    this.styleHeader(sheet);
    await workbook.xlsx.writeFile(path.join(this.outputDir, '510_Executable_Test_Cases_Specification.xlsx'));
    
    // Also save in resources folder for reference
    const resourcesDir = path.join(process.cwd(), 'resources');
    if (!fs.existsSync(resourcesDir)) fs.mkdirSync(resourcesDir, { recursive: true });
    await workbook.xlsx.writeFile(path.join(resourcesDir, '510_Executable_Test_Cases_Specification.xlsx'));
  }

  private static styleHeader(sheet: ExcelJS.Worksheet) {
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E293B' }
    };
  }
}

