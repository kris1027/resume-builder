import { afterEach, describe, expect, it } from 'vitest';

import i18n from '@/i18n/config';

import { formatCVDate, formatCVDateShort, getMonthNames } from './date-utils';

describe('date-utils', () => {
    afterEach(async () => {
        await i18n.changeLanguage('en');
    });

    it('should use the current i18n language when no language is given', async () => {
        await i18n.changeLanguage('pl');
        expect(formatCVDate('2024-01')).toBe('styczeń 2024');
        expect(formatCVDateShort('2024-10')).toBe('paź 2024');
        expect(getMonthNames('short')[0]).toBe('sty');
    });

    it('should fall back to English when the i18n language is unsupported', async () => {
        await i18n.changeLanguage('de');
        expect(formatCVDate('2024-03')).toBe('March 2024');
    });

    it('should prefer the given language when one is passed', async () => {
        await i18n.changeLanguage('pl');
        expect(formatCVDate('2024-03', 'en')).toBe('March 2024');
    });
});
