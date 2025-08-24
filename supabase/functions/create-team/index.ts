import { createSupabaseClient } from "../_shared/supabaseClient.ts";
import { handleCors } from "../_shared/cors.ts";
import { requireUser } from "../_shared/requireUser.ts";

function generateInviteCode(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length);
}


async function generateUniqueCode(supabase: any) {
  let code: string;
  let exists = true;

  while (exists) {
    code = generateInviteCode();
    const { data } = await supabase
      .from("teams")
      .select("id")
      .eq("invite_code", code)
      .single();

    if (!data) exists = false;
  }

  return code!;
}

Deno.serve(async (req) => {
  const corsHeaders = handleCors(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createSupabaseClient(req);
    const auth = await requireUser(supabase, corsHeaders);
    if ("response" in auth) return auth.response;
    const { user } = auth;

    const { name } = await req.json();
    if (!name) {
      return new Response(JSON.stringify({ error: "Team name required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

   
    const inviteCode = await generateUniqueCode(supabase);


    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        name,
        invite_code: inviteCode,
        created_by: user.id,
      })
      .select()
      .single();

    if (teamError) throw teamError;


    const { error: profileError } = await supabase
      .from("profiles")
      .update({ team_id: team.id, role: "admin" })
      .eq("id", user.id);

    if (profileError) throw profileError;

    return new Response(JSON.stringify({ success: true, team }), {
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
