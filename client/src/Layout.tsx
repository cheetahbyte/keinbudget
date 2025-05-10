import { Outlet, useNavigate } from "react-router";
import { ThemeProvider } from "./components/common/ThemeProvider";
import Header from "./components/ui/HeaderBar";
import { useUser } from "./api/hooks";
import { useEffect } from "react";

export default function Layout() {
  const user = useUser();
  const navigate = useNavigate();
  const isAuthPage = ["/login", "/register"].includes(window.location.pathname);

  useEffect(() => {
    if (!user && !isAuthPage) {
      navigate("/login");
    }
  }, [user, isAuthPage, navigate]);

  if (!user && !isAuthPage) return null;

  if (user && isAuthPage) return navigate("/");

  return (
    <div>
      <main>
        <ThemeProvider>
          <Header />
          <Outlet />
        </ThemeProvider>
      </main>
    </div>
  );
}
