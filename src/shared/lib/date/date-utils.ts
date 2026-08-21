import { format, isValid, parseISO } from "date-fns";

export function formatDateForUrl(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseDateFromUrl(value: string | null): Date {
  if (!value) {
    return new Date();
  }

  const parsedDate = parseISO(value);

  return isValid(parsedDate) ? parsedDate : new Date();
}
