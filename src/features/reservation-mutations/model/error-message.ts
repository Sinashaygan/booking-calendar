import { HttpError } from "@/shared/api/http-client";

export function getReservationMutationErrorMessage(error: unknown): string {
  if (error instanceof HttpError && error.status === 409) {
    return "این بازه زمانی با یک رزرو دیگر تداخل دارد.";
  }

  if (error instanceof HttpError && error.status === 404) {
    return "رزرو موردنظر پیدا نشد.";
  }

  if (error instanceof HttpError && error.status === 400) {
    return "اطلاعات ارسال‌شده معتبر نیست.";
  }

  return "عملیات انجام نشد. دوباره تلاش کنید.";
}
