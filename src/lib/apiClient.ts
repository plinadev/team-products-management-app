import axios from "axios";
import { supabase } from "./supabase";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_FUNCTIONS_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const session = await supabase.auth.getSession();
  const accessToken = session.data.session?.access_token;

  if (accessToken && config.headers) {
    config.headers = new axios.AxiosHeaders(config.headers);
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

export default apiClient;
