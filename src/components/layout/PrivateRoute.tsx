import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
interface PrivateRouteProps {
  children: React.ReactNode;
}
function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, profile } = useAuthStore();
  const { pathname } = useLocation();


  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!profile) {
    if (pathname !== "/set-profile") {
      return <Navigate to="/set-profile" replace />;
    }
    return <>{children}</>;
  }
  if (pathname === "/set-profile") {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
}

export default PrivateRoute;
