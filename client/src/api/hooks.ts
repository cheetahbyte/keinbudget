import { useEffect, useState } from "react";
import { useServices } from "./services/services.provider";
import type { User } from "./types/user";

export function useToken(): string | null {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  useEffect(() => {
    const onChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("authchange", onChange);
    return () => window.removeEventListener("authchange", onChange);
  }, []);

  return token;
}

export function useUser() {
  const { userService } = useServices();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!userService) return;
    userService.getMe().then(setUser);
  }, [userService]);

  return user;
}
