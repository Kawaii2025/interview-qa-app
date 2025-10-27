// pages/api/user-answers.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '@/lib/supabase-server';
import { successResponse, errorResponse } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持 POST 请求' });
  }

  // 从请求体获取数据（question_id 和用户回答 content）
  const { question_id, content } = req.body;

  // 简单校验（避免空数据）
  if (!question_id || !content) {
    return errorResponse(res, 400, '题目ID和回答内容不能为空');
  }

  try {
    // 先查询该题目是否已有用户回答（单用户场景，按 question_id 查）
    const { data: existingAnswer } = await supabaseServer
      .from('user_answers')
      .select('id')
      .eq('question_id', question_id)
      .single();

    let result;
    if (existingAnswer) {
      // 已有回答：更新
      result = await supabaseServer
        .from('user_answers')
        .update({ content, updated_at: new Date() })
        .eq('id', existingAnswer.id);
    } else {
      // 无回答：新增
      result = await supabaseServer
        .from('user_answers')
        .insert({ question_id, content });
    }

    if (result.error) throw result.error;
    return successResponse(res, { content: '回答保存成功' });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
}
