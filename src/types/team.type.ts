export type Team = {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
};

export type Member = {
  id: string;
  first_name: string;
  last_name: string;
  role: "member" | "admin";
};

export type TeamData = {
  team: Team;
  members: Member[];
};
