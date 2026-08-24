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
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            boxShadow: "0 24px 70px rgba(15, 23, 42, 0.2)",
            backgroundImage: "none",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
          py: 2.25,
          bgcolor: "#fbfcff",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            رویدادهای روز
          </Typography>
          {day && (
            <Typography variant="body2" color="text.secondary">
              رویدادهای{" "}
              {new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(day)}
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

      <DialogContent
        dividers
        sx={{ position: "relative", p: { xs: 2, sm: 3 }, bgcolor: "#f8fafc" }}
      >
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
