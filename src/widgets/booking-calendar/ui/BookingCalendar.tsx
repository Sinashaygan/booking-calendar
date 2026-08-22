"use client";

import { useMemo, useRef } from "react";

import type FullCalendar from "@fullcalendar/react";
import { Box, Paper, Stack } from "@mui/material";

import { reservationsToCalendarEvents } from "@/entities/calendar/lib/calendar-mappers";
import { mockReservations } from "@/entities/reservation/model/mock-reservations";
import { CalendarToolbar } from "@/features/calendar-navigation/ui/calendar-toolbar";
import { useCalendarUrlState } from "@/features/calendar-navigation/model/use-calendar-url-state";
import { CalendarGrid } from "./CalendarGrid";

export function BookingCalendar() {
  const calendarRef = useRef<FullCalendar | null>(null);

  const { view, date, setView, setDate } = useCalendarUrlState();

  const events = useMemo(
    () => reservationsToCalendarEvents(mockReservations),
    [],
  );

  function handlePrevious() {
    calendarRef.current?.getApi().prev();
  }

  function handleNext() {
    calendarRef.current?.getApi().next();
  }

  function handleToday() {
    calendarRef.current?.getApi().today();
  }

  function handleViewChange(nextView: typeof view) {
    const api = calendarRef.current?.getApi();

    if (api && api.view.type !== nextView) {
      api.changeView(nextView);
    }
  }

  async function handleDateChange(nextDate: Date) {
    const api = calendarRef.current?.getApi();

    if (api && api.getDate().getTime() === nextDate.getTime()) {
      await setDate(nextDate);
      return;
    }

    await setDate(nextDate);
  }

  async function handleCalendarViewChange(nextView: typeof view) {
    if (nextView !== view) {
      await setView(nextView);
    }
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Stack
        spacing={4}
        sx={{
          maxWidth: 1280,
          mx: "auto",
        }}
      >
        <CalendarToolbar
          currentDate={date}
          currentView={view}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          onViewChange={handleViewChange}
        />

        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: { xs: 1, md: 2 },
          }}
        >
          <CalendarGrid
            calendarRef={calendarRef}
            view={view}
            date={date}
            events={events}
            onDateChange={handleDateChange}
            onViewChange={handleCalendarViewChange}
          />
        </Paper>
      </Stack>
    </Box>
  );
}
