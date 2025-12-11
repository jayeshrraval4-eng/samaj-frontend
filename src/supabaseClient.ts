import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pfbqqrnovujmeadowefl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmYnFxcm5vdnVqbWVhZG93ZWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjQyMzgsImV4cCI6MjA4MDUwMDIzOH0.Qpqv9ebM-ikfdHX1dT7ZtHTUPr-AxBDXDwGlZUsvYUE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
