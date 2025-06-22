import { registerAs } from '@nestjs/config';

export default registerAs('logger', () => ({
  level: process.env.LOGGER_LEVEL as string,
  dirname: (process.env.LOGGER_DIRNAME as string) || 'logs',
  fileMaxSize: process.env.LOGGER_FILE_SIZE as string,
  maxFiles: process.env.LOGGER_MAX_FILE as string,
  zipArchive: process.env.LOGGER_ZIP_ARCHIVE === 'true' || false,
}));
