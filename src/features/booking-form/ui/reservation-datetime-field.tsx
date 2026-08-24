"use client";

import { FormHelperText, InputLabel, Stack } from "@mui/material";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/colors/teal.css";

import {
  RESERVATION_DISPLAY_FORMAT,
  apiStringToDateObject,
  reservationDateToApiString,
} from "@/shared/lib/date/reservation-datetime";

type ReservationDateTimeFieldProps = {
  label: string;
  value: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

export function ReservationDateTimeField({
  label,
  value,
  disabled = false,
  error,
  onChange,
}: ReservationDateTimeFieldProps) {
  const pickerValue = value ? apiStringToDateObject(value) : undefined;

  function handleChange(nextValue: DateObject | null) {
    if (!nextValue) {
      onChange("");
      return;
    }

    onChange(reservationDateToApiString(nextValue));
  }

  return (
    <Stack spacing={0.5}>
      <InputLabel error={Boolean(error)}>
        {label}
      </InputLabel>

      <DatePicker
        value={pickerValue}
        onChange={handleChange}
        calendar={persian}
        locale={persian_fa}
        format={RESERVATION_DISPLAY_FORMAT}
        disabled={disabled}
        plugins={[<TimePicker key="time" hideSeconds position="bottom" />]}
        calendarPosition="bottom-right"
        containerStyle={{ width: "100%" }}
        inputClass={`rmdp-input${error ? " rmdp-input-error" : ""}`}
        style={{
          width: "100%",
          padding: "14px 12px",
          borderRadius: "4px",
          border: error ? "1px solid #d32f2f" : "1px solid rgba(0, 0, 0, 0.23)",
          fontFamily: "inherit",
          fontSize: "1rem",
          backgroundColor: disabled ? "rgba(0, 0, 0, 0.06)" : "#fff",
        }}
      />

      {error && (
        <FormHelperText error role="alert">
          {error}
        </FormHelperText>
      )}
    </Stack>
  );
}
