export type ReservationStatus = "confirmed" | "pending" | "cancelled";

export type Reservation = {
  id: string;
  title: string;
  resourceId: string;
  start: string;
  end: string;
  status: ReservationStatus;
  customerName: string;
};
