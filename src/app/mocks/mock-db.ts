import { mockReservations } from "@/entities/reservation/model/mock-reservations";

import type {
  Reservation,
  ReservationInput,
  ReservationUpdateInput,
} from "@/entities/reservation/model/types";

let reservations: Reservation[] = structuredClone(mockReservations);

export function getReservations(): Reservation[] {
  return reservations.map((reservation) => ({ ...reservation }));
}

export function getReservationById(id: string): Reservation | undefined {
  const reservation = reservations.find((item) => item.id === id);

  return reservation ? { ...reservation } : undefined;
}

export function insertReservation(reservation: Reservation): Reservation {
  reservations = [...reservations, reservation];

  return { ...reservation };
}

export function updateReservation(
  id: string,
  input: ReservationUpdateInput,
): Reservation | undefined {
  const index = reservations.findIndex((reservation) => reservation.id === id);

  if (index === -1) {
    return undefined;
  }

  const updatedReservation: Reservation = {
    ...reservations[index],
    ...input,
    id,
  };

  reservations = reservations.map((reservation, currentIndex) =>
    currentIndex === index ? updatedReservation : reservation,
  );

  return { ...updatedReservation };
}

export function deleteReservation(id: string): boolean {
  const exists = reservations.some((reservation) => reservation.id === id);

  if (!exists) {
    return false;
  }

  reservations = reservations.filter((reservation) => reservation.id !== id);

  return true;
}

export function resetMockDatabase(): void {
  reservations = structuredClone(mockReservations);
}

export function createReservationRecord(input: ReservationInput): Reservation {
  return {
    id: crypto.randomUUID(),
    ...input,
  };
}
