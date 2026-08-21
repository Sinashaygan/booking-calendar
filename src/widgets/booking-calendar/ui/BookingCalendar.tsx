"use client";

import Link from "next/link";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { CalendarDays, Plus } from "lucide-react";

export function BookingCalendar() {
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
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              textAlign: "center",
              maxWidth: 460,
            }}
          >
            <CalendarDays size={52} color="#2563eb" />

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Calendar Shell آماده است
            </Typography>

            <Typography variant="body2" color="text.secondary">
              در مرحله بعد، موتور FullCalendar، Toolbar، Viewهای مختلف و
              Resourceهای رزرو به این بخش اضافه خواهند شد.
            </Typography>

            <Typography
              variant="caption"
              color="success.main"
              sx={{
                borderRadius: 10,
                bgcolor: "success.50",
                px: 2,
                py: 0.75,
              }}
            >
              Bootstrap موفق بود
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
