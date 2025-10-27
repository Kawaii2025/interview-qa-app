// lib/supabase-server.ts
import { createClient } from '@supabase/supabase-js';

// 校验服务端环境变量
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
}

// 服务端专用客户端（仅在 Node 环境使用，权限完整）
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
