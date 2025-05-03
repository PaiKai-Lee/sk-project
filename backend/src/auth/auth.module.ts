import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CommonModule } from 'src/common';
import { UserModule } from 'src/user';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthListener } from './auth.listener';
import { AuditLogModule } from 'src/audit-log/audit-log.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    AuditLogModule,
    JwtModule.registerAsync({
      global: true,
      imports: [CommonModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('auth.jwtSecret'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('auth.jwtExpiresIn'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthListener],
  exports: [AuthService],
})
export class AuthModule {}
