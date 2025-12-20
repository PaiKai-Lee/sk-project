const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
  timeZone: 'Asia/Taipei',
});

export class DateFormatter {
  /**
   * @returns {Intl.DateTimeFormat} 傳回 Intl.DateTimeFormat 的實例。
   */
  static getFormatter() {
    return dateTimeFormat;
  }

  /**
   * 將日期格式化為字串 (例如 "2023-01-01 14:30:00")。
   * @param date 要格式化的日期。
   * @returns 格式化後的日期字串。
   */
  static format(date: Date) {
    const parts = DateFormatter.formatToParts(date);
    return `${parts.year.value}-${parts.month.value}-${parts.day.value} ${parts.hour.value}:${parts.minute.value}:${parts.second.value}`;
  }

  /**
   * 將日期格式化為其組成部分的物件。
   * @param date 要格式化的日期。
   * @returns 包含日期各個部分的物件 (年、月、日等)。
   */
  static formatToParts(date: Date) {
    return dateTimeFormat
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .reduce((acc, part) => {
        acc[part.type] = part;
        return acc;
      }, {} as Record<string, Intl.DateTimeFormatPart>);
  }
}

export class RelativeTimeFormatter {
  /**
   * 將日期轉換為相對時間字串 (例如 "5 分鐘前")。
   * @param date 要轉換的日期。
   * @param locale 用於格式化的語系 (預設為 'zh-TW')。
   * @returns 相對時間字串。
   */
  static timeAgo(date: Date, locale: Intl.LocalesArgument = 'zh-TW') {
    const now = new Date();
    const diff = (date.getTime() - now.getTime()) / 1000; // 秒數差距
    const relativeTimeFormat = new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto',
    });

    const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
      { unit: 'year', seconds: 60 * 60 * 24 * 365 },
      { unit: 'month', seconds: 60 * 60 * 24 * 30 },
      { unit: 'day', seconds: 60 * 60 * 24 },
      { unit: 'hour', seconds: 60 * 60 },
      { unit: 'minute', seconds: 60 },
      { unit: 'second', seconds: 1 },
    ];

    for (const { unit, seconds } of units) {
      const value = Math.round(diff / seconds);
      if (Math.abs(value) >= 1) {
        return relativeTimeFormat.format(value, unit);
      }
    }
  }
}
