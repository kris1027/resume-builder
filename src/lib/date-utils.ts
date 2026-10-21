import { normalizeLang, type AppLang } from '@/lib/app-lang';
import * as dateFormat from '@/lib/date-format';
import type { MonthStyle } from '@/lib/date-format';
import i18n from '@/i18n/config';

// App side wrappers that default to the current i18n language. PDF templates import
// '@/lib/date-format' directly with their lang prop, so they stay off the i18n singleton.

export { formatCVYear } from '@/lib/date-format';

const getCurrentLang = (): AppLang => normalizeLang(i18n.resolvedLanguage ?? i18n.language);

export const formatCVDate = (dateString: string, lang: AppLang = getCurrentLang()): string =>
    dateFormat.formatCVDate(dateString, lang);

export const formatCVDateShort = (dateString: string, lang: AppLang = getCurrentLang()): string =>
    dateFormat.formatCVDateShort(dateString, lang);

export const getMonthNames = (style: MonthStyle, lang: AppLang = getCurrentLang()): string[] =>
    dateFormat.getMonthNames(style, lang);
