// import type { Account, ExternalAccount } from "./types";

// create string enum for each method type
enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
  }
  
  export class RequestorError extends Error {}
  
  class Requestor {
    static async request<T>(
      method: Method,
      slug: string,
      data?: any
    ): Promise<T> {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${slug}`, {
        method,
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });
      console.log(response.ok, response.statusText);
      if (!response.ok) throw new RequestorError(response.statusText); // TODO: make error better
      return response.json();
    }
  
    static async get<T>(slug: string): Promise<T> {
      return this.request(Method.GET, slug);
    }
  
    static async post<T>(slug: string, data: any): Promise<T> {
      return this.request(Method.POST, slug, data);
    }
  
    static async put<T>(slug: string, data: any): Promise<T> {
      return this.request(Method.PUT, slug, data);
    }
  }
  
  export default Requestor;
  