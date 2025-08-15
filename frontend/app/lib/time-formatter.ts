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
  static getFormatter() {
    return dateTimeFormat;
  }

  static format(date: Date) {
    const parts = DateFormatter.formatToParts(date);
    return `${parts.year.value}-${parts.month.value}-${parts.day.value} ${parts.hour.value}:${parts.minute.value}:${parts.second.value}`;
  }

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

  static timeAgo(date: Date, locale: Intl.LocalesArgument = 'zh-TW') {
    const now = new Date();
    const diff = (date.getTime() - now.getTime()) / 1000; // 秒數差距
    const relativeTimeFormat = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

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