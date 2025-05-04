import { Outlet } from "react-router";
import { ThemeProvider } from "./components/theme";
import { UserServiceProvider } from "./api/services/user.provider";

export default function Layout() {
  return (
    <div>
      <main>
        <ThemeProvider>
          <UserServiceProvider>
            <Outlet />
          </UserServiceProvider>
        </ThemeProvider>
      </main>
    </div>
  );
}
