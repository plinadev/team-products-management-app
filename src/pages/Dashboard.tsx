import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useTeam } from "@/hooks/useTeam";
import { usePresenceStore } from "@/store/presence/usePresenceStore";
import { useState } from "react";

function Dashboard() {
  const { team, isFetching } = useTeam();
  const onlineMembers = usePresenceStore((state) => state.onlineMembers);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(team.team.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onlineTeamMembers = team.members.filter((member: any) =>
    onlineMembers.some((m) => m.id === member.id)
  );

  return (
    <div className="p-6 space-y-6 w-[60%] md:w-[90%] flex flex-col justify-self-center">
      {/* Team Invite Code */}
      <div className="rounded-xl p-4 flex items-center justify-between border-3 border-dashed border-amber-600">
        <div>
          <h2 className="text-2xl font-bold">TEAM INVITE CODE</h2>
          <p className="text-stone-600 text-xl">{team.team.invite_code}</p>
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-sm bg-amber-700 text-white rounded-lg hover:bg-amber-800 cursor-pointer"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Online Members */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Online Team Members</h2>
        {onlineTeamMembers.length === 0 ? (
          <p className="text-stone-500">No one is online right now.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {onlineTeamMembers.map((member: any) => {
              const firstLetter = member.first_name?.[0] ?? member.email[0];
              return (
                <div
                  key={member.id}
                  className="flex items-center gap-3 bg-white shadow rounded-xl p-3"
                >
                  <div className="relative">
                    <div className="flex w-12 h-12 bg-[#BE4E3A] rounded-full items-center justify-center text-white text-xl font-bold">
                      {firstLetter}
                    </div>
                    <span className="absolute bottom-0 right-0 block w-3 h-3 bg-emerald-600 border-2 border-white rounded-full" />
                  </div>

                  <div>
                    <p className="font-medium">
                      {member.first_name} {member.last_name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
