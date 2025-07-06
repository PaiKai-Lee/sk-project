import type { Route } from './+types/notification';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'notification' },
    { name: 'description', content: 'notification page' },
  ];
}

export default function Notification() {
  return <div>Notification</div>;
}
