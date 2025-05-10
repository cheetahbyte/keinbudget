import type { RouteObject } from "react-router";
import Layout from "~/Layout";
import AccountsPage from "~/routes/home/AccountsPage";
import HomePage from "~/routes/home/Dashboard";
import TransactionPage from "~/routes/home/TransactionsPage";
import CategoriesPage from "~/routes/home/CategoriesPage";
import { ErrorPage } from "./ErrorPage";
import LoginPage from "./Login";
import RegisterPage from "./RegisterPage";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        element: <AccountsPage />,
        path: "/accounts",
      },
      {
        element: <TransactionPage />,
        path: "/transactions",
      },
      {
        element: <CategoriesPage />,
        path: "/categories",
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
];
