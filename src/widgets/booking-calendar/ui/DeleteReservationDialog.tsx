"use client";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import type { Reservation } from "@/entities/reservation/model/types";

type DeleteReservationDialogProps = {
  open: boolean;
  reservation: Reservation | null;
  isPending: boolean;
  deleteError: string | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export function DeleteReservationDialog({
  open,
  reservation,
  isPending,
  deleteError,
  onClose,
  onConfirm,
}: DeleteReservationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        حذف رزرو
        <Tooltip title="بستن">
          <span>
            <IconButton onClick={onClose} disabled={isPending}>
              <CloseIcon />
            </IconButton>
          </span>
        </Tooltip>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={1}>
          <Typography>آیا از حذف این رزرو مطمئن هستید؟</Typography>
          <Typography color="text.secondary">
            این عملیات قابل بازگشت نیست.
          </Typography>

          {reservation && (
            <Typography variant="body2">
              {reservation.title} — {reservation.resourceId}
            </Typography>
          )}

          {deleteError && <Alert severity="error">{deleteError}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          انصراف
        </Button>
        <Button
          color="error"
          variant="contained"
          startIcon={<DeleteIcon />}
          onClick={() => void onConfirm()}
          disabled={isPending}
        >
          {isPending ? "در حال حذف..." : "حذف رزرو"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
