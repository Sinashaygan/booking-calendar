import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { setupServer } from "msw/node";

import { handlers } from "@/app/mocks/handlers";
import {
  GET as getReservationsRoute,
  POST as postReservationsRoute,
} from "@/app/api/reservations/route";
import {
  DELETE as deleteReservationRoute,
  GET as getReservationRoute,
  PATCH as patchReservationRoute,
} from "@/app/api/reservations/[id]/route";
import {
  getReservations,
  insertReservation,
  resetMockDatabase,
} from "@/app/mocks/mock-db";
import { mockReservations } from "@/entities/reservation/model/mock-reservations";
import type { ReservationInput } from "@/entities/reservation/model/types";

const server = setupServer(...handlers);
const apiUrl = "http://localhost/api/reservations";

const validInput: ReservationInput = {
  title: "New Reservation",
  resourceId: "room-c",
  start: "2026-08-25T09:00:00",
  end: "2026-08-25T10:00:00",
  status: "confirmed",
  customerName: "Test User",
};

async function readJson(response: Response) {
  return response.json() as Promise<unknown>;
}

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(resetMockDatabase);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("mock reservation database", () => {
  it("inserts into active state without mutating the seed or exposing records", () => {
    const created = {
      id: "created-id",
      ...validInput,
    };

    insertReservation(created);
    const snapshot = getReservations();
    snapshot[0].title = "mutated snapshot";

    expect(getReservations()).toContainEqual(created);
    expect(getReservations()[0].title).toBe(mockReservations[0].title);
    expect(mockReservations).toHaveLength(3);
  });
});

describe("reservation MSW handlers", () => {
  it("persists a successful POST and preserves state after a conflicting POST", async () => {
    const initialResponse = await fetch(apiUrl);
    const initialBody = await readJson(initialResponse);

    expect(initialResponse.status).toBe(200);
    expect(initialBody).toEqual(mockReservations);

    const createResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validInput),
    });
    const createBody = await readJson(createResponse);

    expect(createResponse.status).toBe(201);
    expect(createBody).toMatchObject(validInput);
    expect(createBody).toHaveProperty("id");

    const afterCreateBody = await readJson(await fetch(apiUrl));
    expect(afterCreateBody).toContainEqual(createBody);

    const conflictResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validInput,
        title: "Overlapping Reservation",
        start: "2026-08-25T09:30:00",
        end: "2026-08-25T10:30:00",
      }),
    });

    expect(conflictResponse.status).toBe(409);

    const afterConflictBody = await readJson(await fetch(apiUrl));
    expect(afterConflictBody).toEqual(afterCreateBody);
  });

  it("returns 400 for an invalid POST without changing state", async () => {
    const beforeBody = await readJson(await fetch(apiUrl));
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validInput, title: "" }),
    });

    expect(response.status).toBe(400);
    expect(await readJson(await fetch(apiUrl))).toEqual(beforeBody);
  });

  it("updates and deletes a reservation with persistence across GET requests", async () => {
    const updateResponse = await fetch(`${apiUrl}/reservation-1`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated title" }),
    });

    expect(updateResponse.status).toBe(200);
    expect(await readJson(updateResponse)).toMatchObject({
      id: "reservation-1",
      title: "Updated title",
    });

    const afterUpdate = await readJson(await fetch(apiUrl));
    expect(afterUpdate).toContainEqual(
      expect.objectContaining({ id: "reservation-1", title: "Updated title" }),
    );

    const deleteResponse = await fetch(`${apiUrl}/reservation-1`, {
      method: "DELETE",
    });

    expect(deleteResponse.status).toBe(200);
    expect(await readJson(await fetch(apiUrl))).not.toContainEqual(
      expect.objectContaining({ id: "reservation-1" }),
    );
  });

  it.each(["GET", "PATCH", "DELETE"])(
    "returns 404 for %s with an unknown id",
    async (method) => {
      const response = await fetch(`${apiUrl}/unknown-id`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "PATCH" ? JSON.stringify({ title: "Missing" }) : undefined,
      });

      expect(response.status).toBe(404);
    },
  );
});

