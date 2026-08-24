"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, CircularProgress, MenuItem, Stack, TextField } from "@mui/material";

import type { ReservationInput } from "@/entities/reservation/model/types";

import type { BookingFormValues } from "../model/form-schema";
import { bookingFormResolver } from "../model/resolver";
import { ReservationDateTimeField } from "./reservation-datetime-field";

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
      spacing={3}
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      sx={{
        maxWidth: 520,
        gap: 0,
        "& .MuiTextField-root": {
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            transition: "all .2s ease-in-out",
            bgcolor: "background.paper",
            "&:hover fieldset": { borderColor: "primary.main" },
            "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(79,70,229,.12)" },
          },
        },
      }}
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
          <ReservationDateTimeField
            label="شروع"
            value={field.value}
            disabled={isSubmitDisabled}
            error={errors.start?.message}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="end"
        control={control}
        render={({ field }) => (
          <ReservationDateTimeField
            label="پایان"
            value={field.value}
            disabled={isSubmitDisabled}
            error={errors.end?.message}
            onChange={field.onChange}
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
            sx={{ borderRadius: 2, px: 2, borderColor: "transparent", color: "text.secondary", "&:hover": { bgcolor: "action.hover", borderColor: "transparent" } }}
          >
            انصراف
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={isSubmitDisabled} sx={{ flex: 1, minHeight: 48, borderRadius: 2, fontWeight: 700, boxShadow: "0 8px 16px rgba(79,70,229,.2)" }}>
          {isSubmitDisabled && <CircularProgress size={18} color="inherit" sx={{ ml: 1 }} />}
          {isSubmitDisabled ? "در حال ذخیره..." : submitLabel}
        </Button>
      </Stack>
    </Stack>
  );
}
