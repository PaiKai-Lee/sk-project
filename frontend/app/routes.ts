import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  layout('routes/layout.tsx', [
    index('routes/home.tsx'),
    ...prefix('admin', [
      layout('routes/admin/layout.tsx', [
        route('user', 'routes/admin/user/home.tsx'),
      ]),
    ]),
    ...prefix('overview', [
      layout('routes/overview/layout.tsx', [index('routes/overview/home.tsx')]),
    ]),
    ...prefix('transaction', [
      layout('routes/transaction/layout.tsx', [
        index('routes/transaction/home.tsx'),
      ]),
    ]),
    ...prefix('transaction-records', [
      layout('routes/transaction-records/layout.tsx', [
        index('routes/transaction-records/home.tsx'),
      ]),
    ]),
    route('notification', 'routes/notification.tsx'),
    route('demo', 'routes/demo.tsx'),
  ]),
  ...prefix('login', [
    layout('routes/login/layout.tsx', [index('routes/login/home.tsx')]),
  ]),
] satisfies RouteConfig;
