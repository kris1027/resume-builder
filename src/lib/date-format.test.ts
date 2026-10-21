import { describe, expect, it } from 'vitest';

import { formatCVDate, formatCVDateShort, formatCVYear, getMonthNames } from './date-format';

// Pinned against the date-fns 4.1.0 output these helpers replaced ('LLLL yyyy', 'LLL yyyy',
// 'LLLL', 'LLL' with the enUS and pl locales); all 48 strings checked on Node 24, 2026-10-21
const LONG = {
    en: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    pl: [
        'styczeń',
        'luty',
        'marzec',
        'kwiecień',
        'maj',
        'czerwiec',
        'lipiec',
        'sierpień',
        'wrzesień',
        'październik',
        'listopad',
        'grudzień',
    ],
};

const SHORT = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    pl: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
};

const LANGS = ['en', 'pl'] as const;
const MONTHS = Array.from({ length: 12 }, (_, i) => `2024-${String(i + 1).padStart(2, '0')}`);

describe('date-format', () => {
    describe.each(LANGS)('in %s', (lang) => {
        it('should format the long month and year when given each of the 12 months', () => {
            expect(MONTHS.map((d) => formatCVDate(d, lang))).toEqual(
                LONG[lang].map((m) => `${m} 2024`),
            );
        });

        it('should format the short month and year when given each of the 12 months', () => {
            expect(MONTHS.map((d) => formatCVDateShort(d, lang))).toEqual(
                SHORT[lang].map((m) => `${m} 2024`),
            );
        });

        it('should list the long month names when asked for the long style', () => {
            expect(getMonthNames('long', lang)).toEqual(LONG[lang]);
        });

        it('should list the short month names when asked for the short style', () => {
            expect(getMonthNames('short', lang)).toEqual(SHORT[lang]);
        });
    });

    it('should return an empty string when the date is empty', () => {
        expect(formatCVDate('', 'en')).toBe('');
        expect(formatCVDateShort('', 'pl')).toBe('');
        expect(formatCVYear('')).toBe('');
    });

    it('should return the year when given a year and month', () => {
        expect(formatCVYear('2024-05')).toBe('2024');
    });
});
