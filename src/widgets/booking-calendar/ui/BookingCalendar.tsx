"use client";

import Link from "next/link";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { CalendarDays, Plus } from "lucide-react";
import { CalendarView } from "@/entities/calendar/model/types";
import { useState } from "react";
import { CalendarGrid } from "./CalendarGrid";

export function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [currentView, setCurrentView] = useState<CalendarView>("timeGridWeek");

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
        <Stack
          spacing={2}
          sx={{
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              تقویم رزروها
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              مدیریت زمان‌بندی منابع و رزروهای مجموعه
            </Typography>
          </Box>

          <Button
            component={Link}
            href="/calendar"
            variant="contained"
            startIcon={<Plus size={18} />}
          >
            رزرو جدید
          </Button>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            minHeight: 520,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: { xs: 1, md: 2 },
          }}
        >
          <CalendarGrid
            view={currentView}
            date={currentDate}
            events={[]}
            onDateChange={setCurrentDate}
            onViewChange={setCurrentView}
          />
        </Paper>
      </Stack>
    </Box>
  );
}
