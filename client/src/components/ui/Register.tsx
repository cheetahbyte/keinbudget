import { useState } from "react";
import { useNavigate } from "react-router";
import { useServices } from "~/api/services/services.provider";
import { Button } from "../lib/button";
import { CardContent, CardFooter } from "../lib/card";
import { Input } from "../lib/input";

export function SignUpCardContent() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const { authService } = useServices();
	const navigate = useNavigate();

	const handleSignUp = async () => {
		try {
			await authService.signUp(email, password, firstName, lastName);
			const result = await authService.login(email, password);
			authService.storeToken(result.token);
			navigate("/");
		} catch (error) {
			console.error("Sign-up failed", error);
		}
	};

	return (
		<>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="firstName"
						className="block text-sm font-medium text-gray-700"
					>
						First Name
					</label>
					<Input
						id="firstName"
						placeholder="John"
						onChange={(e) => setFirstName(e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<label
						htmlFor="lastName"
						className="block text-sm font-medium text-gray-700"
					>
						Last Name
					</label>
					<Input
						id="lastName"
						placeholder="Doe"
						onChange={(e) => setLastName(e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email
					</label>
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Password
					</label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<CardFooter className="flex flex-col space-y-3">
					<Button className="w-full cursor-pointer" onClick={handleSignUp}>
						Sign Up
					</Button>
					<p className="text-center text-sm text-gray-500">
						Already have an account?{" "}
						<a href="/login" className="text-white-500 hover:underline">
							Login
						</a>
					</p>
				</CardFooter>
			</CardContent>
		</>
	);
}
