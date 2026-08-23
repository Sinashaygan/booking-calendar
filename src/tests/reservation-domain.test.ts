import { describe, expect, it } from "vitest";

import {
  doTimeRangesOverlap,
  findReservationConflicts,
  hasReservationConflict,
} from "@/entities/reservation/model/conflict";
import {
  reservationInputSchema,
  reservationSchema,
} from "@/entities/reservation/model/schema";

const baseReservation = {
  id: "r-1",
  title: "Meeting",
  resourceId: "room-a",
  start: "2026-08-22T08:00:00",
  end: "2026-08-22T09:00:00",
  status: "confirmed" as const,
  customerName: "Customer",
};

describe("reservation schema", () => {
  it("accepts a valid reservation", () => {
    expect(reservationSchema.safeParse(baseReservation).success).toBe(true);
  });

  it("accepts a create input without id", () => {
    const { id: _id, ...input } = baseReservation;

    expect(reservationInputSchema.safeParse(input).success).toBe(true);
  });

  it("rejects invalid dates", () => {
    const result = reservationSchema.safeParse({
      ...baseReservation,
      start: "2026-02-30T08:00:00",
    });

    expect(result.success).toBe(false);
  });

  it("rejects end before start", () => {
    const result = reservationSchema.safeParse({
      ...baseReservation,
      end: "2026-08-22T07:00:00",
    });

    expect(result.success).toBe(false);
  });

  it("rejects equal start and end", () => {
    const result = reservationSchema.safeParse({
      ...baseReservation,
      end: baseReservation.start,
    });

    expect(result.success).toBe(false);
  });

  it("accepts exactly fifteen minutes", () => {
    const result = reservationSchema.safeParse({
      ...baseReservation,
      end: "2026-08-22T08:15:00",
    });

    expect(result.success).toBe(true);
  });

  it("rejects durations under fifteen minutes", () => {
    const result = reservationSchema.safeParse({
      ...baseReservation,
      end: "2026-08-22T08:14:59",
    });

    expect(result.success).toBe(false);
  });
});

describe("reservation conflicts", () => {
  it("allows adjacent ranges", () => {
    expect(
      doTimeRangesOverlap(
        "2026-08-22T08:00:00",
        "2026-08-22T09:00:00",
        "2026-08-22T09:00:00",
        "2026-08-22T10:00:00",
      ),
    ).toBe(false);
  });

  it("detects partial overlap", () => {
    expect(
      doTimeRangesOverlap(
        "2026-08-22T08:00:00",
        "2026-08-22T09:00:00",
        "2026-08-22T08:30:00",
        "2026-08-22T10:00:00",
      ),
    ).toBe(true);
  });

  it("detects containment", () => {
    expect(
      doTimeRangesOverlap(
        "2026-08-22T08:00:00",
        "2026-08-22T12:00:00",
        "2026-08-22T09:00:00",
        "2026-08-22T10:00:00",
      ),
    ).toBe(true);
  });

  it("ignores another resource", () => {
    expect(
      hasReservationConflict(
        {
          resourceId: "room-b",
          start: "2026-08-22T08:30:00",
          end: "2026-08-22T09:30:00",
        },
        [baseReservation],
      ),
    ).toBe(false);
  });

  it("ignores cancelled reservations", () => {
    expect(
      hasReservationConflict(
        {
          resourceId: "room-a",
          start: "2026-08-22T08:30:00",
          end: "2026-08-22T09:30:00",
        },
        [{ ...baseReservation, status: "cancelled" }],
      ),
    ).toBe(false);
  });

  it("detects pending reservations", () => {
    expect(
      hasReservationConflict(
        {
          resourceId: "room-a",
          start: "2026-08-22T08:30:00",
          end: "2026-08-22T09:30:00",
        },
        [{ ...baseReservation, status: "pending" }],
      ),
    ).toBe(true);
  });

  it("supports excludeId during update", () => {
    expect(
      hasReservationConflict(
        {
          resourceId: baseReservation.resourceId,
          start: baseReservation.start,
          end: baseReservation.end,
        },
        [baseReservation],
        { excludeId: baseReservation.id },
      ),
    ).toBe(false);
  });

  it("returns all conflicts", () => {
    const conflicts = findReservationConflicts(
      {
        resourceId: "room-a",
        start: "2026-08-22T08:30:00",
        end: "2026-08-22T09:30:00",
      },
      [
        baseReservation,
        {
          ...baseReservation,
          id: "r-2",
          start: "2026-08-22T08:45:00",
          end: "2026-08-22T09:45:00",
        },
      ],
    );

    expect(conflicts).toHaveLength(2);
  });
});
