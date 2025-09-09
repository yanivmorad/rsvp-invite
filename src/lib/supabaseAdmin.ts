//C:\Users\yc\rsvp-invite\src\lib\supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
