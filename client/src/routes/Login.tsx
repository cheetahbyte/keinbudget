import { useState } from "react";
import { Card, CardHeader, CardTitle } from "~/components/lib/card";
import { LoginCardContent, TwoFACardContent } from "~/components/ui/login";

export default function LoginPage() {
  const [tFaReq, set2FA] = useState(false);
  const [intermediateToken, setIntermediate] = useState("");
  const requestFor2FA = (token: string) => {
    set2FA(true);
    setIntermediate(token);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-svh"
      style={{
        backgroundImage: "url('/login-background.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            keinbudget login
          </CardTitle>
        </CardHeader>
        {tFaReq ? (
          <TwoFACardContent token={intermediateToken} />
        ) : (
          <LoginCardContent on2FARequired={requestFor2FA} />
        )}
      </Card>
    </div>
  );
}
