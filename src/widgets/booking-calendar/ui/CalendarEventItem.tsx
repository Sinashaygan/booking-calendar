"use client";

import {
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  PersonOutlined as PersonOutlineIcon,
  MeetingRoomOutlined as MeetingRoomOutlinedIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";

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
        borderRadius: 2.5,
        p: { xs: 1.75, sm: 2 },
        bgcolor: "background.paper",
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
        transition: "all .2s ease-in-out",
        "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 20px rgba(15, 23, 42, 0.09)", borderColor: "primary.200" },
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

          <Stack spacing={0.5}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
              <PersonOutlineIcon sx={{ fontSize: 17, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary" noWrap>{reservation.customerName}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
              <MeetingRoomOutlinedIcon sx={{ fontSize: 17, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary" noWrap>{resourceLabel}</Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 0.25 }} />
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Chip
              size="small"
              label={getReservationStatusLabel(reservation.status)}
              sx={{
                bgcolor: getReservationStatusColor(reservation.status),
                color: reservation.status === "confirmed" ? "#166534" : reservation.status === "pending" ? "#92400e" : "#64748b",
                fontWeight: 700,
              }}
            />
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <AccessTimeIcon sx={{ fontSize: 16, color: "primary.main" }} />
              <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 700 }}>
              {formatPersianTimeFromApi(reservation.start)} تا{" "}
              {formatPersianTimeFromApi(reservation.end)}
              </Typography>
            </Stack>
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
