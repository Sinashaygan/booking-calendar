import {
  getReservations,
  insertReservation,
} from "@/app/mocks/mock-db";
import { prepareCreateReservation } from "@/features/reservation-mutations/model/reservation-mutations";

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

  return Response.json(reservation, { status: 201 });
}
