"use client";

import { useMemo, useRef, useState } from "react";

import type FullCalendar from "@fullcalendar/react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import { reservationsToCalendarEvents } from "@/entities/calendar/lib/calendar-mappers";
import type { ReservationInput } from "@/entities/reservation/model/types";
import { useCalendarUrlState } from "@/features/calendar-navigation/model/use-calendar-url-state";
import { CalendarToolbar } from "@/features/calendar-navigation/ui/calendar-toolbar";
import { ReservationForm } from "@/features/booking-form/ui/reservation-form";
import { useCreateReservation } from "@/features/reservation-mutations/api/use-create-reservation";
import { useDeleteReservation } from "@/features/reservation-mutations/api/use-delete-reservation";
import { useReservations } from "@/features/reservation-mutations/api/use-reservations";
import { useUpdateReservation } from "@/features/reservation-mutations/api/use-update-reservation";
import { getReservationMutationErrorMessage } from "@/features/reservation-mutations/model/error-message";

import { CalendarGrid } from "./CalendarGrid";

const resources = [
  { id: "room-a", label: "اتاق A" },
  { id: "room-b", label: "اتاق B" },
  { id: "room-c", label: "اتاق C" },
] as const;

function getDefaultReservationValues(): Partial<ReservationInput> {
  const now = new Date();

  const start = new Date(now);
  start.setSeconds(0, 0);

  const roundedMinutes = Math.ceil(start.getMinutes() / 15) * 15;

  if (roundedMinutes === 60) {
    start.setHours(start.getHours() + 1);
    start.setMinutes(0);
  } else {
    start.setMinutes(roundedMinutes);
  }

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 30);

  function toLocalDateTime(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    const hours = String(value.getHours()).padStart(2, "0");
    const minutes = String(value.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }

  return {
    title: "",
    customerName: "",
    resourceId: resources[0]?.id ?? "",
    start: toLocalDateTime(start),
    end: toLocalDateTime(end),
    status: "pending",
  };
}

