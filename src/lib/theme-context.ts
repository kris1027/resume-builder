import { createContext } from 'react';

export type ResolvedTheme = 'light' | 'dark';
export type Theme = ResolvedTheme | 'system';

export interface ThemeContextType {
    theme: Theme;
    actualTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
