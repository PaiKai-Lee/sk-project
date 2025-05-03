// src/utils/bcrypt.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  // TODO: 後續調整使用config中的預設salt round
  private readonly defaultSaltRounds = 10;

  /**
   * 加密文字，預設使用 10 個 salt rounds
   */
  async hash(
    plainText: string,
    saltRounds = this.defaultSaltRounds,
  ): Promise<string> {
    return bcrypt.hash(plainText, saltRounds);
  }

  /**
   * 比對純文字與加密文字是否相符
   */
  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }

  /**
   * 產生隨機 salt 字串（可用於手動 hash）
   */
  async genSalt(rounds = this.defaultSaltRounds): Promise<string> {
    return bcrypt.genSalt(rounds);
  }

  /**
   * 同步加密文字（某些場合需要同步執行）
   */
  hashSync(plainText: string, saltRounds = this.defaultSaltRounds): string {
    return bcrypt.hashSync(plainText, saltRounds);
  }

  /**
   * 同步比對
   */
  compareSync(plainText: string, hash: string): boolean {
    return bcrypt.compareSync(plainText, hash);
  }

  /**
   * 同步產生 salt
   */
  genSaltSync(rounds = this.defaultSaltRounds): string {
    return bcrypt.genSaltSync(rounds);
  }
}
