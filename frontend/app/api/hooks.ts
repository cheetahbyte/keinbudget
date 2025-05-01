import { useState, useEffect } from "react";
import { useUserService } from "./services/user.service";
import type { User } from "./types/user";

export function useToken() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchedToken = localStorage.getItem("token");
        setToken(fetchedToken);
    }, []);

    return token;
}

export function useUser(): User | null {
    const [user, setUser] = useState<User | null>(null)
    const userService = useUserService()

    useEffect(() => {
        userService.getMe().then(setUser).catch(console.error)
    }, [])

    return user
}