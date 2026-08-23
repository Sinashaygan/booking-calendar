import type {
  Reservation,
  ReservationInput,
  ReservationUpdateInput,
} from "../model/types";

export interface ReservationRepository {
  getAll(): Promise<Reservation[]>;
  getById(id: string): Promise<Reservation>;
  create(input: ReservationInput): Promise<Reservation>;
  update(id: string, input: ReservationUpdateInput): Promise<Reservation>;
  remove(id: string): Promise<void>;
}
