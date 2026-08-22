export const CALENDAR_VIEWS = [
  "dayGridMonth",
  "timeGridWeek",
  "timeGridDay",
] as const;

export type CalendarView = (typeof CALENDAR_VIEWS)[number];

export type CalendarDateRange = {
  start: Date;
  end: Date;
};
