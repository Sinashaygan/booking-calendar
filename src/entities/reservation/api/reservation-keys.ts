export const reservationKeys = {
  all: ["reservations"] as const,

  lists: () => [...reservationKeys.all, "list"] as const,

  list: (filters?: Record<string, unknown>) =>
    [...reservationKeys.lists(), filters] as const,

  details: () => [...reservationKeys.all, "detail"] as const,

  detail: (id: string) => [...reservationKeys.details(), id] as const,
};
