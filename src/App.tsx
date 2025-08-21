import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import GoogleLogin from "./pages/auth/GoogleLogin";
import UpdatePassword from "./pages/auth/UpdatePassword";
import SetProfile from "./pages/auth/SetProfile";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PublicRoute from "./components/layout/PublicRoute";
import PrivateRoute from "./components/layout/PrivateRoute";
function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const initAuthListener = useAuthStore((state) => state.initAuthListener);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    fetchUser();
    const unsubscribe = initAuthListener();
    return unsubscribe;
  }, [fetchUser, initAuthListener]);

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/google-login"
          element={
            <PublicRoute>
              <GoogleLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/update-password"
          element={
            <PublicRoute>
              <UpdatePassword />
            </PublicRoute>
          }
        />
        <Route
          path="/set-profile"
          element={
            <PrivateRoute>
              <SetProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
