import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createSupabaseClient } from "../_shared/supabaseClient.ts";
import { handleCors } from "../_shared/cors.ts";


Deno.serve(async (req) => {
  // Preflight handling
  const preflight = handleCors(req);
  if (req.method === "OPTIONS") return preflight as Response;

  try {
    const supabase = createSupabaseClient(req);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: preflight as Record<string, string>,
      });
    }

    const { first_name, last_name, avatar_url } = await req.json();

    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      first_name,
      last_name,
      avatar_url,
      role: "member",
    });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: preflight as Record<string, string>,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: preflight as Record<string, string>,
    });
  }
});
