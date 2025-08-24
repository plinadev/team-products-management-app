import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

/**
 * Ensures the request is authenticated and returns the current user.
 * If unauthorized, returns a Response immediately.
 */
export async function requireUser(
  supabase: SupabaseClient,
  corsHeaders: Record<string, string>
): Promise<{ user: any } | { response: Response }> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      response: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      }),
    };
  }

  return { user };
}
