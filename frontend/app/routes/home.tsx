import type { Route } from "./+types/home";
import { Button } from "~/components/lib/button";
import { Input } from "~/components/lib/input"
import { useUserService } from "~/api/services/user.service";
import type { User } from "~/api/types/user";
import { useEffect, useState } from "react";
import { useAccountsService } from "~/api/services/accounts.service";
import type { Account } from "~/api/types/account";
import { useUser } from "~/api/hooks";
import { useAuth } from "~/api/services/login.service";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const user = useUser();
  const auth = useAuth()

  const logout = async () => auth.logout()

  if (!user) {
    return <div>no.</div>
  }
  
  return <div className="flex flex-col items-center justify-center min-h-svh">
    <p>Hello {user.firstName}</p>
    <Button onClick={logout}>Abmelden</Button>
  </div>;
}

