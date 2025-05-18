import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApiClient } from "./api";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function apiClientWithToken(
	client: ApiClient,
	token: string,
): ApiClient {
	return {
		get: (url, params) => client.get(url, params, token),
		post: (url, body) => client.post(url, body, token),
		delete: (url, params) => client.delete(url, params, token),
		patch: (url, body) => client.patch(url, body, token)
	} as ApiClient;
}
