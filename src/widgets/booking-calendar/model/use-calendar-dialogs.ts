"use client";

import { useCallback, useState } from "react";

export type CalendarDialogType = "create" | "edit" | "delete" | "day-events" | null;

export function useCalendarDialogs() {
  const [dialog, setDialog] = useState<CalendarDialogType>(null);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const closeDialog = useCallback(() => {
    setDialog(null);
    setSelectedReservationId(null);
    setSelectedDay(null);
  }, []);

  const openCreateDrawer = useCallback(() => {
    setSelectedReservationId(null);
    setSelectedDay(null);
    setDialog("create");
  }, []);

  const openEditDialog = useCallback((id: string) => {
    setSelectedReservationId(id);
    setDialog("edit");
  }, []);

  const openDeleteDialog = useCallback((id: string) => {
    setSelectedReservationId(id);
    setDialog("delete");
  }, []);

  const openDayEventsDialog = useCallback((day: Date) => {
    setSelectedDay(day);
    setDialog("day-events");
  }, []);

  return {
    dialog,
    selectedReservationId,
    selectedDay,
    setDialog,
    closeDialog,
    openCreateDrawer,
    openEditDialog,
    openDeleteDialog,
    openDayEventsDialog,
  };
}
