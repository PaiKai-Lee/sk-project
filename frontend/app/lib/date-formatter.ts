const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: "Asia/Taipei",
});

class DateFormatter {
    format(date: Date) {
        const parts = this.formatToParts(date);
        return `${parts.year.value}-${parts.month.value}-${parts.day.value} ${parts.hour.value}:${parts.minute.value}:${parts.second.value}`
    }

    formatToParts(date: Date) {
        return dateTimeFormat.formatToParts(date).filter((part) => part.type !== 'literal').reduce(
            (acc, part) => {
                acc[part.type] = part;
                return acc;
            },
            {} as Record<string, Intl.DateTimeFormatPart>);
    }
}

export default new DateFormatter();