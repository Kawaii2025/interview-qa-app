import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '@/lib/supabase-server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { callTongyi } from '@/lib/tongyi'; // 导入兼容模式工具

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return errorResponse(res, 405, '只支持 GET 请求');
  }

  const { questionId } = req.query;
  if (!questionId || isNaN(Number(questionId))) {
    return errorResponse(res, 400, '无效的题目 ID');
  }
  const question_id = Number(questionId);

  try {
    // 1. 先查数据库，避免重复调用 AI
    const { data: aiAnswer } = await supabaseServer
      .from('ai_answers')
      .select('content')
      .eq('question_id', question_id)
      .single();

    if (aiAnswer) {
      return successResponse(res, { content: aiAnswer.content });
    }

    // 2. 获取题目内容，生成提示词
    const { data: question, error: questionError } = await supabaseServer
      .from('questions')
      .select('content')
      .eq('id', question_id)
      .single();

    if (questionError) throw questionError;

    // 3. 调用通义千问（兼容模式，无需签名）
    const prompt = `请以面试回答的风格，简洁、清晰地解答这道题，控制在合理长度：${question.content}`;
    const aiContent = await callTongyi(prompt);

    // 4. 保存 AI 回答到数据库
    await supabaseServer
      .from('ai_answers')
      .insert({ question_id, content: aiContent });

    return successResponse(res, { content: aiContent });
  } catch (error: any) {
    return errorResponse(res, 500, 'AI 回答生成失败', error.message);
  }
}
