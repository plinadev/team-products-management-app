import apiClient from "@/lib/apiClient";

interface CreateProfileDto {
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
}

export const createProfile = async (data: CreateProfileDto) => {
  const response = await apiClient.post("/create-profile", data);
  return response.data;
};
