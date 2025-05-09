import { useEffect, useState } from "react";
import type { User } from "./types/user";
import { useServices } from "./services/services.provider";

export function useToken() {
	const [token, setToken] = useState<string | null | undefined>(undefined);

	useEffect(() => {
		const fetchedToken = localStorage.getItem("token");
		setToken(fetchedToken);
	}, []);

	return token;
}

export function useUser(): User | null {
	const [user, setUser] = useState<User | null>(null);
	const { userService } = useServices();

	useEffect(() => {
		userService!.getMe().then(setUser).catch(console.error);
	}, [userService]);

	return user;
}
