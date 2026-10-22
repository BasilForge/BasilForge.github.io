import { describe, expect, it } from 'vitest';
import { formatBytes, formatCount, formatDate } from '../src/lib/format';

describe('formatBytes', () => {
  it('shows whole megabytes', () => {
    expect(formatBytes(117_440_512, 'en')).toBe('112 MB');
    expect(formatBytes(117_440_512, 'ar')).toBe('112 ميقابايت');
  });
});

describe('formatCount', () => {
  it('groups thousands with Western digits in both languages', () => {
    expect(formatCount(12345, 'en')).toBe('12,345');
    expect(formatCount(12345, 'ar')).toBe('12,345');
    expect(formatCount(769, 'ar')).toBe('769');
  });
});

describe('formatDate', () => {
  it('writes the day in each language', () => {
    expect(formatDate('2026-10-18T17:31:06Z', 'en')).toBe('Oct 18, 2026');
    expect(formatDate('2026-10-18T17:31:06Z', 'ar')).toBe('18 أكتوبر 2026');
  });
});
