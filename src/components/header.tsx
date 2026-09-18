import { useQueryClient } from "@tanstack/react-query";
import {
  Link,
  useNavigate,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "#/components/ui/button";
import { authClient } from "#/lib/auth-client";

const NAV = [
  { to: "/", label: "Overview" },
  { to: "/breakdown", label: "Breakdown" },
  { to: "/entries", label: "Recurring entries" },
  { to: "/categories", label: "Categories" },
  { to: "/settings", label: "Settings" },
] as const;

export function Header() {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
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
    queryClient.clear();
    await navigate({ to: "/login" });
    await router.invalidate();
  }

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <header className="w-full border-b border-border">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 pt-6 pb-4">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          keinbudget
        </Link>

        {isPending ? null : session ? (
          <div className="relative" ref={accountMenuRef}>
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((open) => !open)}
              className="flex h-9 items-center gap-1.5 rounded-md px-2 text-sm text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              aria-expanded={isAccountMenuOpen}
              aria-haspopup="menu"
            >
              <span className="max-w-40 truncate">{session.user.name}</span>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform ${
                  isAccountMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isAccountMenuOpen ? (
              <div className="absolute top-[calc(100%+0.25rem)] right-0 z-20 w-48 rounded-md bg-popover p-1 ring-1 ring-foreground/10 shadow-[0_8px_24px_rgba(27,29,34,0.08)]">
                <Button
                  variant="ghost"
                  asChild
                  className="h-9 w-full justify-start"
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
                  onClick={handleSignOut}
                  className="h-9 w-full justify-start"
                >
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Button variant="ghost" asChild size="lg">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/signup">Create account</Link>
            </Button>
          </div>
        )}
      </div>

      {!isAuthPage && (
        <nav
          aria-label="Main navigation"
          className="mx-auto flex w-full max-w-5xl flex-wrap gap-x-5 gap-y-2 px-6"
        >
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: true, includeSearch: false }}
              activeProps={{
                className: "border-pen text-foreground",
                "aria-current": "page",
              }}
              inactiveProps={{
                className:
                  "border-transparent text-muted-foreground hover:text-foreground",
              }}
              className="shrink-0 border-b-2 pb-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
