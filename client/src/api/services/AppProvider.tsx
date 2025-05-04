import type { ReactNode } from "react";
import { ThemeProvider } from "~/components/theme";

import { UserServiceProvider } from "~/api/services/user.provider";
import { AuthServiceProvider } from "./login.provider";
import { AccountsServiceProvider } from "./accounts.provider";
import { FinanceServiceProvider } from "./finance.provider";
import { TransactionServiceProvider } from "./transactions.provider";


export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <UserServiceProvider>
        <AuthServiceProvider>
          <AccountsServiceProvider>
            <FinanceServiceProvider>
              <TransactionServiceProvider>
                {children}
              </TransactionServiceProvider>
            </FinanceServiceProvider>
          </AccountsServiceProvider>
        </AuthServiceProvider>
      </UserServiceProvider>
    </ThemeProvider>
  );
};
