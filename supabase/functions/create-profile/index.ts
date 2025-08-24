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

    const { first_name, last_name, avatar_url } = await req.json();

    const { data: profileData, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        first_name,
        last_name,
        avatar_url,
        role: "member",
      })
      .select() 
      .single(); 

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ success: true, profile: profileData }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 400, headers: corsHeaders }
    );
  }
});
