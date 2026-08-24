"use client";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";

import type { Reservation, ReservationInput } from "@/entities/reservation/model/types";
import { ReservationForm } from "@/features/booking-form/ui/reservation-form";

type ResourceOption = {
  id: string;
  label: string;
};

type EditReservationDialogProps = {
  open: boolean;
  reservation: Reservation | null;
  resources: readonly ResourceOption[];
  isPending: boolean;
  submitError: string | null;
  onClose: () => void;
  onSubmit: (input: ReservationInput) => void | Promise<void>;
  onDeleteRequest: () => void;
};

export function EditReservationDialog({
  open,
  reservation,
  resources,
  isPending,
  submitError,
  onClose,
  onSubmit,
  onDeleteRequest,
}: EditReservationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <EditIcon fontSize="small" />
          <span>ویرایش رزرو</span>
        </Stack>

        <Tooltip title="بستن">
          <span>
            <IconButton onClick={onClose} disabled={isPending}>
              <CloseIcon />
            </IconButton>
          </span>
        </Tooltip>
      </DialogTitle>

      <DialogContent dividers>
        {reservation && (
          <Stack spacing={2}>
            <ReservationForm
              resources={resources}
              defaultValues={reservation}
              isPending={isPending}
              submitError={submitError}
              submitLabel="ذخیره تغییرات"
              onSubmit={onSubmit}
              onCancel={onClose}
            />

            <Button
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={onDeleteRequest}
              disabled={isPending}
            >
              حذف این رزرو
            </Button>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
