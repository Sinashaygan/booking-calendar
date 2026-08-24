import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { parseReservationDate } from "@/entities/reservation/model/time-range";

const API_DATETIME_FORMAT = "YYYY-MM-DDTHH:mm:ss";
const DISPLAY_FORMAT = "YYYY/MM/DD HH:mm";

export function reservationDateToApiString(value: DateObject): string {
  const gregorianDate = new DateObject(value).convert(
    gregorian,
    gregorian_en,
  );

  return gregorianDate.format(API_DATETIME_FORMAT);
}

export function apiStringToDateObject(
  value: string,
): DateObject | undefined {
  const timestamp = parseReservationDate(value);

  if (timestamp === undefined) {
    return undefined;
  }

  return new DateObject(new Date(timestamp)).convert(persian, persian_fa);
}

export function formatReservationDateTimeForDisplay(value: string): string {
  const dateObject = apiStringToDateObject(value);

  if (!dateObject) {
    return value;
  }

  return dateObject.format(DISPLAY_FORMAT);
}

export { DISPLAY_FORMAT as RESERVATION_DISPLAY_FORMAT };
