import { LogOut } from "lucide-react"
import { Link, useNavigate, useRouter } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import { authClient } from "#/lib/auth"

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase()
}

export function Header() {
  const navigate = useNavigate()
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  async function handleSignOut() {
    await authClient.signOut()
    await navigate({ to: "/login" })
    await router.invalidate()
  }

  return (
    <header className="mx-auto w-full border-b border-[#e9dccd] bg-[#fdf9f4]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link to="/" className="flex items-center gap-3">
          <div>
            <p className="text-lg font-semibold tracking-tight text-[#2e241d]">
              keinbudget
            </p>
            <p className="text-sm text-[#7a6a5d]">
              Track the subscriptions eating your salary
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {isPending ? null : session ? (
            <>
              <div className="hidden items-center gap-3 rounded-full border border-[#e5d7c8] bg-white px-3 py-2 sm:flex">
                <div className="flex size-7.5 items-center justify-center rounded-full bg-[#f1e1c8] text-sm font-semibold text-[#5a4738]">
                  {getInitials(session.user.email)}
                </div>
                <div className="min-w-0">
                  <p className="max-w-52 truncate text-sm font-medium text-[#2e241d]">
                    {session.user.email}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={handleSignOut}
                className="h-11 rounded-full border-[#cfbda7] bg-white px-4 text-[#2e241d] hover:bg-[#f8f1e7]"
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="lg"
              className="h-11 rounded-full bg-[#2e241d] px-5 text-white hover:bg-[#433226]"
            >
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
