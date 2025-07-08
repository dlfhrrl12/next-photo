import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../../../database.types";

export function createClient() {
  console.log(
    "Supabase URL from client:",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
