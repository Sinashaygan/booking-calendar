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

export function hasReservationConflict(
  candidate: Pick<Reservation, "resourceId" | "start" | "end">,
  reservations: readonly Reservation[],
  options: ConflictOptions = {},
): boolean {
  return reservations.some((reservation) => {
    if (options.excludeId === reservation.id) {
      return false;
    }

    if (!isActiveReservation(reservation)) {
      return false;
    }

    if (reservation.resourceId !== candidate.resourceId) {
      return false;
    }

    return doTimeRangesOverlap(
      candidate.start,
      candidate.end,
      reservation.start,
      reservation.end,
    );
  });
}

export function findReservationConflicts(
  candidate: Pick<Reservation, "resourceId" | "start" | "end">,
  reservations: readonly Reservation[],
  options: ConflictOptions = {},
): Reservation[] {
  return reservations.filter((reservation) => {
    if (options.excludeId === reservation.id) {
      return false;
    }

    if (!isActiveReservation(reservation)) {
      return false;
    }

    if (reservation.resourceId !== candidate.resourceId) {
      return false;
    }

    return doTimeRangesOverlap(
      candidate.start,
      candidate.end,
      reservation.start,
      reservation.end,
    );
  });
}

export function isReservationDurationValid(
  start: string,
  end: string,
): boolean {
  const duration = getReservationDurationMs(start, end);

  return duration !== undefined && duration >= 15 * 60 * 1000;
}
