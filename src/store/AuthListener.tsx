import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { getProfile } from "@/services/authService";
import { useLoadingStore } from "./useLoadingState";

function AuthListener() {
  const { setSession, setProfile, clearAuth, setAuthReady } = useAuthStore();
  const { setLoading } = useLoadingStore();

  useEffect(() => {
    const handleSession = async (session: any) => {
      if (!session) {
        clearAuth();
        setAuthReady(true);
        return;
      }

      setSession(session);

      // Start global loading for profile fetch
      setLoading(true);
      try {
        const userData = await getProfile();
        setProfile(userData?.user?.profile ?? null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setProfile(null);
      } finally {
        setLoading(false); // Stop global loading
        setAuthReady(true); // Auth is ready once profile is loaded
      }
    };

    const initAuth = async () => {
      setLoading(true); // loader during initial session fetch
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await handleSession(session);
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        clearAuth();
        setAuthReady(true);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await handleSession(session);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [setSession, setProfile, clearAuth, setAuthReady, setLoading]);

  return null;
}

export default AuthListener;
