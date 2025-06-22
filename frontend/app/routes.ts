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
    route('overview', 'routes/overview.tsx'),
    ...prefix('transaction', [
      layout('routes/transaction/layout.tsx', [
        index('routes/transaction/home.tsx'),
      ]),
    ]),
    route('transaction-records', 'routes/transaction-records.tsx'),
    route('notification', 'routes/notification.tsx'),
    route('demo', 'routes/demo.tsx'),
  ]),
  ...prefix('login', [
    layout('routes/login/layout.tsx', [index('routes/login/home.tsx')]),
  ]),
] satisfies RouteConfig;
