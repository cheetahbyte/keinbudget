export class ApiClient {
    private baseUrl: string = import.meta.env.VITE_BACKEND_URL;
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    private async request<T>(url: string, options: RequestInit): Promise<T> {
        const response = await fetch(`${this.baseUrl}${url}`, options);

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return response.json() as Promise<T>;
    }

    public async get<T>(endpoint: string, queryParams?: Record<string, string>): Promise<T> {
        const queryString = queryParams ? new URLSearchParams(queryParams).toString() : '';
        const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;

        return this.request<T>(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${this.token}`
            },
        });
    }

    public async post<T>(endpoint: string, body: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${this.token}`
            },
            body: JSON.stringify(body),
        });
    }
}