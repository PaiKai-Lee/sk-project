import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT as string) || 3000,
  env: process.env.NODE_ENV || 'development',
  rootPath: process.cwd(),
  rootUserPassword: process.env.APP_ROOT_USER_PASSWORD as string,
  defaultPassword: process.env.APP_DEFAULT_PASSWORD as string,
  saltRounds: process.env.APP_SALT_ROUNDS as string,
}));