export function BookingCalendar() {
  const calendarRef = useRef<FullCalendar | null>(null);

  const { view, date, setView, setDate } = useCalendarUrlState();
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);
  const [dialog, setDialog] = useState<"edit" | "delete" | "create" | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const updateReservation = useUpdateReservation();
  const deleteReservation = useDeleteReservation();
  const createReservation = useCreateReservation();

  const {
    data: reservations,
    isPending,
    isFetching,
    isError,
    error,
  } = useReservations();

  const events = useMemo(
    () => reservationsToCalendarEvents(reservations ?? []),
    [reservations],
  );

  const selectedReservation = useMemo(
    () =>
      reservations?.find(
        (reservation) => reservation.id === selectedReservationId,
      ) ?? null,
    [reservations, selectedReservationId],
  );

  const editDefaultValues = useMemo<Partial<ReservationInput> | undefined>(
    () => selectedReservation ?? undefined,
    [selectedReservation],
  );

  const createDefaultValues = useMemo(() => getDefaultReservationValues(), []);

  function openCreateDrawer() {
    setSubmitError(null);
    setDeleteError(null);
    setSelectedReservationId(null);
    setDialog("create");
  }

  function openReservationDialog(id: string) {
    setSelectedReservationId(id);
    setSubmitError(null);
    setDeleteError(null);
    setDialog("edit");
  }

  function closeDialog() {
    if (
      createReservation.isPending ||
      updateReservation.isPending ||
      deleteReservation.isPending
    ) {
      return;
    }

    setDialog(null);
    setSelectedReservationId(null);
    setSubmitError(null);
    setDeleteError(null);
  }

  async function handleCreate(input: ReservationInput) {
    setSubmitError(null);

    try {
      await createReservation.mutateAsync(input);
      closeDialog();
    } catch (error: unknown) {
      setSubmitError(getReservationMutationErrorMessage(error));
    }
  }

  async function handleUpdate(input: ReservationInput) {
    if (!selectedReservation) return;

    setSubmitError(null);

    try {
      await updateReservation.mutateAsync({
        id: selectedReservation.id,
        input,
      });
      closeDialog();
    } catch (error: unknown) {
      setSubmitError(getReservationMutationErrorMessage(error));
    }
  }

  async function handleDelete() {
    if (!selectedReservation) return;

    setDeleteError(null);

    try {
      await deleteReservation.mutateAsync(selectedReservation.id);
      closeDialog();
    } catch (error: unknown) {
      setDeleteError(getReservationMutationErrorMessage(error));
    }
  }

  function handlePrevious() {
    calendarRef.current?.getApi().prev();
  }

  function handleNext() {
    calendarRef.current?.getApi().next();
  }

  function handleToday() {
    calendarRef.current?.getApi().today();
  }

  function handleViewChange(nextView: typeof view) {
    const api = calendarRef.current?.getApi();

    if (api && api.view.type !== nextView) {
      api.changeView(nextView);
    }
  }

  async function handleDateChange(nextDate: Date) {
    const api = calendarRef.current?.getApi();

    if (api && api.getDate().getTime() === nextDate.getTime()) {
      await setDate(nextDate);
      return;
    }

    await setDate(nextDate);
  }

  async function handleCalendarViewChange(nextView: typeof view) {
    if (nextView !== view) {
      await setView(nextView);
    }
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Stack
        spacing={4}
        sx={{
          maxWidth: 1280,
          mx: "auto",
        }}
      >
        <CalendarToolbar
          currentDate={date}
          currentView={view}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          onViewChange={handleViewChange}
        />

        <Stack
          direction="row"
          sx={{ direction: "rtl", justifyContent: "flex-start" }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDrawer}
          >
            افزودن رزرو
          </Button>
        </Stack>

        {isError && (
          <Alert severity="error">
            {error instanceof Error
              ? error.message
              : "دریافت رزروها با خطا مواجه شد."}
          </Alert>
        )}

        <Paper
          elevation={0}
          aria-busy={isFetching}
          sx={{
            position: "relative",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: { xs: 1, md: 2 },
          }}
        >
          {isFetching && (
            <LinearProgress
              aria-label="در حال دریافت رزروها"
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                left: 0,
                zIndex: 1,
              }}
            />
          )}

          {!isPending && (
            <CalendarGrid
              calendarRef={calendarRef}
              view={view}
              date={date}
              events={events}
              onDateChange={handleDateChange}
              onViewChange={handleCalendarViewChange}
              onReservationClick={openReservationDialog}
            />
          )}
        </Paper>
      </Stack>

      <Drawer
        anchor="right"
        open={dialog === "create"}
        onClose={closeDialog}
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
                <IconButton
                  onClick={closeDialog}
                  disabled={createReservation.isPending}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Stack>

            {submitError && <Alert severity="error">{submitError}</Alert>}

            <ReservationForm
              resources={resources}
              defaultValues={createDefaultValues}
              isPending={createReservation.isPending}
              submitLabel="ثبت رزرو"
              onSubmit={handleCreate}
              onCancel={closeDialog}
            />
          </Stack>
        </Box>
      </Drawer>

      <Dialog
        open={dialog === "edit" && Boolean(selectedReservation)}
        onClose={closeDialog}
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
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <EditIcon fontSize="small" />
            <span>ویرایش رزرو</span>
          </Stack>
          <Tooltip title="بستن">
            <IconButton
              onClick={closeDialog}
              disabled={updateReservation.isPending}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          {selectedReservation && (
            <Stack spacing={2}>
              <ReservationForm
                resources={resources}
                defaultValues={editDefaultValues}
                isPending={updateReservation.isPending}
                submitError={submitError}
                submitLabel="ذخیره تغییرات"
                onSubmit={handleUpdate}
                onCancel={closeDialog}
              />
              <Button
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  if (!updateReservation.isPending) {
                    setDialog("delete");
                    setDeleteError(null);
                  }
                }}
                disabled={updateReservation.isPending}
              >
                حذف این رزرو
              </Button>
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog === "delete" && Boolean(selectedReservation)}
        onClose={closeDialog}
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
          حذف رزرو
          <Tooltip title="بستن">
            <IconButton
              onClick={closeDialog}
              disabled={deleteReservation.isPending}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1}>
            <Typography>آیا از حذف این رزرو مطمئن هستید؟</Typography>
            <Typography color="text.secondary">
              این عملیات قابل بازگشت نیست.
            </Typography>
            {selectedReservation && (
              <Typography variant="body2">
                {selectedReservation.title} — {selectedReservation.resourceId}
              </Typography>
            )}
            {deleteError && <Alert severity="error">{deleteError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={deleteReservation.isPending}>
            انصراف
          </Button>
          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={() => void handleDelete()}
            disabled={deleteReservation.isPending}
          >
            {deleteReservation.isPending ? "در حال حذف..." : "حذف رزرو"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
