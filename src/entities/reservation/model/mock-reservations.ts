import type { Reservation } from "./types";

export const mockReservations: Reservation[] = [
  {
    id: "reservation-1",
    title: "جلسه تیم محصول",
    resourceId: "room-a",
    start: "2026-08-22T08:30:00",
    end: "2026-08-22T10:00:00",
    status: "confirmed",
    customerName: "تیم محصول",
  },
  {
    id: "reservation-2",
    title: "جلسه با مشتری",
    resourceId: "room-b",
    start: "2026-08-22T11:00:00",
    end: "2026-08-22T12:30:00",
    status: "pending",
    customerName: "شرکت نمونه",
  },
  {
    id: "reservation-3",
    title: "کارگاه آموزشی",
    resourceId: "room-a",
    start: "2026-08-24T13:00:00",
    end: "2026-08-24T15:00:00",
    status: "confirmed",
    customerName: "واحد آموزش",
  },
];
