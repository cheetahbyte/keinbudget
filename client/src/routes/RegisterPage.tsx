import { Card, CardHeader, CardTitle } from "~/components/lib/card";
import { AuthServiceProvider } from "~/api/services/login.provider";
import { SignUpCardContent } from "~/components/ui/Register";

export default function RegisterPage() {

  return (
    <AuthServiceProvider>
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
          <SignUpCardContent/>
        </Card>
      </div>
    </AuthServiceProvider>
  );
}
