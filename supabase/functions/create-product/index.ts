import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createSupabaseClient } from "../_shared/supabaseClient.ts";
import { handleCors } from "../_shared/cors.ts";
import { requireUser } from "../_shared/requireUser.ts";

Deno.serve(async (req) => {
  const corsHeaders = handleCors(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createSupabaseClient(req);

    // Auth guard
    const auth = await requireUser(supabase, corsHeaders);
    if ("response" in auth) return auth.response;
    const { user } = auth;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const title = String(body?.title ?? "").trim();
    const description = body?.description ?? null;
    const image_url = body?.image_url ?? null;

    if (!title) {
      return new Response(JSON.stringify({ error: "Title is required" }), {
        status: 422,
        headers: corsHeaders,
      });
    }

    const { data: team_id, error: teamErr } = await supabase.rpc(
      "team_id_for_user"
    );

    if (teamErr || !team_id) {
      return new Response(JSON.stringify({ error: "No team assigned" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { data: product, error: insertErr } = await supabase
      .from("products")
      .insert({
        title,
        description,
        image_url,
        team_id,
        created_by: user.id,
        status: "draft",
      })
      .select(
        "id, team_id, created_by, title, description, image_url, status, created_at, updated_at"
      )
      .single();

    if (insertErr) throw insertErr;

    return new Response(JSON.stringify({ success: true, product }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
      { status: 400, headers: handleCors(req) }
    );
  }
});
