"use client";

import { useCallback } from "react";
import { parseAsString, useQueryState } from "nuqs";

import {
  CALENDAR_VIEWS,
  type CalendarView,
} from "@/entities/calendar/model/types";
import {
  formatDateForUrl,
  parseDateFromUrl,
} from "@/shared/lib/date/date-utils";

const DEFAULT_VIEW: CalendarView = "timeGridWeek";

function normalizeCalendarView(value: string | null): CalendarView {
  if (value && CALENDAR_VIEWS.includes(value as CalendarView)) {
    return value as CalendarView;
  }

  return DEFAULT_VIEW;
}

export function useCalendarUrlState() {
  const [viewParam, setViewParam] = useQueryState(
    "view",
    parseAsString.withDefault(DEFAULT_VIEW),
  );

  const [dateParam, setDateParam] = useQueryState("date", parseAsString);

  const view = normalizeCalendarView(viewParam);
  const date = parseDateFromUrl(dateParam);

  const setView = useCallback(
    async (nextView: CalendarView) => {
      if (nextView === viewParam) {
        return;
      }

      await setViewParam(nextView);
    },
    [setViewParam, viewParam],
  );

  const setDate = useCallback(
    async (nextDate: Date) => {
      const nextDateParam = formatDateForUrl(nextDate);

      if (nextDateParam === dateParam) {
        return;
      }

      await setDateParam(nextDateParam);
    },
    [dateParam, setDateParam],
  );

  return {
    view,
    date,
    setView,
    setDate,
  };
}
