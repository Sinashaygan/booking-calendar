"use client";

import { useMemo } from "react";

import type { Reservation } from "@/entities/reservation/model/types";

import { filterReservationsByDay } from "../lib/filter-events-by-day";

export function useDayEvents(
  reservations: readonly Reservation[] | undefined,
  day: Date | null,
) {
  return useMemo(() => {
    if (!day || !reservations) {
      return [];
    }

    return filterReservationsByDay(reservations, day);
  }, [day, reservations]);
}
