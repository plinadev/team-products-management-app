import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

Deno.serve(async () => {
  try {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const { data: oldDeletedProducts, error: fetchError } = await supabase
      .from("products")
      .select("id, image_url")
      .eq("status", "deleted")
      .lt("updated_at", twoWeeksAgo.toISOString());

    if (fetchError) throw fetchError;

    for (const product of oldDeletedProducts || []) {
      if (product.image_url) {
        const path = product.image_url.split("/products/")[1];
        if (path) {
          await supabase.storage.from("products").remove([`products/${path}`]);
        }
      }
    }

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("status", "deleted")
      .lt("updated_at", twoWeeksAgo.toISOString());

    if (deleteError) throw deleteError;

    console.log("Deleted products successfully:", oldDeletedProducts.length);
    return new Response(
      JSON.stringify({ success: true, deleted: oldDeletedProducts.length })
    );
  } catch (err) {
    console.error("Error deleting old products:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
