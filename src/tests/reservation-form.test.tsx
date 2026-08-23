import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ReservationForm } from "@/features/booking-form/ui/reservation-form";

const resources = [
  { id: "room-a", label: "اتاق A" },
  { id: "room-b", label: "اتاق B" },
] as const;

describe("ReservationForm", () => {
  it("renders update defaults and keeps submit disabled while pending", () => {
    render(
      <ReservationForm
        resources={resources}
        defaultValues={{
          title: "Existing booking",
          resourceId: "room-a",
          start: "2026-08-25T09:00:00",
          end: "2026-08-25T10:00:00",
          status: "confirmed",
          customerName: "Customer",
        }}
        isPending
        submitLabel="ذخیره تغییرات"
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue("Existing booking")).toBeDisabled();
    expect(screen.getByRole("button", { name: "در حال ذخیره..." })).toBeDisabled();
  });

  it("shows server errors and supports cancel", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <ReservationForm
        resources={resources}
        submitError="این بازه زمانی با یک رزرو دیگر تداخل دارد."
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("تداخل");
    await user.click(screen.getByRole("button", { name: "انصراف" }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
