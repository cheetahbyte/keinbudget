import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input"
import { useUserService } from "~/api/services/user.service";
import type { User } from "~/api/types/user";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const userService = useUserService()
  const [user, setUser] = useState<User>()
  const [error, setError] = useState<string | null >(null)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getMe()
        setUser(data)
        setError(null);
      } catch (err: any){
        setError(err.message || "Unknown error")
      }
    }
    fetchUsers();
  }, [userService])

  if (error) {
    return <div>{error}</div>
  }
  if (!user) {
    return <div>User not found</div>
  }
  return <div className="flex flex-col items-center justify-center min-h-svh">
    <p>Hello {user.email}</p>
  </div>;
}

