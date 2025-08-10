import { Injectable } from '@nestjs/common';

type PayloadObj = Record<string, any>;

@Injectable()
export class UserNotificationHelper {
  /**
   * 渲染通知內容模板
   * @param contentTemplate notification content，包含 {{key}} 的字符串。
   * @param payload UserNotificationPayload.
   * @returns 渲染後的字符
   */
  renderContentTemplate(contentTemplate: string, payload: PayloadObj): string {
    if (!contentTemplate || !this.isPlainObject(payload)) {
      return contentTemplate;
    }
    return contentTemplate.replace(/{{(.*?)}}/g, (_, key) => {
      const trimmedKey = key.trim();
      return payload.hasOwnProperty(trimmedKey)
        ? String(payload[trimmedKey])
        : '';
    });
  }

  private isPlainObject(value: any): value is Record<string, any> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
}
