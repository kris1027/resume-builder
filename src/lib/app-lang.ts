export type AppLang = 'en' | 'pl';

export const normalizeLang = (lang: string | undefined): AppLang =>
    lang?.startsWith('pl') ? 'pl' : 'en';
