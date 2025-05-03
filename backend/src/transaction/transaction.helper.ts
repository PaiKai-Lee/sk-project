import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionHelper {
  /** 產生交易清單編號 */
  generateTrxId(): string {
    // 交易編號
    const prefix = 'TRX';
    // 取得當前日期
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    // 隨機編號16進制，補滿4位
    const serial = Math.floor(Math.random() * 100000)
      .toString(16)
      .padStart(5, '0');
    return `${prefix}-${year}${month}${day}-${hour}${minute}${second}-${serial}`;
  }
}
