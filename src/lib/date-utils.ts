import { normalizeLang, type AppLang } from '@/lib/app-lang';
import i18n from '@/i18n/config';
type MonthStyle = 'long' | 'short';

const localeTags: Record<AppLang, string> = {
    en: 'en-US',
    pl: 'pl-PL',
};

const formatters = new Map<string, Intl.DateTimeFormat>();

const getFormatter = (lang: AppLang, style: MonthStyle, withYear: boolean) => {
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

const getCurrentLang = (): AppLang => normalizeLang(i18n.resolvedLanguage ?? i18n.language);

const formatMonthYear = (dateString: string, style: MonthStyle, lang: AppLang): string => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return getFormatter(lang, style, true).format(date);
};

export const formatCVDate = (dateString: string, lang: AppLang = getCurrentLang()): string =>
    formatMonthYear(dateString, 'long', lang);

export const formatCVDateShort = (dateString: string, lang: AppLang = getCurrentLang()): string =>
    formatMonthYear(dateString, 'short', lang);

export const formatCVYear = (dateString: string): string => {
    if (!dateString) return '';
    const [year] = dateString.split('-');
    return year;
};

export const getMonthNames = (style: MonthStyle, lang: AppLang = getCurrentLang()): string[] => {
    const formatter = getFormatter(lang, style, false);
    return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2024, i)));
};
