import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// This is a server-only file
if (typeof window !== "undefined") {
  throw new Error("This file should only be used on the server side")
}

// Create a Supabase client with the service role key for server operations
export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

// If there are any profile completeness checks, replace with:
// Example usage (assuming you have a 'profile' object):
// const isComplete = isProfileComplete(profile);
// console.log('[DEBUG] Server client: Profile completeness check', { isComplete });

