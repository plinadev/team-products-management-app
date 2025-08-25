import { getTeam } from "@/services/teamService";
import { useQuery } from "@tanstack/react-query";

export const useTeam = () => {

  const {
    data: team,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["team"],
    queryFn: () => getTeam(),
  });

  return { team, isFetching, error };
};
