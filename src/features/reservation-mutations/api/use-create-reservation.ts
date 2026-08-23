"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiReservationRepository } from "@/entities/reservation/api/api-reservation-repository";
import { reservationKeys } from "@/entities/reservation/api/reservation-keys";
import type { ReservationInput } from "@/entities/reservation/model/types";

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReservationInput) =>
      apiReservationRepository.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: reservationKeys.lists(),
      });
    },
  });
}
