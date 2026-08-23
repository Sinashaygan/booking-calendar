import { describe, expect, it } from "vitest";

import {
  prepareCreateReservation,
  prepareUpdateReservation,
} from "@/features/reservation-mutations/model/reservation-mutations";

const existingReservation = {
  id: "r-1",
  title: "Existing",
  resourceId: "room-a",
  start: "2026-08-22T08:00:00",
  end: "2026-08-22T09:00:00",
  status: "confirmed" as const,
  customerName: "Customer",
};

const validInput = {
  title: "New reservation",
  resourceId: "room-a",
  start: "2026-08-22T09:00:00",
  end: "2026-08-22T10:00:00",
  status: "pending" as const,
  customerName: "New customer",
};

describe("reservation mutations", () => {
  it("creates a reservation with generated id", () => {
    const result = prepareCreateReservation({
      input: validInput,
      reservations: [existingReservation],
      createId: () => "generated-id",
    });

    expect(result).toEqual({
      ok: true,
      value: {
        id: "generated-id",
        ...validInput,
      },
    });
  });

  it("rejects create when conflict exists", () => {
    const result = prepareCreateReservation({
      input: {
        ...validInput,
        start: "2026-08-22T08:30:00",
        end: "2026-08-22T09:30:00",
      },
      reservations: [existingReservation],
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.conflicts).toHaveLength(1);
    }
  });

  it("updates the same reservation without self-conflict", () => {
    const result = prepareUpdateReservation({
      id: "r-1",
      input: {
        title: "Updated title",
      },
      reservations: [existingReservation],
    });

    expect(result).toEqual({
      ok: true,
      value: {
        ...existingReservation,
        title: "Updated title",
      },
    });
  });

  it("rejects update when another reservation conflicts", () => {
    const result = prepareUpdateReservation({
      id: "r-1",
      input: {
        start: "2026-08-22T08:30:00",
        end: "2026-08-22T09:30:00",
      },
      reservations: [
        existingReservation,
        {
          ...existingReservation,
          id: "r-2",
          start: "2026-08-22T10:00:00",
          end: "2026-08-22T11:00:00",
        },
      ],
    });

    expect(result.ok).toBe(true);
  });
});
