import { createBrowserRouter } from "react-router";
import Home from "./routes/Home";
import Layout from "./Layout";
import LoginPage from "./routes/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);
