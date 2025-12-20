import { version } from '../../package.json';

export function AppVersion() {
  return (
    <div className="fixed bottom-2 right-2 text-gray-400 text-xs">
      v{version}
    </div>
  );
}
