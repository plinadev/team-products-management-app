import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import {create} from "zustand"

interface UserState {
    user: User | null,
    loading: boolean,
    setUser: (user: User | null) => void;
    fetchUser: ()=> Promise<void>;
    initAuthListener: ()=> void;

}

export const useAuthStore = create<UserState>((set)=> ({
    user: null,
    loading: true,
    setUser: (user)=> set({user}),
    fetchUser: async ()=> {
        const {data, error} = await supabase.auth.getUser()
        if(error){
            console.error("Error fetching user: ", error)
            set({user: null, loading: false})
            return;
        }
        set({user: data.user, loading: false})
    },
    initAuthListener: ()=> {
        const {data: subscription} = supabase.auth.onAuthStateChange(
            (_event, session)=> {
                set({user: session?.user ?? null})
            }

        )
        return ()=> subscription.subscription.unsubscribe()
    }
}))