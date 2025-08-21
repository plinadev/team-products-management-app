import { useAuthStore } from "@/store/useAuthStore";

function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return <div>{user?.email}</div>;
}

export default Dashboard;
