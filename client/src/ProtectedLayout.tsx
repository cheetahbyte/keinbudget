import { Navigate, Outlet } from "react-router";
import { useToken } from "~/api/hooks";
import { AppProviders } from "./api/services/AppProvider";
import Header from "./components/ui/HeaderBar";

export function ProtectedLayout() {
  const token = useToken();

  if (token === undefined) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <AppProviders>
        <Header/>
        <Outlet />
      </AppProviders>
    </>
  );
}
