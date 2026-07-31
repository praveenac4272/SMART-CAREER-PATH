export interface TestCaseDefinition {
  id: string;
  module: string;
  testName: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  preconditions: string;
  steps: string[];
  testData: string;
  expectedResult: string;
  actualResult?: string;
  status?: 'PASSED' | 'FAILED' | 'SKIPPED' | 'BLOCKED';
  executionTimeMs?: number;
  failureReason?: string;
  screenshot?: string;
}

export const TestModules = [
  { name: 'Web UI (Selenium Web E2E)', code: 'WEB', count: 350 },
  { name: 'Mobile UI (Appium Android E2E)', code: 'MOB', count: 350 },
  { name: 'Security (Backend Vulnerability Audit)', code: 'SEC', count: 350 },
  { name: 'Performance (Load & API SLA Testing)', code: 'PERF', count: 350 }
];


