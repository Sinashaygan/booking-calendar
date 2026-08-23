import { ReservationInput } from "@/entities/reservation/model/types";
import { BookingFormValues } from "../model/form-schema";
import { Controller, useForm } from "react-hook-form";
import { bookingFormResolver } from "../model/resolver";
import { Stack, TextField, MenuItem, Button } from "@mui/material";

type ResourceOption = {
  id: string;
  label: string;
};

type ReservationFormProps = {
  resources: readonly ResourceOption[];
  defaultValues?: Partial<BookingFormValues>;
  onSubmit: (value: ReservationInput) => void;
};

const defaultFormValues: BookingFormValues = {
  title: "",
  resourceId: "",
  start: "",
  end: "",
  status: "pending",
  customerName: "",
};

export function ReservationForm({
  resources,
  defaultValues,
  onSubmit,
}: ReservationFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: bookingFormResolver,
    defaultValues: {
      ...defaultFormValues,
      ...defaultValues,
    },
  });

  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      sx={{ maxWidth: 520 }}
    >
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="عنوان رزرو"
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            fullWidth
          />
        )}
      />

      <Controller
        name="customerName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="نام مشتری"
            error={Boolean(errors.customerName)}
            helperText={errors.customerName?.message}
            fullWidth
          />
        )}
      />

      <Controller
        name="resourceId"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="منبع"
            error={Boolean(errors.resourceId)}
            helperText={errors.resourceId?.message}
            fullWidth
          >
            {resources.map((resource) => (
              <MenuItem key={resource.id} value={resource.id}>
                {resource.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="وضعیت"
            error={Boolean(errors.status)}
            helperText={errors.status?.message}
            fullWidth
          >
            <MenuItem value="pending">در انتظار</MenuItem>
            <MenuItem value="confirmed">تأیید شده</MenuItem>
            <MenuItem value="cancelled">لغو شده</MenuItem>
          </TextField>
        )}
      />

      <Controller
        name="start"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="شروع"
            placeholder="2026-08-22T08:30:00"
            error={Boolean(errors.start)}
            helperText={errors.start?.message}
            fullWidth
          />
        )}
      />

      <Controller
        name="end"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="پایان"
            placeholder="2026-08-22T09:00:00"
            error={Boolean(errors.end)}
            helperText={errors.end?.message}
            fullWidth
          />
        )}
      />

      <Button type="submit" variant="contained" disabled={isSubmitting}>
        ثبت رزرو
      </Button>
    </Stack>
  );
}
