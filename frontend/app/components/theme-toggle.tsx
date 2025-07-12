import { usePreference } from '~/context/preference';

import { Moon, Sun } from 'lucide-react';
import { SidebarMenuButton } from './ui/sidebar';
import { useTranslation } from 'react-i18next';

export function ModeToggle() {
  const { theme, setTheme } = usePreference();
  const { t } = useTranslation();
  function handleThemeToggle() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }
  return (
    <SidebarMenuButton onClick={handleThemeToggle}>
      <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span>{t(`common.changeThemeMode`)}</span>
    </SidebarMenuButton>
  );
}
