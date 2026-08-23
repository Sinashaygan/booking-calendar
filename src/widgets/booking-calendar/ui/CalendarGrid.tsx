"use client";

import type {
  DatesSetArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import faLocale from "@fullcalendar/core/locales/fa";

import type { CalendarView } from "@/entities/calendar/model/types";

type CalendarGridProps = {
  view: CalendarView;
  date: Date;
  events: EventInput[];
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
  onReservationClick: (id: string) => void;
  calendarRef: React.RefObject<FullCalendar | null>;
};

export function CalendarGrid({
  view,
  date,
  events,
  onDateChange,
  onViewChange,
  onReservationClick,
  calendarRef,
}: CalendarGridProps) {
  function handleDatesSet(dateInfo: DatesSetArg) {
    const api = dateInfo.view.calendar;

    onDateChange(api.getDate());

    if (
      api.view.type === "dayGridMonth" ||
      api.view.type === "timeGridWeek" ||
      api.view.type === "timeGridDay"
    ) {
      onViewChange(api.view.type);
    }
  }

  function handleEventClick(eventInfo: EventClickArg) {
    onReservationClick(eventInfo.event.id);
  }

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      locales={[faLocale]}
      locale="fa"
      direction="rtl"
      headerToolbar={false}
      initialView={view}
      initialDate={date}
      events={events}
      datesSet={handleDatesSet}
      eventClick={handleEventClick}
      height="auto"
      nowIndicator
      dayMaxEvents
      allDaySlot={false}
      slotMinTime="07:00:00"
      slotMaxTime="22:00:00"
      slotDuration="00:15:00"
      expandRows
      weekends
    />
  );
}
