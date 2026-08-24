import { parseReservationDate } from "@/entities/reservation/model/time-range";
import type { Reservation } from "@/entities/reservation/model/types";

export function isSameLocalDay(timestamp: number, day: Date): boolean {
  const parsedDay = new Date(timestamp);

  return (
    parsedDay.getFullYear() === day.getFullYear() &&
    parsedDay.getMonth() === day.getMonth() &&
    parsedDay.getDate() === day.getDate()
  );
}

export function filterReservationsByDay(
  reservations: readonly Reservation[],
  day: Date,
): Reservation[] {
  return reservations
    .filter((reservation) => {
      const startTimestamp = parseReservationDate(reservation.start);

      return (
        startTimestamp !== undefined &&
        isSameLocalDay(startTimestamp, day)
      );
    })
    .sort((left, right) => {
      const leftStart = parseReservationDate(left.start) ?? 0;
      const rightStart = parseReservationDate(right.start) ?? 0;

      return leftStart - rightStart;
    });
}
