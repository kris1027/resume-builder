import i18n from '@/i18n/config';

export type DateLang = 'en' | 'pl';
type MonthStyle = 'long' | 'short';

const localeTags: Record<DateLang, string> = {
    en: 'en-US',
    pl: 'pl-PL',
};

const formatters = new Map<string, Intl.DateTimeFormat>();

const getFormatter = (lang: DateLang, style: MonthStyle, withYear: boolean) => {
    const key = `${lang}-${style}-${withYear}`;
    let formatter = formatters.get(key);
    if (!formatter) {
        formatter = new Intl.DateTimeFormat(localeTags[lang], {
            month: style,
            ...(withYear && { year: 'numeric' }),
        });
        formatters.set(key, formatter);
    }
    return formatter;
};

const getCurrentLang = (): DateLang => {
    const lang = (i18n.resolvedLanguage ?? i18n.language)?.split('-')[0];
    return lang === 'pl' ? 'pl' : 'en';
};

const formatMonthYear = (dateString: string, style: MonthStyle, lang: DateLang): string => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return getFormatter(lang, style, true).format(date);
};

export const formatCVDate = (dateString: string, lang: DateLang = getCurrentLang()): string =>
    formatMonthYear(dateString, 'long', lang);

export const formatCVDateShort = (dateString: string, lang: DateLang = getCurrentLang()): string =>
    formatMonthYear(dateString, 'short', lang);

export const formatCVYear = (dateString: string): string => {
    if (!dateString) return '';
    const [year] = dateString.split('-');
    return year;
};

export const getMonthNames = (style: MonthStyle, lang: DateLang = getCurrentLang()): string[] => {
    const formatter = getFormatter(lang, style, false);
    return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2024, i)));
};
