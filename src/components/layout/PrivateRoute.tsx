import { useAuthStore } from "@/store/useAuthStore";
import { Navigate } from "react-router-dom";
import Layout from "./Layout";
interface PrivateRouteProps {
  children: React.ReactNode;
}
function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!user.profile) {
    return <Navigate to="/set-name" replace />;
  }
  return <Layout>{children}</Layout>;
}

export default PrivateRoute;
