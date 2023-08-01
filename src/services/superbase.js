import { createClient } from "@supabase/supabase-js";
//import { env } from 'node:process';
const supabaseUrl = "https://aizlrqfnpxtfciqxiphw.supabase.co";
const supabaseKey =
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemxycWZucHh0ZmNpcXhpcGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA4MzgwNjUsImV4cCI6MjAwNjQxNDA2NX0.9nDDB4VQQwNTdzAMoV1hlyMNq53idKs7LpN7JV2pbU0";
const supabase = createClient(supabaseUrl, supabaseKey);
//const supabase = createClient(supabaseUrl, env.SUPABASE_KEY);

export default supabase;
