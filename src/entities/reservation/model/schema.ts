import { z } from "zod";

import { isValidTimeRange, isValidReservationDate } from "./time-range";
import type { Reservation } from "./types";

export const reservationStatusSchema = z.enum([
  "confirmed",
  "pending",
  "cancelled",
]);

const reservationFields = {
  title: z.string().trim().min(1, "Title is required"),
  resourceId: z.string().trim().min(1, "Resource is required"),
  start: z.string().refine(isValidReservationDate, {
    message: "Start must be a valid ISO-like date",
  }),
  end: z.string().refine(isValidReservationDate, {
    message: "End must be a valid ISO-like date",
  }),
  status: reservationStatusSchema,
  customerName: z.string().trim().min(1, "Customer name is required"),
};

const reservationObjectSchema = z.object(reservationFields);

const timeRangeRules = <
  T extends z.ZodObject<{
    start: typeof reservationFields.start;
    end: typeof reservationFields.end;
  }>,
>(
  schema: T,
) =>
  schema.superRefine((value, context) => {
    const duration = isValidTimeRange(value.start, value.end);

    if (!duration) {
      context.addIssue({
        code: "custom",
        path: ["end"],
        message:
          "End must be after start and duration must be at least 15 minutes",
      });
    }
  });

export const reservationInputSchema = timeRangeRules(
  z.object(reservationFields),
);

export const reservationSchema = timeRangeRules(
  z.object({
    id: z.string().trim().min(1, "Id is required"),
    ...reservationFields,
  }),
);

export type ReservationInputSchema = z.infer<typeof reservationInputSchema>;

export function safeParseReservation(
  value: unknown,
): ReturnType<typeof reservationSchema.safeParse> {
  return reservationSchema.safeParse(value);
}

export function validateReservation(value: unknown): Reservation {
  return reservationSchema.parse(value);
}

export const reservationUpdateSchema = reservationObjectSchema
  .partial()
  .superRefine((value, context) => {
    const hasStart = value.start !== undefined;
    const hasEnd = value.end !== undefined;
    
    if (hasStart !== hasEnd) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [hasStart ? "end" : "start"],
        message: "Both start and end must be provided if one is updated",
      });

      return;
    }
    
    if (hasStart && hasEnd && !isValidTimeRange(value.start, value.end)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end"],
        message:
          "End must be after start and duration must be at least 15 minutes",
      });
    }
  });

export type ReservationUpdateInput = z.infer<typeof reservationUpdateSchema>;