// 前端专用客户端（浏览器中使用，权限有限）// lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js';

// 校验前端环境变量
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

// 前端专用客户端（浏览器中使用，权限有限）
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
