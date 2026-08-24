"use client";

import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import {
  Alert,
  Box,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import type { ReservationInput } from "@/entities/reservation/model/types";
import { ReservationForm } from "@/features/booking-form/ui/reservation-form";

type ResourceOption = {
  id: string;
  label: string;
};

type CreateReservationDrawerProps = {
  open: boolean;
  resources: readonly ResourceOption[];
  defaultValues: Partial<ReservationInput>;
  isPending: boolean;
  submitError: string | null;
  onClose: () => void;
  onSubmit: (input: ReservationInput) => void | Promise<void>;
};

export function CreateReservationDrawer({
  open,
  resources,
  defaultValues,
  isPending,
  submitError,
  onClose,
  onSubmit,
}: CreateReservationDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 520 },
          },
        },
      }}
    >
      <Box sx={{ p: 3, height: "100%", overflowY: "auto" }}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <EventIcon fontSize="small" />
              <Typography variant="h6">افزودن رزرو</Typography>
            </Stack>

            <Tooltip title="بستن">
              <span>
                <IconButton onClick={onClose} disabled={isPending}>
                  <CloseIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          {submitError && <Alert severity="error">{submitError}</Alert>}

          <ReservationForm
            resources={resources}
            defaultValues={defaultValues}
            isPending={isPending}
            submitLabel="ثبت رزرو"
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </Stack>
      </Box>
    </Drawer>
  );
}
