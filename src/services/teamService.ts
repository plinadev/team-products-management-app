import apiClient from "@/lib/apiClient";

export const createTeam = async (name: string) => {
  try {
    const response = await apiClient.post("/create-team", {name});
    return response.data;
  } catch (error: any) {
    console.error("Failed to create team:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error; 
  }
};


export const joinTeam = async (inviteCode: string) => {
  try {
    const response = await apiClient.post("/join-team", {inviteCode});
    return response.data;
  } catch (error: any) {
    console.error("Failed to join team:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error; 
  }
};
