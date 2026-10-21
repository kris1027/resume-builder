import type { AppLang } from '@/lib/app-lang';

export type MonthStyle = 'long' | 'short';

const localeTags: Record<AppLang, string> = {
    en: 'en-US',
    pl: 'pl-PL',
};

const dateFormats = {
    monthYearLong: { month: 'long', year: 'numeric' },
    monthYearShort: { month: 'short', year: 'numeric' },
    monthLong: { month: 'long' },
    monthShort: { month: 'short' },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

type DateFormat = keyof typeof dateFormats;

const formatters = new Map<string, Intl.DateTimeFormat>();

const getFormatter = (lang: AppLang, format: DateFormat) => {
    const key = `${lang}-${format}`;
    let formatter = formatters.get(key);
    if (!formatter) {
        formatter = new Intl.DateTimeFormat(localeTags[lang], dateFormats[format]);
        formatters.set(key, formatter);
    }
    return formatter;
};

const formatMonthYear = (dateString: string, format: DateFormat, lang: AppLang): string => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return getFormatter(lang, format).format(date);
};

export const formatCVDate = (dateString: string, lang: AppLang): string =>
    formatMonthYear(dateString, 'monthYearLong', lang);

export const formatCVDateShort = (dateString: string, lang: AppLang): string =>
    formatMonthYear(dateString, 'monthYearShort', lang);

export const formatCVYear = (dateString: string): string => {
    if (!dateString) return '';
    const [year] = dateString.split('-');
    return year;
};

export const getMonthNames = (style: MonthStyle, lang: AppLang): string[] => {
    const formatter = getFormatter(lang, style === 'long' ? 'monthLong' : 'monthShort');
    return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2024, i)));
};
