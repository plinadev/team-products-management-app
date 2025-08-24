import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createSupabaseClient } from "../_shared/supabaseClient.ts";
import { handleCors } from "../_shared/cors.ts";
import { requireUser } from "../_shared/requireUser.ts";

Deno.serve(async (req) => {
  const corsHeaders = handleCors(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createSupabaseClient(req);

    // Authenticate user
    const auth = await requireUser(supabase, corsHeaders);
    if ("response" in auth) return auth.response;
    const { user } = auth;

    // Fetch user's profile to get team_id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("team_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.team_id) {
      return new Response(JSON.stringify({ error: "User has no team" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Fetch team info
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, name, invite_code, created_by, created_at")
      .eq("id", profile.team_id)
      .single();

    if (teamError || !team) {
      return new Response(JSON.stringify({ error: "Team not found" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { data: members, error: membersError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, role, avatar_url")
      .eq("team_id", profile.team_id);

    if (membersError) {
      throw membersError;
    }

    return new Response(JSON.stringify({ team, members }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
      { status: 400, headers: corsHeaders }
    );
  }
});
