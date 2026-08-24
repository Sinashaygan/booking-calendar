"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Divider,
  LinearProgress,
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
        gap: { xs: 2, md: 4 },
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isFetching && (
        <LinearProgress
          aria-label="در حال به‌روزرسانی"
          sx={{ position: "absolute", inset: "auto 0 0", height: 2 }}
        />
      )}

      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            display: "grid",
            placeItems: "center",
            borderRadius: 2,
            bgcolor: "primary.50",
            color: "primary.main",
          }}
        >
          <CalendarDays size={23} />
        </Box>

        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              تقویم رزروها
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {formattedDate}
          </Typography>
        </Box>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ alignItems: { sm: "center" } }}>
        <ButtonGroup variant="outlined" sx={{ direction: "ltr" }}>
          <Button onClick={onPrevious} aria-label="بازه قبلی" sx={{ minWidth: 44 }}>
            <ChevronRight size={18} />
          </Button>

          <Button onClick={onToday} sx={{ px: 2.5 }}>امروز</Button>

          <Button onClick={onNext} aria-label="بازه بعدی" sx={{ minWidth: 44 }}>
            <ChevronLeft size={18} />
          </Button>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

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
          sx={{ alignSelf: { xs: "stretch", sm: "auto" } }}
        >
          {viewOptions.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              <Chip label={option.label} size="small" sx={{ pointerEvents: "none", bgcolor: "transparent" }} />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
}
