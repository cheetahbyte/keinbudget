import type { RouteObject } from "react-router";
import Layout from "~/Layout";
import AccountsPage from "~/routes/home/AccountsPage";
import HomePage from "~/routes/home/Dashboard";
import TransactionPage from "~/routes/home/TransactionsPage";
import CategoriesPage from "~/routes/home/CategoriesPage";
import { ErrorPage } from "./ErrorPage";
import LoginPage from "./Login";
import RegisterPage from "./RegisterPage";
import { ServicesProvider } from "~/api/services/services.provider";
import { ProtectedRoute } from "./ProtectedRoute";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ServicesProvider>
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      </ServicesProvider>
    ),
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
    ],
  },
  {
    path: "/login",
    element: (
      <ServicesProvider>
        <LoginPage />
      </ServicesProvider>
    ),
  },
  {
    path: "/register",
    element: (
      <ServicesProvider>
        <RegisterPage />
      </ServicesProvider>
    ),
  },
];
