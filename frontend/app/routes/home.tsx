import { useEffect, useState } from "react";
import { Navigate, redirect } from "react-router";
import { useUser } from "~/api/hooks";
import { useAccountsService } from "~/api/services/accounts.service";
import { useAuth } from "~/api/services/login.service";
import { useUserService } from "~/api/services/user.service";
import type { Account } from "~/api/types/account";
import type { User } from "~/api/types/user";
import { Button } from "~/components/lib/button";
import { Input } from "~/components/lib/input";
import type { Route } from "./+types/home";

export function meta(obj: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	const user = useUser();
	const auth = useAuth();

	const logout = async () => auth.logout();

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-svh">
			<p>Hello {user.firstName}</p>
			<Button onClick={logout}>Abmelden</Button>
		</div>
	);
}
