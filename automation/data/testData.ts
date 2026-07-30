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
  { name: 'Authentication', code: 'AUTH', count: 40 },
  { name: 'Authorization', code: 'AUTHZ', count: 30 },
  { name: 'Registration', code: 'REG', count: 20 },
  { name: 'Profile Management', code: 'PROF', count: 20 },
  { name: 'Navigation', code: 'NAV', count: 30 },
  { name: 'Dashboard', code: 'DASH', count: 20 },
  { name: 'Forms', code: 'FORM', count: 40 },
  { name: 'CRUD Operations', code: 'CRUD', count: 40 },
  { name: 'Search', code: 'SRCH', count: 20 },
  { name: 'Filters', code: 'FLTR', count: 20 },
  { name: 'Input Validation', code: 'VAL', count: 40 },
  { name: 'Error Handling', code: 'ERR', count: 20 },
  { name: 'Session Management', code: 'SESS', count: 20 },
  { name: 'Notifications', code: 'NOTIF', count: 20 },
  { name: 'File Upload', code: 'UPLD', count: 20 },
  { name: 'Offline Handling', code: 'OFF', count: 10 },
  { name: 'Accessibility', code: 'A11Y', count: 20 },
  { name: 'Responsive UI', code: 'RESP', count: 10 },
  { name: 'Performance Smoke Tests', code: 'PERF', count: 20 },
  { name: 'Regression Suite', code: 'REG_S', count: 50 }
];
