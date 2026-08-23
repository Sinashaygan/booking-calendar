"use client";

import { useState } from "react";

import type { ReservationInput } from "@/entities/reservation/model/types";
import { ReservationForm } from "@/features/booking-form/ui/reservation-form";
import { useCreateReservation } from "@/features/reservation-mutations/api/use-create-reservation";
import { getReservationMutationErrorMessage } from "@/features/reservation-mutations/model/error-message";

const resources = [
  { id: "room-a", label: "اتاق A" },
  { id: "room-b", label: "اتاق B" },
] as const;

export function CreateReservationPanel() {
  const createReservation = useCreateReservation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(input: ReservationInput): Promise<void> {
    setSubmitError(null);

    try {
      await createReservation.mutateAsync(input);
    } catch (error: unknown) {
      setSubmitError(getReservationMutationErrorMessage(error));
    }
  }

  return (
    <ReservationForm
      resources={resources}
      isPending={createReservation.isPending}
      submitError={submitError}
      onSubmit={handleSubmit}
    />
  );
}
