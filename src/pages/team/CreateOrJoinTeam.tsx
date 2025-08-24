import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createTeam, joinTeam } from "@/services/teamService";

function CreateOrJoinTeam() {
  const [name, setName] = useState("");
  const [inviteCode, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setProfile = useAuthStore((state) => state.setProfile);
  const profile = useAuthStore((state) => state.profile);
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!name.trim()) {
      toast.error("Provide a valid name");
      return;
    }
    try {
      const result = await createTeam(name);

      if (result.success) {
        setProfile({
          first_name: profile?.first_name ?? "",
          last_name: profile?.last_name ?? "",
          avatar_url: profile?.avatar_url ?? null,
          role: "admin",
          team_id: result.team.id,
        });

        toast.success("Team created successfully");
        navigate("/");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response.data.error || "An error occurred while setting up profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!inviteCode.trim()) {
      toast.error("Provide a code to join team");
      return;
    }
    try {
      const result = await joinTeam(inviteCode);

      if (result.success) {
        setProfile({
          first_name: profile?.first_name ?? "",
          last_name: profile?.last_name ?? "",
          avatar_url: profile?.avatar_url ?? null,
          role: profile?.role ?? "",
          team_id: result.team_id,
        });

        toast.success("You successfully joined the team");
        navigate("/");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response.data.error || "An error occurred while setting up profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={cn("flex flex-col gap-6 w-1/2")}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create or join team</CardTitle>
            <CardDescription>
              Create your own team or join one with invite code{" "}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="surname">Surname</Label>
                  <Input
                    id="surname"
                    type="text"
                    placeholder="surname"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Continue"}
                </Button>
              </div>
            </form> */}
            <Tabs defaultValue="create">
              <TabsList>
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="password">Join</TabsTrigger>
              </TabsList>
              <TabsContent value="create">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Team</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="tabs-demo-name">Name</Label>
                      <Input
                        id="tabs-demo-name"
                        placeholder="ex. Online store storage"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={handleCreateTeam}
                      disabled={loading}
                    >
                      {loading ? "Creating team..." : "Save and proceed"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Join Team</CardTitle>
                    <CardDescription>
                      To join team provie an invite code.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="tabs-demo-current">Invite code</Label>
                      <Input
                        id="tabs-demo-current"
                        type="text"
                        placeholder="ex. 2837y2"
                        value={inviteCode}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={handleJoinTeam}
                      disabled={loading}
                    >
                      {loading ? "Joining team..." : "Join"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}

export default CreateOrJoinTeam;
