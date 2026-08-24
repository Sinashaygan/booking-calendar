"use client";

import EventBusyIcon from "@mui/icons-material/EventBusy";
import { Box, Stack, Typography } from "@mui/material";

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
      <Stack spacing={1.5} sx={{ alignItems: "center", py: 6, px: 2, textAlign: "center" }}>
        <Box sx={{ width: 64, height: 64, display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: "primary.50", color: "primary.main" }}>
          <EventBusyIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography color="text.secondary">
          هیچ رزروی برای این روز ثبت نشده است
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
