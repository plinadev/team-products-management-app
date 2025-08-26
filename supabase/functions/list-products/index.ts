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

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");

    const status = url.searchParams.get("status");
    const authorId = url.searchParams.get("created_by");
    const createdFrom = url.searchParams.get("created_from");
    const createdTo = url.searchParams.get("created_to");
    const search = url.searchParams.get("search");

    let query = supabase
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
        created_by,
        author:profiles(id, first_name, last_name, role)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (authorId) query = query.eq("created_by", authorId);
    if (createdFrom) query = query.gte("created_at", createdFrom);
    if (createdTo) query = query.lte("created_at", createdTo);

    if (search) {
      query = query.textSearch("title_description", search, {
        type: "plain",
      });
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: products, error, count } = await query;

    if (error) throw error;

    return new Response(
      JSON.stringify({
        products,
        total: count ?? 0,
        page,
        pageSize,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
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
