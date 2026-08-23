import type { FieldErrors, Resolver } from "react-hook-form";

import { bookingFormSchema } from "./form-schema";
import type { BookingFormValues } from "./form-schema";

export const bookingFormResolver: Resolver<BookingFormValues> = async (
  values,
) => {
  const result = bookingFormSchema.safeParse(values);

  if (result.success) {
    return {
      values: result.data,
      errors: {},
    };
  }

  const errors: FieldErrors<BookingFormValues> = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];

    if (typeof field !== "string") {
      continue;
    }

    errors[field as keyof BookingFormValues] = {
      type: issue.code,
      message: issue.message,
    };
  }

  return {
    values: {},
    errors,
  };
};
