import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import GoogleLogin from "./pages/auth/GoogleLogin";
import UpdatePassword from "./pages/auth/UpdatePassword";
import SetProfile from "./pages/auth/SetProfile";
import { Toaster } from "react-hot-toast";
import PublicRoute from "./components/layout/PublicRoute";
import PrivateRoute from "./components/layout/PrivateRoute";
import Products from "./pages/Products";
import Team from "./pages/Team";
import CreateProductPage from "./pages/CreateProductPage";
import AppLoader from "./components/Loader";
import AuthListener from "./store/AuthListener";
import { useLoadingStore } from "./store/useLoadingState";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const loading = useLoadingStore((state) => state.isLoading);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const shouldShowLoader = !isAuthReady || loading;

  return (
    <>
      <AuthListener />
      {!shouldShowLoader ? (
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
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <Products />
                </PrivateRoute>
              }
            />
            <Route
              path="/team"
              element={
                <PrivateRoute>
                  <Team />
                </PrivateRoute>
              }
            />
            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <CreateProductPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      ) : (
        <AppLoader />
      )}
    </>
  );
}

export default App;
