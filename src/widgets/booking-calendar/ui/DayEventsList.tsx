"use client";

import EventBusyIcon from "@mui/icons-material/EventBusy";
import { Stack, Typography } from "@mui/material";

import type { Reservation } from "@/entities/reservation/model/types";

import { CalendarEventItem } from "./CalendarEventItem";

type ResourceOption = {
  id: string;
  label: string;
};

type DayEventsListProps = {
  events: Reservation[];
  resources: readonly ResourceOption[];
  disabled?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function DayEventsList({
  events,
  resources,
  disabled = false,
  onEdit,
  onDelete,
}: DayEventsListProps) {
  if (events.length === 0) {
    return (
      <Stack spacing={1.5} sx={{ alignItems: "center", py: 4 }}>
        <EventBusyIcon color="disabled" sx={{ fontSize: 40 }} />
        <Typography color="text.secondary">
          برای این روز رزروی ثبت نشده است.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5}>
      {events.map((event) => (
        <CalendarEventItem
          key={event.id}
          reservation={event}
          resources={resources}
          disabled={disabled}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  );
}
