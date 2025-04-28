import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input"
import { useUserService } from "~/api/services/user.service";
import type { User } from "~/api/types/user";
import { useEffect, useState } from "react";
import { useAccountsService } from "~/api/services/accounts.service";
import type { Account } from "~/api/types/account";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const userService = useUserService()
  const accountsService = useAccountsService()
  const [accounts, setAccounts] = useState<Account[]>()
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
    const fetchAccounts = async () => {
      try {
        const data = await accountsService.getAccounts()
        setAccounts(data)
        setError(null)
      } catch (err: any){
        setError(err.message || "Unknown error")
      }
    }
    fetchUsers();
    fetchAccounts();
  }, [userService])

  if (error) {
    return <div>{error}</div>
  }
  if (!user) {
    return <div>User not found</div>
  }

  if (!accounts) {
    return <div>Accounts not found</div>
  }

  const listItems = accounts.map(acc => <li>{acc.id}</li>);

  
  return <div className="flex flex-col items-center justify-center min-h-svh">
    <p>Hello {user.email}</p>
    <div>{listItems}</div>
  </div>;
}

