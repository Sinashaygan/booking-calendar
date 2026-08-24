import { mockReservations } from "@/entities/reservation/model/mock-reservations";

import type { Reservation } from "@/entities/reservation/model/types";

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

export function replaceReservation(
  replacement: Reservation,
): Reservation | undefined {
  const index = reservations.findIndex((item) => item.id === replacement.id);

  if (index === -1) {
    return undefined;
  }

  reservations = reservations.map((reservation, currentIndex) =>
    currentIndex === index ? { ...replacement } : reservation,
  );

  return { ...replacement };
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

