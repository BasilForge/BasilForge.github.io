import { describe, expect, it } from 'vitest';
import { altPath, localePath, t } from '../src/i18n/ui';

describe('altPath', () => {
  it('points each page at its twin in the other language', () => {
    expect(altPath('/', 'en')).toBe('/ar/');
    expect(altPath('/ar/', 'ar')).toBe('/');
    expect(altPath('/kairos/', 'en')).toBe('/ar/kairos/');
    expect(altPath('/ar/kairos/', 'ar')).toBe('/kairos/');
  });
});

describe('localePath', () => {
  it('adds /ar only for Arabic', () => {
    expect(localePath('ar', '/kairos/')).toBe('/ar/kairos/');
    expect(localePath('en', '/kairos/')).toBe('/kairos/');
    expect(localePath('ar', '/')).toBe('/ar/');
  });
});

describe('t', () => {
  it('names the other language on the switch', () => {
    expect(t('ar')['nav.lang']).toBe('English');
    expect(t('en')['nav.lang']).toBe('العربية');
  });

  it('has the same keys in both languages', () => {
    expect(Object.keys(t('ar')).sort()).toEqual(Object.keys(t('en')).sort());
  });
});
