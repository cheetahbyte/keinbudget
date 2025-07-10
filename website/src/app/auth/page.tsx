"use client";
import { useEffect, useRef } from "react";
import { VenetianMask } from "lucide-react";
export default function LoginForm() {
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailInputRef.current?.value;
    if (!email) return;

    // TODO: Begin passkey login process here
    console.log("Begin WebAuthn for:", email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-md overflow-hidden">
        <div className="relative z-10 p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-black text-white flex items-center justify-center">
              <span className="text-lg font-bold">k.</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Sign in securely with your Passkey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-black focus:outline-none"
              ref={emailInputRef}
              required
            />

            <button
              type="submit"
              className="w-full rounded-md bg-black py-2 text-white hover:bg-gray-900 transition flex justify-center cursor-pointer"
            >
              Sign in
            </button>
            <button
              type="submit"
              className="relative w-full rounded-md bg-black py-2 text-white hover:bg-gray-900 transition flex justify-center items-center cursor-pointer"
            >
              {/* Icon links, aber aus dem Flow genommen */}
              <VenetianMask
                strokeWidth="2"
                className="absolute left-4 h-5 w-5 text-white"
              />
              Dev Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account yet?{" "}
            <a href="#" className="font-medium text-black hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
