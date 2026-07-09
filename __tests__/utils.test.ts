import { expect, test } from 'vitest';
import { cn } from '../lib/utils';
import { formatPrice } from '../lib/utils';

test('cn merges classes correctly', () => {
  expect(cn('class1', 'class2')).toBe('class1 class2');
});

test('formatPrice formats numbers properly', () => {
  expect(formatPrice(100)).toContain('100');
});
