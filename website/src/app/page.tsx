"use client";

import React, { useEffect, useState } from "react";

// --- ICONS (unverändert) ---
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />{" "}
    <circle cx="12" cy="7" r="4" />{" "}
  </svg>
);
const KeyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <circle cx="7.5" cy="15.5" r="5.5" /> <path d="m21 2-9.6 9.6" />{" "}
    <path d="m15.5 7.5 3 3L22 7l-3-3" />{" "}
  </svg>
);
const AlertTriangleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />{" "}
    <path d="M12 9v4" /> <path d="M12 17h.01" />{" "}
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /> <path d="m9 11 3 3L22 4" />{" "}
  </svg>
);
const LoaderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-spin"
  >
    {" "}
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />{" "}
  </svg>
);

interface User {
  id: string;
  username: string;
}

export default function App() {
  // --- STATE MANAGEMENT (unverändert) ---
  const [username, setUsername] = useState("");
  const [me, setMe] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const baseUrl = "http://localhost:3000";

  // --- HELPER FUNCTIONS (unverändert) ---

  /**
   * Decodes a Base64URL string into a Uint8Array.
   */
  const bufferDecode = (base64url: string): Uint8Array =>
    Uint8Array.from(
      atob(base64url.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );

  /**
   * A helper to safely stringify and parse objects containing ArrayBuffers.
   */
  const formatCredential = (obj: any): any =>
    JSON.parse(
      JSON.stringify(obj, (_, v) =>
        v instanceof ArrayBuffer ? Array.from(new Uint8Array(v)) : v
      )
    );

  // --- CORE AUTHENTICATION LOGIC ---

  /**
   * Handles the user registration process with a Passkey.
   */
  const handleRegister = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      // 1. Get registration options from the server
      const optionsRes = await fetch(`${baseUrl}/auth/register/begin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        mode: "cors",
        credentials: "include",
      });
      if (!optionsRes.ok) {
        const errText = await optionsRes.text();
        throw new Error(
          errText || "Benutzername bereits vergeben oder ungültig."
        );
      }
      const optionsJson = await optionsRes.json();

      // [FIX] The options are nested inside the `publicKey` property.
      const publicKeyOptions = optionsJson.publicKey;

      // 2. Decode challenge and user ID from Base64URL
      publicKeyOptions.challenge = bufferDecode(publicKeyOptions.challenge);
      publicKeyOptions.user.id = bufferDecode(publicKeyOptions.user.id);

      // 3. Create a new credential using the WebAuthn API
      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions,
      });

      // 4. Format the credential to be sent as JSON
      const attestation = formatCredential(credential);

      // 5. Send the attestation to the server to finalize registration
      const registerRes = await fetch(`${baseUrl}/auth/register/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(attestation),
        mode: "cors",
      });

      if (!registerRes.ok) {
        const errText = await registerRes.text();
        throw new Error(errText || "Fehler beim Abschluss der Registrierung.");
      }

      // 6. Show success message
      setMessage("Registrierung erfolgreich! Du kannst dich jetzt einloggen.");
      setUsername("");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(
        err.message || "Registrierung fehlgeschlagen. Bitte versuche es erneut."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevLogin = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    const optionsRes = await fetch(`${baseUrl}/auth/dev-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
      mode: "cors",
      credentials: "include",
    });
    if (!optionsRes.ok) throw new Error("Benutzername nicht gefunden.");
    await fetchMe();
    setMessage("Login erfolgreich!");
    setUsername("");
    setIsLoading(false);
  };

  /**
   * Handles the user login process with a Passkey.
   */
  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      // 1. Get login options from the server
      const optionsRes = await fetch(`${baseUrl}/auth/login/begin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        mode: "cors",
        credentials: "include",
      });
      if (!optionsRes.ok) throw new Error("Benutzername nicht gefunden.");
      const optionsJson = await optionsRes.json();

      // [FIX] The options are nested inside the `publicKey` property.
      const publicKeyOptions = optionsJson.publicKey;

      // 2. Decode challenge and credential IDs
      publicKeyOptions.challenge = bufferDecode(publicKeyOptions.challenge);
      if (publicKeyOptions.allowCredentials) {
        publicKeyOptions.allowCredentials =
          publicKeyOptions.allowCredentials.map((cred: any) => ({
            ...cred,
            id: bufferDecode(cred.id),
          }));
      }

      // 3. Get an assertion using the WebAuthn API
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyOptions,
      });

      // 4. Format the assertion to be sent as JSON
      const formattedAssertion = formatCredential(assertion);

      // 5. Send the assertion to the server to finalize login
      const loginRes = await fetch(`${baseUrl}/auth/login/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formattedAssertion),
        mode: "cors",
      });

      if (!loginRes.ok) {
        throw new Error("Login fehlgeschlagen.");
      }

      // 6. Fetch user data and show success message
      await fetchMe();
      setMessage("Login erfolgreich!");
      setUsername("");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        err.message ||
          "Login fehlgeschlagen. Überprüfe den Benutzernamen und versuche es erneut."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetches the current user's data if a session exists.
   */
  const fetchMe = async () => {
    try {
      const res = await fetch(`${baseUrl}/auth/me`, {
        credentials: "include",
        mode: "cors",
      });
      if (res.ok) {
        setMe(await res.json());
      } else {
        setMe(null);
      }
    } catch (err) {
      console.error("Could not fetch user data:", err);
      setMe(null);
    }
  };

  /**
   * Handles user logout.
   */
  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout request failed", e);
    } finally {
      setMe(null);
      setMessage("Erfolgreich ausgeloggt.");
      setError(null);
    }
  };

  // Fetch user data on initial component mount
  useEffect(() => {
    fetchMe();
  }, []);

  // --- RENDER (unverändert) ---
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3">
            <KeyIcon /> Passkey Demo
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Registrieren oder einloggen mit biometrischen Daten.
          </p>
        </div>

        {/* --- Form Section --- */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <UserIcon />
            </div>
            <input
              type="text"
              placeholder="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRegister}
              disabled={isLoading || !username}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? <LoaderIcon /> : "Registrieren"}
            </button>
            <button
              onClick={handleLogin}
              disabled={isLoading || !username}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? <LoaderIcon /> : "Login"}
            </button>
            <button
              onClick={handleDevLogin}
              disabled={isLoading || !username}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? <LoaderIcon /> : "DevLogin"}
            </button>
          </div>
        </div>

        {/* --- Message/Error Display --- */}
        <div className="h-12 flex items-center justify-center">
          {error && (
            <div className="w-full flex items-center gap-3 text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <AlertTriangleIcon />
              <span className="text-sm">{error}</span>
            </div>
          )}
          {message && (
            <div className="w-full flex items-center gap-3 text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <CheckCircleIcon />
              <span className="text-sm">{message}</span>
            </div>
          )}
        </div>

        {/* --- Login Status Section --- */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
          {me ? (
            <div className="space-y-2">
              <p className="text-green-600 dark:text-green-400">
                Eingeloggt als <b className="font-bold">{me.username}</b>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                (ID: {me.id})
              </p>
              <button
                onClick={handleLogout}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ausloggen
              </button>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Du bist nicht eingeloggt.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
