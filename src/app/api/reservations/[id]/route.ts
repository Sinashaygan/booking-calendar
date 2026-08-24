import {
  deleteReservation,
  getReservationById,
  getReservations,
  replaceReservation,
} from "@/app/mocks/mock-db";
import { prepareUpdateReservation } from "@/features/reservation-mutations/model/reservation-mutations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function errorResponse(message: string, status: number) {
  return Response.json({ message }, { status });
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const reservation = getReservationById(id);

  return reservation
    ? Response.json(reservation)
    : errorResponse("Reservation not found", 404);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid reservation update payload", 400);
  }

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
    ? Response.json(updated)
    : errorResponse("Reservation not found", 404);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!deleteReservation(id)) {
    return errorResponse("Reservation not found", 404);
  }

  return Response.json({ data: null }, { status: 200 });
}
