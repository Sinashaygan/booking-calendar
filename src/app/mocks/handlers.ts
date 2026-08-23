import { http, HttpResponse } from "msw";

import {
  createReservationRecord,
  getReservationById,
  getReservations,
  insertReservation,
  updateReservation,
  deleteReservation,
} from "./mock-db";

import {
  reservationInputSchema,
  reservationUpdateSchema,
} from "@/entities/reservation/model/schema";

import type {
  Reservation,
  ReservationInput,
  ReservationUpdateInput,
} from "@/entities/reservation/model/types";
import { hasReservationConflict } from "@/entities/reservation/model/conflict";

const BASE_URL = "/api/reservations";

function errorResponse(message: string, status: number) {
  return HttpResponse.json(
    {
      message,
    },
    {
      status,
    },
  );
}

export const handlers = [
  http.get(BASE_URL, () => {
    return HttpResponse.json(getReservations());
  }),

  http.get(`${BASE_URL}/:id`, ({ params }) => {
    const id = String(params.id);
    const reservation = getReservationById(id);

    if (!reservation) {
      return errorResponse("Reservation not found", 404);
    }

    return HttpResponse.json(reservation);
  }),

  http.post(BASE_URL, async ({ request }) => {
    const body = (await request.json()) as unknown;

    const parsed = reservationInputSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Invalid reservation payload", 400);
    }

    const input = parsed.data as ReservationInput;

    const conflict = hasReservationConflict(input, getReservations());

    if (conflict) {
      return errorResponse(
        "Reservation conflicts with an existing reservation",
        409,
      );
    }

    const reservation = insertReservation(createReservationRecord(input));

    return HttpResponse.json(
      {
        ...reservation,
      },
      {
        status: 201,
      },
    );
  }),

  http.patch(`${BASE_URL}/:id`, async ({ params, request }) => {
    const id = String(params.id);

    const existing = getReservationById(id);

    if (!existing) {
      return errorResponse("Reservation not found", 404);
    }

    const body = (await request.json()) as unknown;

    const parsed = reservationUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Invalid reservation update payload", 400);
    }

    const input = parsed.data as ReservationUpdateInput;

    const candidate: Reservation = {
      ...existing,
      ...input,
      id,
    };

    const conflict = hasReservationConflict(candidate, getReservations(), {
      excludeId: id,
    });

    if (conflict) {
      return errorResponse(
        "Reservation conflicts with an existing reservation",
        409,
      );
    }

    const updated = updateReservation(id, input);

    if (!updated) {
      return errorResponse("Reservation not found", 404);
    }

    return HttpResponse.json(updated);
  }),

  http.delete(`${BASE_URL}/:id`, ({ params }) => {
    const id = String(params.id);

    const deleted = deleteReservation(id);

    if (!deleted) {
      return errorResponse("Reservation not found", 404);
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
