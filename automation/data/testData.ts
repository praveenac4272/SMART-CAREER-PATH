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
  { name: 'Authentication', code: 'AUTH', count: 120 },
  { name: 'Authorization', code: 'AUTHZ', count: 110 },
  { name: 'Registration', code: 'REG', count: 100 },
  { name: 'Profile Management', code: 'PROF', count: 100 },
  { name: 'Navigation', code: 'NAV', count: 100 },
  { name: 'Dashboard', code: 'DASH', count: 100 },
  { name: 'Forms', code: 'FORM', count: 120 },
  { name: 'CRUD Operations', code: 'CRUD', count: 120 },
  { name: 'Search', code: 'SRCH', count: 100 },
  { name: 'Filters', code: 'FLTR', count: 100 },
  { name: 'Input Validation', code: 'VAL', count: 120 },
  { name: 'Error Handling', code: 'ERR', count: 100 },
  { name: 'Session Management', code: 'SESS', count: 100 },
  { name: 'Notifications', code: 'NOTIF', count: 100 },
  { name: 'File Upload', code: 'UPLD', count: 100 },
  { name: 'Offline Handling', code: 'OFF', count: 60 },
  { name: 'Accessibility', code: 'A11Y', count: 100 },
  { name: 'Responsive UI', code: 'RESP', count: 60 },
  { name: 'Performance Load Tests', code: 'PERF', count: 100 },
  { name: 'Regression Suite', code: 'REG_S', count: 130 }
];

