import type { Account, ExternalAccount } from "./types"

// create string enum for each method type
enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}


export class RequestorError extends Error { };




class Requestor {
    static async request<T>(method: Method, slug: string, data?: any): Promise<T> {
        console.log(`${import.meta.env.VITE_SERVER_URL_PREFIX}${slug}`)
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL_PREFIX}${slug}`, { method, body: JSON.stringify(data), headers: { 'Content-Type': 'application/json', "Accept": "application/json" }})
        if (!response.ok) throw new RequestorError(response.statusText) // TODO: make error better
        return response.json()
    }

    static async get<T>(slug: string): Promise<T> {
        return this.request(Method.GET, slug)
    }

    static async post<T>(slug: string, data: any): Promise<T> {
        return this.request(Method.POST, slug, data)
    }

    static async put<T>(slug: string, data: any): Promise<T> {
        return this.request(Method.PUT, slug, data)
    }

    static async getAllAccounts(): Promise<Array<Account | ExternalAccount>> {
        const req1 = this.get("account")
        const req2 = this.get("external-account")
        return Promise.all([req1, req2]) as Promise<(ExternalAccount | Account)[]>
    }
}


export default Requestor;