import apiClient from "@/lib/apiClient";

interface CreateProfileDto {
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
}

export const createProfile = async (data: CreateProfileDto) => {
  try {
    const response = await apiClient.post("/create-profile", data);
    return response.data;
  } catch (error: any) {
    console.error("Failed to create profile:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error; 
  }
};

export const getProfile = async () => {
  try {
  
    const response = await apiClient.get("/get-profile");
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch profile:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

