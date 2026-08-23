import { ReservationInput } from "@/entities/reservation/model/types";
import { BookingFormValues } from "../model/form-schema";

type ResourceOption = {
  id: string;
  label: string;
};

type ReservationFormProps = {
  resources: readonly ResourceOption[];
  defaultValues?: Partial<BookingFormValues>;
  onSubmit: (value: ReservationInput) => void;
};

export function ReservationForm({
  resources,
  defaultValues,
  onSubmit,
}: ReservationFormProps) {}
