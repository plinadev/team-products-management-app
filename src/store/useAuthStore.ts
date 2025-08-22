import { supabase } from "@/lib/supabase";
import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

export interface AppUser extends User {
  profile: Profile | null;
}

interface UserState {
  user: AppUser | null;
  loading: boolean;
  setUser: (user: AppUser | null) => void;
  fetchUser: () => Promise<void>;
  initAuthListener: () => void;
}

export const useAuthStore = create<UserState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      console.error("Error fetching auth user:", error);
      set({ user: null, loading: false });
      return;
    }

    const authUser = data.user;

    // fetch profile row
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url, role")
      .eq("id", authUser.id)
      .single();

    if (profileError) {
      console.warn("No profile found, continuing with auth user only:", profileError.message);
    }

    const mergedUser: AppUser = {
      ...authUser,
      profile: profileData ?? null,
    };

    set({ user: mergedUser, loading: false });
  },

  initAuthListener: () => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          set({ user: null });
          return;
        }

        const authUser = session.user;

        const { data: profileData } = await supabase
          .from("profiles")
          .select("first_name, last_name, avatar_url, role")
          .eq("id", authUser.id)
          .single();

        const mergedUser: AppUser = {
          ...authUser,
          profile: profileData ?? null,
        };

        set({ user: mergedUser });
      }
    );

    return () => subscription.subscription.unsubscribe();
  },
}));
