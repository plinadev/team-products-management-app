import apiClient from "@/lib/apiClient";
import type { TeamData } from "@/types/team.type";

export const createTeam = async (name: string) => {
  try {
    const response = await apiClient.post("/create-team", { name });
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

export const getTeam = async () => {
  try {
    const response = await apiClient.get("/get-team");
    return response.data as TeamData;
  } catch (error: any) {
    console.error("Failed to fetch team data:", {
      message: error?.message,
      status: error?.response?.status,
      details: error?.response?.data,
    });
    throw error;
  }
};

export const joinTeam = async (inviteCode: string) => {
  try {
    const response = await apiClient.post("/join-team", { inviteCode });
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
