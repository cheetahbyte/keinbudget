import { RouteObject } from "react-router";
import { ProtectedLayout } from "~/ProtectedLayout";
import LoginPage from "./Login";
import HomePage from "~/routes/home/Dashboard"
import { ErrorPage } from "./ErrorPage";
import AccountsPage from "./home/AccountsPage";

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
      }
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
];
