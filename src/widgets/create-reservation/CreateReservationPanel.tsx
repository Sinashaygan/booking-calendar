"use client";

import { useState } from "react";

import type { ReservationInput } from "@/entities/reservation/model/types";
import { ReservationForm } from "@/features/booking-form/ui/reservation-form";
import { useCreateReservation } from "@/features/reservation-mutations/api/use-create-reservation";
import { HttpError } from "@/shared/api/http-client";

const resources = [
  { id: "room-a", label: "اتاق A" },
  { id: "room-b", label: "اتاق B" },
] as const;

function getCreateErrorMessage(error: unknown): string {
  if (error instanceof HttpError && error.status === 409) {
    return "این بازه زمانی با یک رزرو دیگر تداخل دارد.";
  }

  if (error instanceof HttpError && error.status === 400) {
    return "اطلاعات رزرو معتبر نیست.";
  }

  return "ثبت رزرو انجام نشد. دوباره تلاش کنید.";
}

export function CreateReservationPanel() {
  const createReservation = useCreateReservation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(input: ReservationInput): Promise<void> {
    setSubmitError(null);

    try {
      await createReservation.mutateAsync(input);
    } catch (error: unknown) {
      setSubmitError(getCreateErrorMessage(error));
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
