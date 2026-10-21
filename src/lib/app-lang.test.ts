import { describe, expect, it } from 'vitest';

import { normalizeLang } from './app-lang';

describe('normalizeLang', () => {
    it('should return pl when the language is Polish with or without a region', () => {
        expect(normalizeLang('pl')).toBe('pl');
        expect(normalizeLang('pl-PL')).toBe('pl');
    });

    it('should fall back to en when the language is unsupported or missing', () => {
        expect(normalizeLang('en-GB')).toBe('en');
        expect(normalizeLang('de')).toBe('en');
        expect(normalizeLang(undefined)).toBe('en');
    });
});
