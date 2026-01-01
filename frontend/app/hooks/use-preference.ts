import { PreferenceProviderContext } from '~/context/preference';
import { useContext } from 'react';

export function usePreference() {
  const context = useContext(PreferenceProviderContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an PreferenceProviderContext');
  }

  return context;
}
