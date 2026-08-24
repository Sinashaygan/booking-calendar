"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import type { Reservation } from "@/entities/reservation/model/types";

import { formatPersianFullDate } from "../lib/calendar-formatters";
import { DayEventsList } from "./DayEventsList";

type ResourceOption = {
  id: string;
  label: string;
};

type DayEventsDialogProps = {
  open: boolean;
  day: Date | null;
  events: Reservation[];
  resources: readonly ResourceOption[];
  isFetching?: boolean;
  isMutationPending?: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function DayEventsDialog({
  open,
  day,
  events,
  resources,
  isFetching = false,
  isMutationPending = false,
  onClose,
  onEdit,
  onDelete,
}: DayEventsDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (isMutationPending) {
          return;
        }

        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          onClose();
        }
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h6">رویدادهای روز</Typography>
          {day && (
            <Typography variant="body2" color="text.secondary">
              {formatPersianFullDate(day)}
            </Typography>
          )}
        </Stack>

        <Tooltip title="بستن">
          <span>
            <IconButton
              aria-label="بستن"
              onClick={onClose}
              disabled={isMutationPending}
            >
              <CloseIcon />
            </IconButton>
          </span>
        </Tooltip>
      </DialogTitle>

      <DialogContent dividers sx={{ position: "relative" }}>
        {isFetching && (
          <LinearProgress
            aria-label="در حال دریافت رزروها"
            sx={{ position: "absolute", top: 0, right: 0, left: 0 }}
          />
        )}

        <DayEventsList
          events={events}
          resources={resources}
          disabled={isMutationPending}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </DialogContent>
    </Dialog>
  );
}
