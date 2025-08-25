import type { Member } from "./team.type";

export type Product = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: "draft" | "active" | "deleted";
  created_at: string;
  updated_at: string;
  author: Member;
};
