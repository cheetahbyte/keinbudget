import type { RouteObject } from "react-router";
import { ServicesProvider } from "~/api/services/services.provider";
import Layout from "~/Layout";
import AccountsPage from "~/routes/home/AccountsPage";
import CategoriesPage from "~/routes/home/CategoriesPage";
import HomePage from "~/routes/home/Dashboard";
import TransactionPage from "~/routes/home/TransactionsPage";
import { ErrorPage } from "./ErrorPage";
import LoginPage from "./Login";
import { ProtectedRoute } from "./ProtectedRoute";
import RegisterPage from "./RegisterPage";

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
