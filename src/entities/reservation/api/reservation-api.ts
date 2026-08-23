import { httpClient } from "@/shared/api/http-client";
import type {
  Reservation,
  ReservationInput,
  ReservationUpdateInput,
} from "../model/types";

const RESERVATIONS_URL = "/api/reservations";

export const reservationApi = {
    async getAll():Promise<Reservation[]>{
        return httpClient.get<Reservation[]>(RESERVATIONS_URL);
    },

  async getById(id: string): Promise<Reservation> {
    return httpClient.get<Reservation>(
      `${RESERVATIONS_URL}/${id}`,
    );
  },

  async create(input: ReservationInput): Promise<Reservation> {
    return httpClient.post<Reservation>(
      RESERVATIONS_URL,
      input,
    );
  },

  async update(
    id: string,
    input: ReservationUpdateInput,
  ): Promise<Reservation> {
    return httpClient.patch<Reservation>(
      `${RESERVATIONS_URL}/${id}`,
      input,
    );
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`${RESERVATIONS_URL}/${id}`);
  },
};
