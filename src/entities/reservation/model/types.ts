export const RESERVATION_STATUSES = [
  "confirmed",
  "pending",
  "cancelled",
] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export type Reservation = {
  id: string;
  title: string;
  resourceId: string;
  start: string;
  end: string;
  status: ReservationStatus;
  customerName: string;
};

export type ReservationInput = Omit<Reservation, "id">;

export type ReservationUpdateInput = Partial<ReservationInput>;