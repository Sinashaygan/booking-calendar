"use client";

import { useCallback, useState } from "react";

import type { ReservationInput } from "@/entities/reservation/model/types";
import { useCreateReservation } from "@/features/reservation-mutations/api/use-create-reservation";
import { useDeleteReservation } from "@/features/reservation-mutations/api/use-delete-reservation";
import { useUpdateReservation } from "@/features/reservation-mutations/api/use-update-reservation";
import { getReservationMutationErrorMessage } from "@/features/reservation-mutations/model/error-message";

type UseReservationActionsOptions = {
  selectedReservationId: string | null;
  onSuccess: () => void;
};

export function useReservationActions({
  selectedReservationId,
  onSuccess,
}: UseReservationActionsOptions) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const createReservation = useCreateReservation();
  const updateReservation = useUpdateReservation();
  const deleteReservation = useDeleteReservation();

  const isMutationPending =
    createReservation.isPending ||
    updateReservation.isPending ||
    deleteReservation.isPending;

  const clearErrors = useCallback(() => {
    setSubmitError(null);
    setDeleteError(null);
  }, []);

  const handleCreate = useCallback(
    async (input: ReservationInput) => {
      setSubmitError(null);

      try {
        await createReservation.mutateAsync(input);
        onSuccess();
      } catch (error: unknown) {
        setSubmitError(getReservationMutationErrorMessage(error));
      }
    },
    [createReservation, onSuccess],
  );

  const handleUpdate = useCallback(
    async (input: ReservationInput) => {
      if (!selectedReservationId) {
        return;
      }

      setSubmitError(null);

      try {
        await updateReservation.mutateAsync({
          id: selectedReservationId,
          input,
        });
        onSuccess();
      } catch (error: unknown) {
        setSubmitError(getReservationMutationErrorMessage(error));
      }
    },
    [onSuccess, selectedReservationId, updateReservation],
  );

  const handleDelete = useCallback(async () => {
    if (!selectedReservationId) {
      return;
    }

    setDeleteError(null);

    try {
      await deleteReservation.mutateAsync(selectedReservationId);
      onSuccess();
    } catch (error: unknown) {
      setDeleteError(getReservationMutationErrorMessage(error));
    }
  }, [deleteReservation, onSuccess, selectedReservationId]);

  return {
    submitError,
    deleteError,
    isMutationPending,
    createReservation,
    updateReservation,
    deleteReservation,
    clearErrors,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
