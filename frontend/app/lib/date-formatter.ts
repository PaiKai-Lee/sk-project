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

export default class DateFormatter {
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
