import type { EventInput } from "@fullcalendar/core";

import type { CalendarView } from "../model/types";
import type { Reservation } from "@/entities/reservation/model/types";

export function reservationToCalendarEvent(
  reservation: Reservation,
): EventInput {
  const color =
    reservation.status === "confirmed"
      ? "#2563eb"
      : reservation.status === "pending"
        ? "#f59e0b"
        : "#94a3b8";

  return {
    id: reservation.id,
    title: reservation.title,
    start: reservation.start,
    end: reservation.end,
    backgroundColor: color,
    borderColor: color,
    extendedProps: {
      resourceId: reservation.resourceId,
      status: reservation.status,
      customerName: reservation.customerName,
    },
  };
}

export function reservationsToCalendarEvents(
  reservations: Reservation[],
): EventInput[] {
  return reservations.map(reservationToCalendarEvent);
}

export function isCalendarView(
  value: string | null | undefined,
): value is CalendarView {
  return (
    value === "dayGridMonth" ||
    value === "timeGridWeek" ||
    value === "timeGridDay"
  );
}
