import { httpClient } from "@/shared/api/http-client";
import {
  Reservation,
  ReservationInput,
  ReservationUpdateInput,
} from "../model/types";

type ApiResponse<T> = {
  data: T;
};

const RESERVATIONS_URL = "/api/reservations";

export const reservationApi = {
  async getById(id: string): Promise<Reservation> {
    const response = await httpClient.get<ApiResponse<Reservation>>(
      `${RESERVATIONS_URL}/${id}`,
    );
    return response.data;
  },

  async create(input: ReservationInput): Promise<Reservation> {
    const response = await httpClient.patch<ApiResponse<Reservation>>(
      RESERVATIONS_URL,
      input,
    );
    return response.data;
  },

  async update(
    id: string,
    input: ReservationUpdateInput,
  ): Promise<Reservation> {
    const response = await httpClient.patch<ApiResponse<Reservation>>(
      `${RESERVATIONS_URL}/${id}`,
      input,
    );

    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete<ApiResponse<null>>(`${RESERVATIONS_URL}/${id}`);
  },
};
