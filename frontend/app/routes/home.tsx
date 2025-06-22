import { redirect } from 'react-router';

export function clientLoader() {
  return redirect('/overview');
}

export default function Home() {
  return null;
}
