import { useAuthStore } from "@/store/useAuthStore";
import { Navigate } from "react-router-dom";
interface PrivateRouteProps {
  children: React.ReactNode;
}
function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <div>{children}</div>;
}

export default PrivateRoute;
