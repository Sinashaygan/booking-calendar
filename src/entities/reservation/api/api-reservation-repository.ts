import { reservationApi } from "./reservation-api";
import type { ReservationRepository } from "./reservation-repository";

export const apiReservationRepository: ReservationRepository = {
  getAll: reservationApi.getAll,
  getById: reservationApi.getById,
  create: reservationApi.create,
  update: reservationApi.update,
  remove: reservationApi.remove,
};
