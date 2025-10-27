import { NextApiRequest, NextApiResponse } from 'next';
// 服务端 API 必须用 supabaseServer 客户端
import { supabaseServer } from '@/lib/supabase-server';
import { successResponse, errorResponse } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return errorResponse(res, 405, '只支持 GET 请求');
  }

  try {
    const { data: questions, error } = await supabaseServer
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return successResponse(res, { content: questions });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
}
