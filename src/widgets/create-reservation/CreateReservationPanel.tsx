"use client";

import { ReservationForm } from "@/features/booking-form/ui/reservation-form";
import { prepareCreateReservation } from "@/features/reservation-mutations/model/reservation-mutations";
import { mockReservations } from "@/entities/reservation/model/mock-reservations";

const resources = [
  { id: "room-a", label: "اتاق A" },
  { id: "room-b", label: "اتاق B" },
];

export function CreateReservationPanel() {
  function handleSubmit(
    input: Parameters<typeof prepareCreateReservation>[0]["input"],
  ) {
    const result = prepareCreateReservation({
      input,
      reservations: mockReservations,
    });

    if (!result.ok) {
      console.error(result.errors, result.conflicts);
      return;
    }

    console.log("Ready for repository/API:", result.value);
  }

  return <ReservationForm resources={resources} onSubmit={handleSubmit} />;
}
