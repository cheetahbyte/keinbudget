import { Outlet } from "react-router";
import { AccountsServiceProvider } from "./api/services/accounts.provider";
import { FinanceServiceProvider } from "./api/services/finance.provider";
import { AuthServiceProvider } from "./api/services/login.provider";
import { TransactionServiceProvider } from "./api/services/transactions.provider";
import { UserServiceProvider } from "./api/services/user.provider";
import { ThemeProvider } from "./components/theme";

export default function Layout() {
  return (
    <div>
      <main>
        <ServiceProviders>
          <Outlet />
        </ServiceProviders>
      </main>
    </div>
  );
}

function ServiceProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthServiceProvider>
        <UserServiceProvider>
          <FinanceServiceProvider>
            <AccountsServiceProvider>
              <TransactionServiceProvider>
                {children}
              </TransactionServiceProvider>
            </AccountsServiceProvider>
          </FinanceServiceProvider>
        </UserServiceProvider>
      </AuthServiceProvider>
    </ThemeProvider>
  );
}
