"use client";

import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import type { Reservation } from "@/entities/reservation/model/types";

import {
  formatPersianTimeFromApi,
  getReservationStatusColor,
  getReservationStatusLabel,
} from "../lib/calendar-formatters";
import { CalendarEventActions } from "./CalendarEventActions";

type ResourceOption = {
  id: string;
  label: string;
};

type CalendarEventItemProps = {
  reservation: Reservation;
  resources: readonly ResourceOption[];
  disabled?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function CalendarEventItem({
  reservation,
  resources,
  disabled = false,
  onEdit,
  onDelete,
}: CalendarEventItemProps) {
  const resourceLabel =
    resources.find((resource) => resource.id === reservation.resourceId)
      ?.label ?? reservation.resourceId;

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ alignItems: { sm: "flex-start" }, justifyContent: "space-between" }}
      >
        <Stack spacing={1} sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {reservation.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" noWrap>
            {reservation.customerName}
          </Typography>

          <Typography variant="body2" color="text.secondary" noWrap>
            {resourceLabel}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Chip
              size="small"
              label={getReservationStatusLabel(reservation.status)}
              sx={{
                bgcolor: getReservationStatusColor(reservation.status),
                color: "#fff",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {formatPersianTimeFromApi(reservation.start)} تا{" "}
              {formatPersianTimeFromApi(reservation.end)}
            </Typography>
          </Stack>
        </Stack>

        <CalendarEventActions
          disabled={disabled}
          onEdit={() => onEdit(reservation.id)}
          onDelete={() => onDelete(reservation.id)}
        />
      </Stack>
    </Box>
  );
}
