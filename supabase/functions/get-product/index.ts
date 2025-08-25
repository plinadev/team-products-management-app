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
    const { user } = auth;

    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "Product ID is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
        id,
        title,
        description,
        image_url,
        status,
        created_at,
        updated_at,
        author:profiles(id, first_name, last_name, role)
      `
      )
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ product }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message ?? "Internal Server Error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
