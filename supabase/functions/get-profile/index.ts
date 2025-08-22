import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createSupabaseClient } from "../_shared/supabaseClient.ts";
import { handleCors } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const corsHeaders = handleCors(req);

  // Preflight handling
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createSupabaseClient(req);

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch profile row
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!profileData) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Merge auth user + profile
    const mergedUser = { ...user, profile: profileData };

    return new Response(JSON.stringify({ user: mergedUser }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message ?? "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
