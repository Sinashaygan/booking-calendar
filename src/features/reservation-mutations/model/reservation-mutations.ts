import { findReservationConflicts } from "@/entities/reservation/model/conflict";
import {
  reservationInputSchema,
  reservationUpdateSchema,
} from "@/entities/reservation/model/schema";
import type {
  Reservation,
  ReservationInput,
} from "@/entities/reservation/model/types";

import type {
  CreateReservationCommand,
  MutationError,
  MutationResult,
  UpdateReservationCommand,
} from "./mutation-types";

export function zodErrors(error: {
  issues: readonly {
    path: PropertyKey[];
    message: string;
  }[];
}): MutationError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

export function defaultIdFactory(): string {
  return `reservation-${crypto.randomUUID()}`;
}

export function prepareCreateReservation({
  input,
  reservations,
  createId = defaultIdFactory,
}: CreateReservationCommand): MutationResult<Reservation> {
  const parsed = reservationInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      reason: "validation",
      errors: zodErrors(parsed.error),
      conflicts: [],
    };
  }

  const conflicts = findReservationConflicts(parsed.data, reservations);

  if (conflicts.length > 0) {
    return {
      ok: false,
      reason: "conflict",
      errors: [
        {
          field: "start",
          message: "Reservation conflicts with another reservation",
        },
      ],
      conflicts,
    };
  }

  const reservation: Reservation = {
    id: createId(),
    ...parsed.data,
  };

  return {
    ok: true,
    value: reservation,
  };
}

export function prepareUpdateReservation({
  id,
  input,
  reservations,
}: UpdateReservationCommand): MutationResult<Reservation> {
  const current = reservations.find((reservation) => reservation.id === id);

  if (!current) {
    return {
      ok: false,
      reason: "not-found",
      errors: [{ message: "Reservation was not found" }],
      conflicts: [],
    };
  }

  const patch = reservationUpdateSchema.safeParse(input);

  if (!patch.success) {
    return {
      ok: false,
      reason: "validation",
      errors: zodErrors(patch.error),
      conflicts: [],
    };
  }

  const candidate: ReservationInput = {
    ...current,
    ...patch.data,
  };

  const parsed = reservationInputSchema.safeParse(candidate);

  if (!parsed.success) {
    return {
      ok: false,
      reason: "validation",
      errors: zodErrors(parsed.error),
      conflicts: [],
    };
  }

  const conflicts = findReservationConflicts(parsed.data, reservations, {
    excludeId: id,
  });

  if (conflicts.length > 0) {
    return {
      ok: false,
      reason: "conflict",
      errors: [
        {
          field: "start",
          message: "Reservation conflicts with another reservation",
        },
      ],
      conflicts,
    };
  }

  const updated: Reservation = {
    id,
    ...parsed.data,
  };

  return {
    ok: true,
    value: updated,
  };
}
