import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useTeam } from "@/hooks/team/useTeam";
import { usePresenceStore } from "@/store/presence/usePresenceStore";

function Team() {
  const { team, isFetching } = useTeam();
  const onlineMembers = usePresenceStore((state) => state.onlineMembers);
  if (isFetching) {
    return (
      <div className="w-full flex items-center justify-center">
        <Spinner variant="bars" size={40} className="text-amber-700" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="w-full flex items-center justify-center text-bold text-xl">
        404 No team found
      </div>
    );
  }

  return (
    <div className="p-6 g:w-[60%] w-[90%] flex flex-col justify-self-center">
      <h1 className="text-2xl font-semibold mb-4">
        {team.team.name}{" "}
        <span className="text-sm text-stone-500">
          ({team.team.invite_code})
        </span>
      </h1>

      <div className="grid gap-4">
        {team.members.map((member: any) => {
          const firstLetter = member.first_name?.[0] ?? member.email[0];
          const isOnline = onlineMembers.some((m) => m.id === member.id);

          return (
            <div
              key={member.id}
              className="flex items-center justify-between bg-white shadow rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                {/* Avatar with badge */}
                <div className="relative">
                  <div className="flex w-12 h-12 bg-[#BE4E3A] rounded-full items-center justify-center text-white text-xl font-bold">
                    {firstLetter}
                  </div>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 block w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div>
                  <p className="font-medium">
                    {member.first_name} {member.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={`${
                  member.role === "admin" ? "bg-amber-100" : "bg-stone-100"
                }`}
              >
                {member.role}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Team;
