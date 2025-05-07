import { Button } from "~/components/lib/button";
import { Plus, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import CreateTransactionModal from "./modals/CreateTransaction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../lib/dropdown-menu";
import { useUserService } from "~/api/services/user.service";
import type { User as UserType } from "~/api/types/user";
import { useTheme, type Theme } from "../theme";
import { useAuth } from "~/api/services/login.service";

const tabs = [
  { name: "Overview", path: "/" },
  { name: "Accounts", path: "/accounts" },
  { name: "Transactions", path: "/transactions" },
  // { name: "Budgets", path: "/budgets" },
  // { name: "Savings", path: "/savings" },
];

export default function Header() {
  const userService = useUserService();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [version, setVersion] = useState<string>("");
  const authService = useAuth()
  useEffect(() => {
    userService.getMe().then(setUser);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/version`).then((r) =>
      r.json().then((d) => setVersion(d.version))
    );
  }, [userService]);

  const logout = () => {authService.logout(); navigate("/login")};

  const navigate = useNavigate();
  const location = useLocation();
  const [createTransactionModal, setCreateNewTransactionModal] =
    useState(false);

  if (!user) {
    return <p>Loading.</p>;
  }

  return (
    <div className="border-b bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">keinbudget.</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 ml-[-120px]"
            side="bottom"
            align="start"
          >
            <DropdownMenuLabel>{user!.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Color Scheme</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(s: string) => setTheme(s as Theme)}
                  >
                    <DropdownMenuRadioItem value="light">
                      Light Mode
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      Dark Mode
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground">version: {version}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} variant="destructive">Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between px-6 pb-4 flex-wrap gap-2">
        <div className="flex space-x-1 bg-muted p-1 rounded-xl">
          {tabs.map((tab) => (
            <Button
              key={tab.path}
              variant={location.pathname === tab.path ? "secondary" : "ghost"}
              className={`rounded-xl text-sm font-medium px-4 cursor-pointer ${
                location.pathname === tab.path ? "bg-card shadow-sm" : ""
              }`}
              onClick={() => navigate(tab.path)}
            >
              {tab.name}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/** 
          <Button variant="outline" className="flex items-center gap-1 text-sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-1 text-sm">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          */}
          <Button
            className="flex items-center gap-1 text-sm"
            onClick={() => setCreateNewTransactionModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        </div>
      </div>
      <CreateTransactionModal
        open={createTransactionModal}
        setOpen={setCreateNewTransactionModal}
      />
    </div>
  );
}
