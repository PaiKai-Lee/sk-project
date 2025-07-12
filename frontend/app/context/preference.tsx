import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '~/hooks/use-local-storage';
import i18n, { resources } from '~/lib/i18n';
export type Language = keyof typeof resources;
export type Theme = 'light' | 'dark' | 'system';

interface IPreferenceContext {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const PreferenceProviderContext = createContext<IPreferenceContext>({
  language: 'en',
  setLanguage: () => {},
  theme: 'system',
  setTheme: () => {},
});

export function PreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useLocalStorage<Language>('lang', 'zh-TW');
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <PreferenceProviderContext.Provider
      value={{ language, setLanguage, theme, setTheme }}
    >
      {children}
    </PreferenceProviderContext.Provider>
  );
}

export function usePreference() {
  const context = useContext(PreferenceProviderContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an PreferenceProviderContext');
  }

  return context;
}
