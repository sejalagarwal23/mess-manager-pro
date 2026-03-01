// ================================================================
// SUPABASE CLIENT — NOT USED WITH MERN STACK
// ================================================================
// TODO [MERN INTEGRATION]: This file is auto-generated for Lovable Cloud (Supabase).
// When using your MERN backend, you do NOT need this file.
//
// Instead, use: import { authApi, usersApi, ... } from "@/lib/api";
//
// The api.ts file (src/lib/api.ts) contains all the fetch functions
// that replace Supabase calls with Express backend API calls.
//
// HOW TO MIGRATE:
//   supabase.auth.signInWithPassword()  →  authApi.login()
//   supabase.from('users').select()     →  usersApi.getAll()
//   supabase.from('attendance').select() → attendanceApi.get()
//   supabase.from('notifications').insert() → notificationsApi.send()
//
// You can safely ignore or delete this file and types.ts when
// running with your Express/MongoDB backend.
// ================================================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
