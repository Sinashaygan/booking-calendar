import { describe, expect, it } from "vitest";

import { HttpError } from "@/shared/api/http-client";
import { getReservationMutationErrorMessage } from "@/features/reservation-mutations/model/error-message";

describe("reservation mutation error messages", () => {
  it("maps conflict errors", () => {
    expect(
      getReservationMutationErrorMessage(new HttpError("conflict", 409)),
    ).toContain("تداخل");
  });

  it("maps missing reservation errors", () => {
    expect(
      getReservationMutationErrorMessage(new HttpError("missing", 404)),
    ).toContain("پیدا نشد");
  });

  it("maps invalid payload errors", () => {
    expect(
      getReservationMutationErrorMessage(new HttpError("invalid", 400)),
    ).toContain("معتبر");
  });

  it("does not expose unknown server errors", () => {
    expect(getReservationMutationErrorMessage(new Error("secret"))).toBe(
      "عملیات انجام نشد. دوباره تلاش کنید.",
    );
  });
});
