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

   const auth = await requireUser(supabase, corsHeaders);
       if ("response" in auth) return auth.response; 
       const { user } = auth

    const { inviteCode } = await req.json();
    if (!inviteCode) {
      return new Response(JSON.stringify({ error: "Invite code required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Find team by invite code
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id")
      .eq("invite_code", inviteCode)
      .single();

    if (teamError || !team) {
      return new Response(JSON.stringify({ error: "Invalid invite code" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Link profile to team
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ team_id: team.id })
      .eq("id", user.id);

    if (profileError) throw profileError;

    return new Response(JSON.stringify({ success: true, team_id: team.id }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 400, headers: corsHeaders }
    );
  }
});
