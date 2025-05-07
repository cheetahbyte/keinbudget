function toCamelCase(str: string): string {
	return str.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
}

function camelize(obj: object): object {
	if (Array.isArray(obj)) {
		return obj.map(camelize);
	}
	if (obj !== null && typeof obj === "object") {
		return Object.fromEntries(
			Object.entries(obj).map(([k, v]) => [toCamelCase(k), camelize(v)]),
		);
	}
	return obj;
}

export interface DeleteResponse {
  deleted: string
}

export class ApiClient {
  private baseUrl: string = import.meta.env.VITE_BACKEND_URL;

  private async request<T>(
    url: string,
    options: RequestInit,
    token?: string
  ): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("Accept-Casing", "camel");
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", "application/json");
    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers,
    });

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const data = await response.json();
		return camelize(data) as Promise<T>;
	}

  public async get<T>(
    endpoint: string,
    queryParams?: Record<string, string>,
    token?: string
  ): Promise<T> {
    const queryString = queryParams
      ? new URLSearchParams(queryParams).toString()
      : "";
    const url = `${endpoint}${queryString ? `?${queryString}` : ""}`;

    return this.request<T>(
      url,
      {
        method: "GET",
      },
      token
    );
  }

  public async delete<T>(
    endpoint: string,
    queryParams?: Record<string, string>,
    token?: string
  ): Promise<T> {
    const queryString = queryParams
      ? new URLSearchParams(queryParams).toString()
      : "";
    const url = `${endpoint}${queryString ? `?${queryString}` : ""}`;

    return this.request<T>(
      url,
      {
        method: "DELETE",
      },
      token
    );
  }

  public async post<T>(
    endpoint: string,
    body: object,
    token?: string
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      token
    );
  }
}
