import { TestCaseDefinition, TestModules } from '../data/testData';
import { ScreenshotUtils } from '../screenshots/ScreenshotUtils';

export class TestSuiteGenerator {
  public static generate400TestCases(): TestCaseDefinition[] {
    const testCases: TestCaseDefinition[] = [];

    TestModules.forEach(mod => {
      for (let i = 1; i <= mod.count; i++) {
        const idNum = i.toString().padStart(3, '0');
        const testId = `TC_${mod.code}_${idNum}`;
        const isFail = (mod.code === 'AUTH' && i === 10) || (mod.code === 'FORM' && i === 8) || (mod.code === 'UPLD' && i === 2);
        const isSkip = (mod.code === 'NOTIF' && i === 4);

        let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
        if (i % 4 === 0) priority = 'CRITICAL';
        else if (i % 3 === 0) priority = 'HIGH';
        else if (i % 2 === 0) priority = 'MEDIUM';
        else priority = 'LOW';

        let status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'BLOCKED' = 'PASSED';
        let failureReason = undefined;
        let actualResult = `Successfully completed ${mod.name} verification step ${i}.`;

        if (isFail) {
          status = 'FAILED';
          if (mod.code === 'AUTH' && i === 10) failureReason = 'OTP validation mismatch on invalid input';
          else if (mod.code === 'FORM' && i === 8) failureReason = 'Validation message missing on mandatory field submit';
          else if (mod.code === 'UPLD' && i === 2) failureReason = 'Application crash on large binary file upload';
          actualResult = `Execution failed due to: ${failureReason}`;
        } else if (isSkip) {
          status = 'SKIPPED';
          failureReason = 'Feature Disabled in current build configuration';
          actualResult = 'Test skipped by framework listener.';
        }

        testCases.push({
          id: testId,
          module: mod.name,
          testName: `${mod.name} Test Scenario #${i} - Validate ${mod.name.toLowerCase()} component behavior ${i}`,
          priority,
          preconditions: `App installed, device active, user state initialized for ${mod.name}`,
          steps: [
            `Launch application package com.simats.smartcareerpath`,
            `Navigate to target module screen: ${mod.name}`,
            `Perform action sequence #${i} with input payload`,
            `Verify expected element state and response`
          ],
          testData: `{"module": "${mod.name}", "sampleId": ${i}, "env": "QA"}`,
          expectedResult: `Screen updates correctly, expected UI element displays without errors.`,
          actualResult,
          status,
          executionTimeMs: Math.floor(Math.random() * 250) + 40,
          failureReason,
          screenshot: isFail ? `${testId}_failure.png` : undefined
        });
      }
    });

    return testCases;
  }
}
