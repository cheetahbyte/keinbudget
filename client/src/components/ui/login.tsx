import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
	type AuthServiceTokenRequest,
	useAuth,
} from "~/api/services/login.service";
import { Button } from "~/components/lib/button";
import { CardContent, CardFooter } from "~/components/lib/card";
import { Input } from "~/components/lib/input";
import { Label } from "~/components/lib/label";

type LoginCardProps = {
	on2FARequired: (token: string) => void;
};

export function LoginCardContent(props: LoginCardProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const authService = useAuth();
	const navigate = useNavigate();

	const handleLogin = async () => {
		const result = await authService.login(email, password);
		if (result.intermediate) {
			props.on2FARequired(result.token);
			return;
		}
		authService.storeToken(result.token);
		navigate("/");
	};

	return (
		<>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<CardFooter className="flex flex-col space-y-3">
					<Button className="w-full cursor-pointer" onClick={handleLogin}>
						Login
					</Button>
					<p className="text-center text-sm text-gray-500">
						Don't have an account?{" "}
						<a href="/login" className="text-white-500 hover:underline">
							Sign up
						</a>
					</p>
				</CardFooter>
			</CardContent>
		</>
	);
}

type TwoFaCardContentProps = {
	token: string;
};

export function TwoFACardContent(props: TwoFaCardContentProps) {
	const auth = useAuth();
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const navigate = useNavigate();
	const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

	const handleChange = (index: number, value: string) => {
		if (!/^[0-9]?$/.test(value)) return; // nur Ziffern erlauben
		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		if (value && index < 5) {
			inputsRef.current[index + 1]?.focus();
		}
	};

	const verifyOtp = async () => {
		const res = await auth.getApiClient.post<AuthServiceTokenRequest>(
			`/auth/validate-2fa?code=${otp.join("")}`,
			{},
			props.token,
		);
		auth.storeToken(res.token);
		navigate("/");
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputsRef.current[index - 1]?.focus();
		}
	};

	return (
		<>
			<CardContent className="space-y-4">
				<div className="space-y-2 ">
					<Label htmlFor="otp" className="space-y-2">
						Two Factor Authentication Code
					</Label>
					<div className="flex gap-2 justify-center mt-6">
						{otp.map((digit, index) => (
							<Input
								key={index}
								ref={(el) => {
									inputsRef.current[index] = el;
								}}
								type="text"
								inputMode="numeric"
								maxLength={1}
								className="w-10 text-center"
								value={digit}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								onPaste={(e) => {
									e.preventDefault();
									const paste = e.clipboardData
										.getData("text")
										.replace(/\D/g, "");
									if (paste.length !== 6) return;
									const next = [...otp];
									for (let i = 0; i < 6; i++) {
										next[i] = paste[i];
										inputsRef.current[i]!.value = paste[i];
									}
									setOtp(next);
									inputsRef.current[5]?.focus(); // optional: springe ans Ende
								}}
							/>
						))}
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col space-y-3">
				<Button className="w-full cursor-pointer" onClick={verifyOtp}>
					Verify
				</Button>
			</CardFooter>
		</>
	);
}
