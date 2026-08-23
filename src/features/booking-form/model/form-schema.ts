import { z } from "zod";

import { reservationInputSchema } from "@/entities/reservation/model/schema";

export const bookingFormSchema = reservationInputSchema;

export type BookingFormValues = z.input<typeof bookingFormSchema>;
