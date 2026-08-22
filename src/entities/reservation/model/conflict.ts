import { getReservationDurationMs, parseReservationDate } from "./time-range";
import type { Reservation, ReservationStatus } from "./types";

const ACTIVE_STATUSES: readonly ReservationStatus[] = ["pending", "confirmed"];

export type ConflictOptions = {
  excludeId?: string;
};

export function isActiveReservation(reservation: Reservation): boolean {
  return ACTIVE_STATUSES.includes(reservation.status);
}

export function doTimeRangesOverlap(
  firstStart: string,
  firstEnd: string,
  secondStart: string,
  secondEnd: string,
): boolean {
  const firstStartTime = parseReservationDate(firstStart);
  const firstEndTime = parseReservationDate(firstEnd);
  const secondStartTime = parseReservationDate(secondStart);
  const secondEndTime = parseReservationDate(secondEnd);

  if (
    firstStartTime === undefined ||
    firstEndTime === undefined ||
    secondStartTime === undefined ||
    secondEndTime === undefined
  ) {
    return false;
  }

  return firstStartTime < secondEndTime && secondStartTime < firstEndTime;
}


