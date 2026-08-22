"use client";

import { useRef } from "react";

import type { CalendarApi, DatesSetArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import faLocale from "@fullcalendar/core/locales/fa";

import type { CalendarView } from "@/entities/calendar/model/types";
import { isCalendarView } from "@/entities/calendar/lib/calendar-mappers";

type CalendarGridProps = {
  view: CalendarView;
  date: Date;
  events: EventInput[];
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
};

export function CalendarGrid({
  view,
  date,
  events,
  onDateChange,
  onViewChange,
}: CalendarGridProps) {
  const calendarRef = useRef<FullCalendar | null>(null);

  function getCalendarApi(): CalendarApi | null {
    return calendarRef.current?.getApi() ?? null;
  }

  function handleDatesSet(dateInfo: DatesSetArg) {
    const api = dateInfo.view.calendar;
    const nextDate = api.getDate();
    const nextView = api.view.type;

    if (date.getTime() !== nextDate.getTime()) {
      onDateChange(nextDate);
    }

    if (isCalendarView(nextView) && nextView !== view) {
      onViewChange(nextView);
    }
  }

  function handlePrevious() {
    getCalendarApi()?.prev();
  }

  function handleNext() {
    getCalendarApi()?.next();
  }

  function handleToday() {
    getCalendarApi()?.today();
  }

  function handleViewChange(nextView: CalendarView) {
    getCalendarApi()?.changeView(nextView);
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

export const calendarNavigation = {
  previous: "previous",
  next: "next",
  today: "today",
};
