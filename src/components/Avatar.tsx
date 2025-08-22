import placeholder from "../assets/placeholder.svg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Avatar() {
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const avatarUrl = profile?.avatar_url;
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearAuth();
      navigate("/login");
      toast.success("You were successfully logged out");
    } catch (error) {
      console.error("Failed to log out:", error);
      toast.error("Something went wrong! Try again later");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <img
          src={avatarUrl ?? placeholder}
          alt="profile picture"
          width={55}
          className="cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end">
        <DropdownMenuLabel className="font-bold text-amber-800 text-lg">
          My Account
        </DropdownMenuLabel>

        <DropdownMenuLabel className="font-normal">
          {profile?.first_name} {profile?.last_name}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="font-normal">
          {user?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default Avatar;
