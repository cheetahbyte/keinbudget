import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "#/components/ui/button";
import { authClient } from "#/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export function Header() {
  const navigate = useNavigate();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleSignOut() {
    setIsAccountMenuOpen(false);
    await authClient.signOut();
    await navigate({ to: "/login" });
    await router.invalidate();
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
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
                className="flex items-center gap-3 rounded-full border border-[#e5d7c8] bg-white px-3 py-2 text-left text-[#2e241d] transition-colors hover:bg-[#f8f1e7]"
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
              >
                <Avatar>
                  <AvatarImage
                    src={
                      session.user.image ??
                      `https://api.dicebear.com/9.x/thumbs/svg?seed=${session.user.name}`
                    }
                  />
                  <AvatarFallback>
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="max-w-40 truncate pr-1 text-sm font-medium">
                    {session.user.name}
                  </p>
                </div>
                <ChevronDown
                  className={`size-4 text-[#7a6a5d] transition-transform ${
                    isAccountMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isAccountMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-56 rounded-2xl border border-[#e5d7c8] bg-white p-2 shadow-[0_18px_40px_rgba(46,36,29,0.12)]">
                  <Button
                    variant="ghost"
                    size="lg"
                    asChild
                    className="h-11 w-full justify-start rounded-xl px-3 text-[#2e241d] hover:bg-[#f8f1e7]"
                  >
                    <Link
                      to="/settings"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      <Settings className="size-4" />
                      Settings
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleSignOut}
                    className="h-11 w-full justify-start rounded-xl px-3 text-[#2e241d] hover:bg-[#f8f1e7]"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                size="lg"
                className="h-11 rounded-full px-5 "
              >
                <Link to="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="h-11 rounded-full bg-[#2e241d] px-5 text-white hover:bg-[#433226]"
              >
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
