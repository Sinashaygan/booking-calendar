"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, MenuItem, Stack, TextField } from "@mui/material";

import type { ReservationInput } from "@/entities/reservation/model/types";

import type { BookingFormValues } from "../model/form-schema";
import { bookingFormResolver } from "../model/resolver";

type ResourceOption = {
  id: string;
  label: string;
};

type ReservationFormProps = {
  resources: readonly ResourceOption[];
  defaultValues?: Partial<BookingFormValues>;
  isPending?: boolean;
  submitError?: string | null;
  submitLabel?: string;
  onSubmit: (value: ReservationInput) => void | Promise<void>;
  onCancel?: () => void;
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
  isPending = false,
  submitError,
  submitLabel = "ثبت رزرو",
  onSubmit,
  onCancel,
}: ReservationFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingFormValues>({
    resolver: bookingFormResolver,
    defaultValues: {
      ...defaultFormValues,
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset({
      ...defaultFormValues,
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  const isSubmitDisabled = isSubmitting || isPending;

  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      sx={{ maxWidth: 520 }}
      noValidate
    >
      {submitError && (
        <Alert severity="error" role="alert">
          {submitError}
        </Alert>
      )}

      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            disabled={isSubmitDisabled}
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
            disabled={isSubmitDisabled}
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
            disabled={isSubmitDisabled}
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
            disabled={isSubmitDisabled}
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
            disabled={isSubmitDisabled}
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
            disabled={isSubmitDisabled}
            label="پایان"
            placeholder="2026-08-22T09:00:00"
            error={Boolean(errors.end)}
            helperText={errors.end?.message}
            fullWidth
          />
        )}
      />

      <Stack direction="row" spacing={1}>
        {onCancel && (
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitDisabled}
          >
            انصراف
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={isSubmitDisabled}>
          {isSubmitDisabled ? "در حال ذخیره..." : submitLabel}
        </Button>
      </Stack>
    </Stack>
  );
}
