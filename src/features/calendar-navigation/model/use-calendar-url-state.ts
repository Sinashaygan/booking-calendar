"use client";

import { useQueryState, parseAsString } from "nuqs";

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

  async function setView(nextView: CalendarView) {
    if (nextView === view) {
      return;
    }
    await setViewParam(nextView);
  }

  async function setDate(nextDate: Date) {
    if (nextDate === date) {
      return;
    }

    await setDateParam(formatDateForUrl(nextDate));
  }

  return {
    view,
    date,
    setView,
    setDate,
  };
}
