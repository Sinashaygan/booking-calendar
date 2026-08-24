import { http, HttpResponse } from "msw";

import {
  getReservationById,
  getReservations,
  insertReservation,
  replaceReservation,
  deleteReservation,
} from "./mock-db";
import {
  prepareCreateReservation,
  prepareUpdateReservation,
} from "@/features/reservation-mutations/model/reservation-mutations";

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

    const result = prepareCreateReservation({
      input: body,
      reservations: getReservations(),
    });

    if (!result.ok) {
      return errorResponse(
        result.reason === "conflict"
          ? "Reservation conflicts with an existing reservation"
          : "Invalid reservation payload",
        result.reason === "conflict" ? 409 : 400,
      );
    }

    const reservation = insertReservation(result.value);

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

    const body = (await request.json()) as unknown;
    const result = prepareUpdateReservation({
      id,
      input: body,
      reservations: getReservations(),
    });

    if (!result.ok) {
      const status =
        result.reason === "not-found"
          ? 404
          : result.reason === "conflict"
            ? 409
            : 400;
      const message =
        result.reason === "not-found"
          ? "Reservation not found"
          : result.reason === "conflict"
            ? "Reservation conflicts with an existing reservation"
            : "Invalid reservation update payload";
      return errorResponse(message, status);
    }

    const updated = replaceReservation(result.value);

    return updated
      ? HttpResponse.json(updated)
      : errorResponse("Reservation not found", 404);
  }),

  http.delete(`${BASE_URL}/:id`, ({ params }) => {
    const id = String(params.id);

    const deleted = deleteReservation(id);

    if (!deleted) {
      return errorResponse("Reservation not found", 404);
    }

    return HttpResponse.json({ data: null }, { status: 200 });
  }),
];
