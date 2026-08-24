import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import type { CalendarView } from "@/entities/calendar/model/types";
import { parseReservationDate } from "@/entities/reservation/model/time-range";
import type { ReservationStatus } from "@/entities/reservation/model/types";

function toPersianDateObject(date: Date): DateObject {
  return new DateObject({ date, calendar: persian, locale: persian_fa });
}

export function formatPersianMonthYear(date: Date): string {
  const persianDate = toPersianDateObject(date);

  return `${persianDate.month.name} ${persianDate.year}`;
}

export function formatPersianFullDate(date: Date): string {
  const persianDate = toPersianDateObject(date);

  return `${persianDate.day} ${persianDate.month.name} ${persianDate.year}`;
}

export function formatPersianWeekRange(start: Date, end: Date): string {
  const startDate = toPersianDateObject(start);
  const endDate = toPersianDateObject(end);

  if (
    startDate.month.index === endDate.month.index &&
    startDate.year === endDate.year
  ) {
    return `${startDate.day} تا ${endDate.day} ${startDate.month.name} ${startDate.year}`;
  }

  return `${startDate.day} ${startDate.month.name} ${startDate.year} تا ${endDate.day} ${endDate.month.name} ${endDate.year}`;
}

export function formatPersianTimeFromApi(value: string): string {
  const timestamp = parseReservationDate(value);

  if (timestamp === undefined) {
    return value;
  }

  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function formatCalendarToolbarTitle(
  view: CalendarView,
  date: Date,
): string {
  if (view === "dayGridMonth") {
    return formatPersianMonthYear(date);
  }

  if (view === "timeGridDay") {
    return formatPersianFullDate(date);
  }

  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - ((date.getDay() + 1) % 7));

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return formatPersianWeekRange(weekStart, weekEnd);
}

export function getReservationStatusLabel(status: ReservationStatus): string {
  switch (status) {
    case "confirmed":
      return "تأیید شده";
    case "pending":
      return "در انتظار";
    case "cancelled":
      return "لغو شده";
  }
}

export function getReservationStatusColor(status: ReservationStatus): string {
  switch (status) {
    case "confirmed":
      return "#dcfce7";
    case "pending":
      return "#fef3c7";
    case "cancelled":
      return "#f1f5f9";
  }
}