describe("reservation Next.js route handlers", () => {
  const routeContext = (id: string) => ({
    params: Promise.resolve({ id }),
  });

  it("serves the seed collection and persists POST through GET", async () => {
    const initial = await getReservationsRoute();
    expect(initial.status).toBe(200);
    expect(await initial.json()).toEqual(mockReservations);

    const created = await postReservationsRoute(
      new Request("http://localhost/api/reservations", {
        method: "POST",
        body: JSON.stringify(validInput),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(created.status).toBe(201);
    const createdReservation = await created.json();
    expect(createdReservation).toMatchObject(validInput);

    const afterCreate = await getReservationsRoute();
    expect(await afterCreate.json()).toContainEqual(createdReservation);
  });

  it("returns 400 and 409 without mutating state", async () => {
    const before = await getReservationsRoute();
    const beforeBody = await before.json();

    const invalid = await postReservationsRoute(
      new Request("http://localhost/api/reservations", {
        method: "POST",
        body: JSON.stringify({ ...validInput, title: "" }),
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(invalid.status).toBe(400);

    const conflict = await postReservationsRoute(
      new Request("http://localhost/api/reservations", {
        method: "POST",
        body: JSON.stringify({
          ...validInput,
          resourceId: "room-a",
          start: mockReservations[0].start,
          end: mockReservations[0].end,
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(conflict.status).toBe(409);

    const after = await getReservationsRoute();
    expect(await after.json()).toEqual(beforeBody);
  });

  it("supports item GET, PATCH, conflict protection, and DELETE", async () => {
    const item = await getReservationRoute(
      new Request("http://localhost/api/reservations/reservation-1"),
      routeContext("reservation-1"),
    );
    expect(item.status).toBe(200);
    expect(await item.json()).toMatchObject({ id: "reservation-1" });

    const updated = await patchReservationRoute(
      new Request("http://localhost/api/reservations/reservation-1", {
        method: "PATCH",
        body: JSON.stringify({ title: "Updated" }),
        headers: { "Content-Type": "application/json" },
      }),
      routeContext("reservation-1"),
    );
    expect(updated.status).toBe(200);
    expect(await updated.json()).toMatchObject({
      id: "reservation-1",
      title: "Updated",
    });

    const beforeConflict = await getReservationsRoute();
    const beforeConflictBody = await beforeConflict.json();
    const conflictUpdate = await patchReservationRoute(
      new Request("http://localhost/api/reservations/reservation-1", {
        method: "PATCH",
        body: JSON.stringify({
          start: mockReservations[2].start,
          end: mockReservations[2].end,
          resourceId: mockReservations[2].resourceId,
        }),
        headers: { "Content-Type": "application/json" },
      }),
      routeContext("reservation-1"),
    );
    expect(conflictUpdate.status).toBe(409);
    expect(await (await getReservationsRoute()).json()).toEqual(
      beforeConflictBody,
    );

    const deleted = await deleteReservationRoute(
      new Request("http://localhost/api/reservations/reservation-1", {
        method: "DELETE",
      }),
      routeContext("reservation-1"),
    );
    expect(deleted.status).toBe(200);
    expect(
      await getReservationRoute(
        new Request("http://localhost/api/reservations/reservation-1"),
        routeContext("reservation-1"),
      ),
    ).toHaveProperty("status", 404);
  });

  it.each(["GET", "PATCH", "DELETE"])(
    "returns 404 for an unknown route-handler id (%s)",
    async (method) => {
      const context = routeContext("unknown-id");
      const request = new Request(
        "http://localhost/api/reservations/unknown-id",
        {
          method,
          body: method === "PATCH" ? JSON.stringify({ title: "Missing" }) : undefined,
          headers: { "Content-Type": "application/json" },
        },
      );

      const response =
        method === "GET"
          ? await getReservationRoute(request, context)
          : method === "PATCH"
            ? await patchReservationRoute(request, context)
            : await deleteReservationRoute(request, context);

      expect(response.status).toBe(404);
    },
  );
});
