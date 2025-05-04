import { Outlet } from "react-router";
/*
import { AccountsServiceProvider } from "./api/services/accounts.provider";
import { FinanceServiceProvider } from "./api/services/finance.provider";
import { AuthServiceProvider } from "./api/services/login.provider";
import { TransactionServiceProvider } from "./api/services/transactions.provider";
import { UserServiceProvider } from "./api/services/user.provider";*/
import { ThemeProvider } from "./components/theme";
import { UserServiceProvider } from "./api/services/user.provider";

export default function Layout() {
  return (
    <div>
      <main>
        <ThemeProvider>
          <UserServiceProvider>
            <Outlet />
          </UserServiceProvider>
        </ThemeProvider>
      </main>
    </div>
  );
}
