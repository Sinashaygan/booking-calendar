const ISO_DATE_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

const MIN_RESERVATION_DURATION_MS = 15 * 60 * 1000;

export function parseReservationDate(value: string): number | undefined {
  const match = ISO_DATE_PATTERN.exec(value);

  if (!match) {
    return undefined;
  }

  const [
    ,
    yearString,
    monthString,
    dayString,
    hourString,
    minuteString,
    secondString,
    millisecondString,
    timezone,
  ] = match;

  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const hour = hourString ? Number(hourString) : 0;
  const minute = minuteString ? Number(minuteString) : 0;
  const second = secondString ? Number(secondString) : 0;
  const millisecond = millisecondString
    ? Number(millisecondString.padEnd(3, "0"))
    : 0;

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour > 23 ||
    minute > 59 ||
    second > 59 ||
    millisecond > 999
  ) {
    return undefined;
  }

  const timestamp = timezone
    ? Date.parse(value)
    : new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        second,
        millisecond,
      ).getTime();

  if (!Number.isFinite(timestamp)) {
    return undefined;
  }

  if (!timezone) {
    const parsed = new Date(timestamp);

    const isSameLocalDate =
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day &&
      parsed.getHours() === hour &&
      parsed.getMinutes() === minute &&
      parsed.getSeconds() === second;

    if (!isSameLocalDate) {
      return undefined;
    }
  }

  return timestamp;
}