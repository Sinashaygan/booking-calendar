import type {
  Reservation,
} from "@/entities/reservation/model/types";

export type MutationError = {
  field?: string;
  message: string;
};

export type MutationSuccess<T> = {
  ok: true;
  value: T;
};

export type MutationFailureReason = "validation" | "conflict" | "not-found";

export type MutationFailure = {
  ok: false;
  reason: MutationFailureReason;
  errors: MutationError[];
  conflicts: Reservation[];
};

export type MutationResult<T> = MutationSuccess<T> | MutationFailure;

export type CreateReservationCommand = {
  input: unknown;
  reservations: readonly Reservation[];
  createId?: () => string;
};

export type UpdateReservationCommand = {
  id: string;
  input: unknown;
  reservations: readonly Reservation[];
};
