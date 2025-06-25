import { type JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useServices } from "~/api/services/services.provider";
import type { User } from "~/api/types/user";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { userService } = useServices();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userService) {
      navigate("/login");
    }
    userService
      ?.getMe()
      .then(setUser)
      .catch(() => navigate("/login"));
  }, [userService, navigate]);

  if (user === undefined) return null; // or loading
  if (user === null) return null; // will be redirected

  return children;
}
