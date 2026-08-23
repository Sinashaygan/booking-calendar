export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

type HttpOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(url: string, options: HttpOptions = {}): Promise<T> {
  const { body, headers, ...requestInit } = options;

  const response = await fetch(url, {
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result &&
      typeof result === "object" &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : "Request failed";

    throw new HttpError(message, response.status);
  }

  return result as T;
}

export const httpClient = {
  get<T>(url: string): Promise<T> {
    return request<T>(url, {
      method: "GET",
    });
  },

  post<T>(url: string, body: unknown): Promise<T> {
    return request<T>(url, {
      method: "POST",
      body,
    });
  },

  patch<T>(url: string, body: unknown): Promise<T> {
    return request<T>(url, {
      method: "PATCH",
      body,
    });
  },

  delete<T>(url: string): Promise<T> {
    return request<T>(url, {
      method: "DELETE",
    });
  },
};
