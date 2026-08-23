"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiReservationRepository } from "@/entities/reservation/api/api-reservation-repository";
import { reservationKeys } from "@/entities/reservation/api/reservation-keys";
import type { ReservationUpdateInput } from "@/entities/reservation/model/types";
import { HttpError } from "@/shared/api/http-client";

export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: ReservationUpdateInput;
    }) => apiReservationRepository.update(id, input),
    onSuccess: async (reservation) => {
      queryClient.setQueryData(
        reservationKeys.detail(reservation.id),
        reservation,
      );
      await queryClient.invalidateQueries({
        queryKey: reservationKeys.lists(),
      });
      await queryClient.invalidateQueries({
        queryKey: reservationKeys.detail(reservation.id),
      });
    },
    onError: async (error, variables) => {
      if (error instanceof HttpError && error.status === 404) {
        queryClient.removeQueries({
          queryKey: reservationKeys.detail(variables.id),
        });
        await queryClient.invalidateQueries({
          queryKey: reservationKeys.lists(),
        });
      }
    },
  });
}
