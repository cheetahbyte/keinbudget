import { Plus, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useServices } from "~/api/services/services.provider";
import { Button } from "~/components/lib/button";
import { type Theme, useTheme } from "../common/ThemeProvider";
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
import CreateTransactionModal from "./modals/CreateTransaction";
import { useUser } from "~/api/hooks";

const tabs = [
  { name: "Overview", path: "/" },
  { name: "Accounts", path: "/accounts" },
  { name: "Transactions", path: "/transactions" },
  { name: "Categories", path: "/categories" },
  // { name: "Budgets", path: "/budgets" },
  // { name: "Savings", path: "/savings" },
];

export default function Header() {
  const { authService } = useServices();
  const { theme, setTheme } = useTheme();
  const user = useUser();
  const [version, setVersion] = useState<string>("");
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/version`).then((r) =>
      r.json().then((d) => setVersion(d.version))
    );
  }, []);

  const logout = () => {
    navigate("/login");
    authService.logout();
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [createTransactionModal, setCreateNewTransactionModal] =
    useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className="border-b bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">keinbudget.</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild data-testid="user-dropdown">
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 ml-[-120px]"
            side="bottom"
            align="start"
          >
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
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
            <DropdownMenuItem className="text-muted-foreground">
              version: {version}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              variant="destructive"
              data-testid="logout-btn"
            >
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between px-6 pb-4 flex-wrap gap-2">
        <div className="flex space-x-1 bg-muted p-1 rounded-xl">
          {tabs.map((tab) => (
            <Button
              data-testid={`tab-${tab.name.toLowerCase()}`}
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
