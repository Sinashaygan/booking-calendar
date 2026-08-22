import type {
  Reservation,
  ReservationInput,
  ReservationUpdateInput,
} from "@/entities/reservation/model/types";

export type MutationError = {
  field?: string;
  message: string;
};

export type MutationSuccess<T> = {
  ok: true;
  value: T;
};

export type MutationFailure = {
  ok: false;
  errors: MutationError[];
  conflicts: Reservation[];
};

export type MutationResult<T> = MutationSuccess<T> | MutationFailure;

export type CreateReservationCommand = {
  input: ReservationInput;
  reservations: readonly Reservation[];
  createId?: () => string;
};

export type UpdateReservationCommand = {
  id: string;
  input: ReservationUpdateInput;
  reservations: readonly Reservation[];
};
