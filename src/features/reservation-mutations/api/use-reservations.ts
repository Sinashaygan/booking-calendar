"use client";

import { useQuery } from "@tanstack/react-query";

import { reservationApi } from "@/entities/reservation/api/reservation-api";
import { reservationKeys } from "@/entities/reservation/api/reservation-keys";

export function useReservations() {
  return useQuery({
    queryKey: reservationKeys.list(),
    queryFn: reservationApi.getAll,
  });
}
