"use client";

import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import type { CalendarView } from "@/entities/calendar/model/types";
import { formatCalendarToolbarTitle } from "@/widgets/booking-calendar/lib/calendar-formatters";

type CalendarToolbarProps = {
  currentDate: Date;
  currentView: CalendarView;
  isFetching?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
};

const viewOptions: Array<{
  value: CalendarView;
  label: string;
}> = [
  {
    value: "dayGridMonth",
    label: "ماه",
  },
  {
    value: "timeGridWeek",
    label: "هفته",
  },
  {
    value: "timeGridDay",
    label: "روز",
  },
];

export function CalendarToolbar({
  currentDate,
  currentView,
  isFetching = false,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
}: CalendarToolbarProps) {
  const formattedDate = formatCalendarToolbarTitle(currentView, currentDate);

  return (
    <Stack
      sx={{
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
      }}
      spacing={2}
    >
      <Stack spacing={1.5} sx={{ direction: "row", alignItems: "center" }}>
        <CalendarDays size={24} color="#2563eb" />

        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              تقویم رزروها
            </Typography>

            {isFetching && (
              <CircularProgress size={16} aria-label="در حال به‌روزرسانی" />
            )}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>
        </Box>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <ButtonGroup variant="outlined">
          <Button onClick={onPrevious} aria-label="بازه قبلی">
            <ChevronRight size={18} />
          </Button>

          <Button onClick={onToday}>امروز</Button>

          <Button onClick={onNext} aria-label="بازه بعدی">
            <ChevronLeft size={18} />
          </Button>
        </ButtonGroup>

        <ToggleButtonGroup
          exclusive
          value={currentView}
          onChange={(_, value: CalendarView | null) => {
            if (value) {
              onViewChange(value);
            }
          }}
          size="small"
          aria-label="انتخاب نمای تقویم"
        >
          {viewOptions.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
}
