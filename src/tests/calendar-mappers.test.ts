import { describe, expect, it } from "vitest";

import { reservationToCalendarEvent } from "@/entities/calendar/lib/calendar-mappers";

import type { Reservation } from "@/entities/reservation/model/types";

describe("reservationToCalendarEvent", () => {
  it("maps a reservation to a FullCalendar event", () => {
    const reservation: Reservation = {
      id: "reservation-1",
      title: "جلسه تیم محصول",
      resourceId: "room-a",
      start: "2026-08-22T08:30:00",
      end: "2026-08-22T10:00:00",
      status: "confirmed",
      customerName: "تیم محصول",
    };

    const result = reservationToCalendarEvent(reservation);

    expect(result).toMatchObject({
      id: "reservation-1",
      title: "جلسه تیم محصول",
      start: "2026-08-22T08:30:00",
      end: "2026-08-22T10:00:00",
      backgroundColor: "#2563eb",
      borderColor: "#2563eb",
    });

    expect(result.extendedProps).toEqual({
      resourceId: "room-a",
      status: "confirmed",
      customerName: "تیم محصول",
    });
  });
});
