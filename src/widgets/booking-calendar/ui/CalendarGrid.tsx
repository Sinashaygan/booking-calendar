"use client";

import { useEffect, useRef } from "react";

import type {
  DatesSetArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import faLocale from "@fullcalendar/core/locales/fa";

import type { CalendarView } from "@/entities/calendar/model/types";
import { parseReservationDate } from "@/entities/reservation/model/time-range";
import { formatDateForUrl } from "@/shared/lib/date/date-utils";

type CalendarGridProps = {
  view: CalendarView;
  date: Date;
  events: EventInput[];
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
  onDayClick: (day: Date) => void;
  calendarRef: React.RefObject<FullCalendar | null>;
};

export function CalendarGrid({
  view,
  date,
  events,
  onDateChange,
  onViewChange,
  onDayClick,
  calendarRef,
}: CalendarGridProps) {
  const isSyncingFromUrlRef = useRef(false);

  useEffect(() => {
    const api = calendarRef.current?.getApi();

    if (!api) {
      return;
    }

    isSyncingFromUrlRef.current = true;

    if (formatDateForUrl(api.getDate()) !== formatDateForUrl(date)) {
      api.gotoDate(date);
    }

    if (api.view.type !== view) {
      api.changeView(view);
    }

    isSyncingFromUrlRef.current = false;
  }, [calendarRef, date, view]);

  function handleDatesSet(dateInfo: DatesSetArg) {
    if (isSyncingFromUrlRef.current) {
      return;
    }

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

  function handleDateClick(dateInfo: DateClickArg) {
    onDayClick(dateInfo.date);
  }

  function handleEventClick(eventInfo: EventClickArg) {
    eventInfo.jsEvent.preventDefault();

    const startValue = eventInfo.event.start;

    if (!startValue) {
      return;
    }

    const timestamp = parseReservationDate(startValue.toISOString());

    onDayClick(timestamp !== undefined ? new Date(timestamp) : startValue);
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
      dateClick={handleDateClick}
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
