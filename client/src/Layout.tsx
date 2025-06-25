import { type JSX, useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { useUser } from "./api/hooks";
import { ThemeProvider } from "./components/common/ThemeProvider";
import Header from "./components/ui/HeaderBar";
import { TransactionStoreInitializer } from "./components/common/TransactionStoreInitializer";

export default function Layout(): JSX.Element {
  const user = useUser();
  const navigate = useNavigate();
  const isAuthPage = ["/login", "/register"].includes(window.location.pathname);

  useEffect(() => {
    if (user === null && !isAuthPage) navigate("/login");
    if (user && isAuthPage) navigate("/");
  }, [user, isAuthPage, navigate]);

  if (user === undefined) return <p>Loading...</p>;

  return (
    <div>
      <TransactionStoreInitializer />
      <main>
        <ThemeProvider>
          <Header />
          <Outlet />
        </ThemeProvider>
      </main>
    </div>
  );
}
