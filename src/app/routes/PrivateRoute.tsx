import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useIsAuthenticated } from "@/stores/auth.store";

export function PrivateRoute() {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
