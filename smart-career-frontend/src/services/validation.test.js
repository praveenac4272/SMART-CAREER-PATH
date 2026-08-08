import test from 'node:test';
import assert from 'node:assert/strict';
import { getNameError } from './validation.js';

test('accepts common full names with spaces and punctuation', () => {
  assert.equal(getNameError('John Doe'), '');
  assert.equal(getNameError("Mary-Jane O'Connor"), '');
  assert.equal(getNameError('Dr. Smith'), '');
});

test('rejects names that do not begin with a letter', () => {
  assert.equal(getNameError('123John'), 'Name must start with a letter and can contain spaces, hyphens, apostrophes, or periods.');
});
