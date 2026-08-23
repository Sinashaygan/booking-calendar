import {
  createReservationRecord,
  getReservations,
  insertReservation,
} from "@/app/mocks/mock-db";
import { hasReservationConflict } from "@/entities/reservation/model/conflict";
import { reservationInputSchema } from "@/entities/reservation/model/schema";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

function errorResponse(message: string, status: number) {
  return Response.json({ message }, { status });
}

export async function GET() {
  return Response.json(getReservations());
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid reservation payload", 400);
  }

  const parsed = reservationInputSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid reservation payload", 400);
  }

  if (hasReservationConflict(parsed.data, getReservations())) {
    return errorResponse(
      "Reservation conflicts with an existing reservation",
      409,
    );
  }

  const reservation = insertReservation(createReservationRecord(parsed.data));

  return Response.json(reservation, { status: 201 });
}
