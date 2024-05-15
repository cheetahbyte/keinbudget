// create string enum for each method type
enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT", 
    DELETE = "DELETE",
}


class RequestorError extends Error {};




class Requestor {
    static async request<T>(method: Method, slug: string, data?: any): Promise<T>{
        console.log(`${import.meta.env.VITE_SERVER_URL_PREFIX}${slug}`)
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL_PREFIX}${slug}`, {method, body: JSON.stringify(data)})
        if (!response.ok) throw new RequestorError(response.statusText) // TODO: make error better
        return response.json()
    }

    static async get<T>(slug: string): Promise<T>{
        return this.request(Method.GET, slug)
    }

    static async post<T>(slug: string, data: any): Promise<T>{
        return this.request(Method.POST, slug, data)
    }

    static async put<T>(slug: string, data: any): Promise<T>{
        return this.request(Method.PUT, slug, data)
    }

    static async delete<T>(slug: string): Promise<T>{
        return this.request(Method.DELETE, slug)
    }
}


export default Requestor;