"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiReservationRepository } from "@/entities/reservation/api/api-reservation-repository";
import { reservationKeys } from "@/entities/reservation/api/reservation-keys";
import { HttpError } from "@/shared/api/http-client";

export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiReservationRepository.remove(id),
    onSuccess: async (_result, id) => {
      queryClient.removeQueries({
        queryKey: reservationKeys.detail(id),
      });
      await queryClient.invalidateQueries({
        queryKey: reservationKeys.lists(),
      });
    },
    onError: async (error, id) => {
      if (error instanceof HttpError && error.status === 404) {
        queryClient.removeQueries({
          queryKey: reservationKeys.detail(id),
        });
        await queryClient.invalidateQueries({
          queryKey: reservationKeys.lists(),
        });
      }
    },
  });
}
