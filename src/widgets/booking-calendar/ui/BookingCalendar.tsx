"use client";

import { useMemo, useRef } from "react";

import type FullCalendar from "@fullcalendar/react";
// import AddIcon from "@mui/icons-material/Add";
import { Add as AddIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
} from "@mui/material";

import { reservationsToCalendarEvents } from "@/entities/calendar/lib/calendar-mappers";
import type { ReservationInput } from "@/entities/reservation/model/types";
import { CalendarToolbar } from "@/features/calendar-navigation/ui/calendar-toolbar";
import { useCalendarUrlState } from "@/features/calendar-navigation/model/use-calendar-url-state";
import { useReservations } from "@/features/reservation-mutations/api/use-reservations";

import { useCalendarDialogs } from "../model/use-calendar-dialogs";
import { useDayEvents } from "../model/use-day-events";
import { useReservationActions } from "../model/use-reservation-actions";
import { CalendarGrid } from "./CalendarGrid";
import { CreateReservationDrawer } from "./CreateReservationDrawer";
import { DayEventsDialog } from "./DayEventsDialog";
import { DeleteReservationDialog } from "./DeleteReservationDialog";
import { EditReservationDialog } from "./EditReservationDialog";

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

  const {
    data: reservations,
    isPending,
    isFetching,
    isError,
    error,
  } = useReservations();

  const {
    dialog,
    selectedReservationId,
    selectedDay,
    setDialog,
    closeDialog,
    openCreateDrawer,
    openEditDialog,
    openDeleteDialog,
    openDayEventsDialog,
  } = useCalendarDialogs();

  const {
    submitError,
    deleteError,
    isMutationPending,
    createReservation,
    clearErrors,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useReservationActions({
    selectedReservationId,
    onSuccess: () => {
      if (!isMutationPending) {
        closeDialog();
      }
    },
  });

  const guardedCloseDialog = () => {
    if (isMutationPending) {
      return;
    }

    closeDialog();
  };

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

  const createDefaultValues = useMemo(() => getDefaultReservationValues(), []);

  const dayEvents = useDayEvents(reservations, selectedDay);

  function handleOpenCreateDrawer() {
    clearErrors();
    openCreateDrawer();
  }

  function handleDayClick(day: Date) {
    clearErrors();
    openDayEventsDialog(day);
  }

  function handleEditFromDayEvents(id: string) {
    clearErrors();
    openEditDialog(id);
  }

  function handleDeleteFromDayEvents(id: string) {
    clearErrors();
    openDeleteDialog(id);
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

  function handleToolbarViewChange(nextView: typeof view) {
    const api = calendarRef.current?.getApi();

    if (api && api.view.type !== nextView) {
      api.changeView(nextView);
    }
  }

  async function handleDateChange(nextDate: Date) {
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
        background: "radial-gradient(circle at 100% 0%, rgba(99,102,241,.08), transparent 28%), #f6f8fc",
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
          isFetching={isFetching}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          onViewChange={handleToolbarViewChange}
        />

        <Stack direction="row" sx={{ direction: "rtl", justifyContent: "flex-start" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDrawer}
            sx={{
              px: 2.5,
              py: 1.15,
              borderRadius: 2,
              boxShadow: "0 8px 18px rgba(79, 70, 229, .22)",
              transition: "all .2s ease-in-out",
              "&:hover": { transform: "translateY(-1px)", boxShadow: "0 10px 22px rgba(79, 70, 229, .28)" },
            }}
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
            minHeight: 420,
            bgcolor: "background.paper",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
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

          {isPending ? (
            <Skeleton variant="rounded" height={360} />
          ) : (
            <CalendarGrid
              calendarRef={calendarRef}
              view={view}
              date={date}
              events={events}
              onDateChange={handleDateChange}
              onViewChange={handleCalendarViewChange}
              onDayClick={handleDayClick}
            />
          )}
        </Paper>
      </Stack>

      <CreateReservationDrawer
        open={dialog === "create"}
        resources={resources}
        defaultValues={createDefaultValues}
        isPending={createReservation.isPending}
        submitError={submitError}
        onClose={closeDialog}
        onSubmit={handleCreate}
      />

      <DayEventsDialog
        open={dialog === "day-events"}
        day={selectedDay}
        events={dayEvents}
        resources={resources}
        isFetching={isFetching}
        isMutationPending={isMutationPending}
        onClose={closeDialog}
        onEdit={handleEditFromDayEvents}
        onDelete={handleDeleteFromDayEvents}
      />

      <EditReservationDialog
        open={dialog === "edit" && Boolean(selectedReservation)}
        reservation={selectedReservation}
        resources={resources}
        isPending={isMutationPending}
        submitError={submitError}
        onClose={closeDialog}
        onSubmit={handleUpdate}
        onDeleteRequest={() => {
          if (!isMutationPending) {
            setDialog("delete");
          }
        }}
      />

      <DeleteReservationDialog
        open={dialog === "delete" && Boolean(selectedReservation)}
        reservation={selectedReservation}
        isPending={isMutationPending}
        deleteError={deleteError}
        onClose={closeDialog}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
