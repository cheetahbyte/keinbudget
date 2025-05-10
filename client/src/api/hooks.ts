import { useEffect, useState } from "react";
import { useServices } from "./services/services.provider";
import type { User } from "./types/user";

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
    userService?.getMe().then(setUser).catch(console.error);
  }, [userService]);

  return user;
}
