import {
  deleteReservation,
  getReservationById,
  getReservations,
  updateReservation,
} from "@/app/mocks/mock-db";
import { hasReservationConflict } from "@/entities/reservation/model/conflict";
import { reservationUpdateSchema } from "@/entities/reservation/model/schema";
import type { Reservation } from "@/entities/reservation/model/types";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

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
  const existing = getReservationById(id);

  if (!existing) {
    return errorResponse("Reservation not found", 404);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid reservation update payload", 400);
  }

  const parsed = reservationUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid reservation update payload", 400);
  }

  const candidate: Reservation = { ...existing, ...parsed.data, id };

  if (
    hasReservationConflict(candidate, getReservations(), {
      excludeId: id,
    })
  ) {
    return errorResponse(
      "Reservation conflicts with an existing reservation",
      409,
    );
  }

  const updated = updateReservation(id, parsed.data);

  return updated
    ? Response.json(updated)
    : errorResponse("Reservation not found", 404);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!deleteReservation(id)) {
    return errorResponse("Reservation not found", 404);
  }

  return new Response(null, { status: 204 });
}
