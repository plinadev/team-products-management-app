import AuthLayout from "@/components/custom/AuthLayout";
import { GoogleLoginForm } from "@/components/google-login";

function GoogleLogin() {
  return (
    <AuthLayout>
      <GoogleLoginForm />
    </AuthLayout>
  );
}

export default GoogleLogin;
