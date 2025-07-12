import 'react-i18next';
import type { resources } from '../app/lib/i18n';

// TODO: 沒效果，後續確認
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: typeof resources;
  }
}
