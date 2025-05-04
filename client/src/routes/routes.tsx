import { RouteObject } from "react-router";
import { ProtectedLayout } from "~/ProtectedLayout";
import LoginPage from "./Login";
import HomePage from "~/routes/home/Dashboard"
import { ErrorPage } from "./ErrorPage";
import AccountsPage from "~/routes/home/AccountsPage";
import RegisterPage from "./RegisterPage";
import TransactionPage from "~/routes/home/TransactionsPage";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        element: <AccountsPage/>,
        path: "/accounts"
      },
      {
        element: <TransactionPage/>,
        path: "/transactions"
      }
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage/>
  }
];
