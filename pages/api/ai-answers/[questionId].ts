import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '@/lib/supabase-server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { callTongyi } from '@/lib/tongyi'; // 导入兼容模式工具

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET と POST のみ許可
  if (req.method !== 'GET' && req.method !== 'POST') {
    return errorResponse(res, 405, '只支持 GET 或 POST 请求');
  }

  // 认证检查：从请求头获取 token 并验证用户
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return errorResponse(res, 401, '未提供认证令牌');
  }

  const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
  if (authError || !user) {
    return errorResponse(res, 401, '认证失败，请重新登录');
  }

  const { questionId } = req.query;
  if (!questionId || isNaN(Number(questionId))) {
    return errorResponse(res, 400, '无效的题目 ID');
  }
  const question_id = Number(questionId);

  try {
    // 1. 先查数据库，避免重复调用 AI
    // GET: 既存の回答を返す（なければ 404）
    if (req.method === 'GET') {
      const { data: aiAnswer, error } = await supabaseServer
        .from('ai_answers')
        .select('content')
        .eq('question_id', question_id)
        .single();

      if (error || !aiAnswer) {
        return errorResponse(res, 404, '该题目暂无 AI 回答');
      }
      return successResponse(res, { content: aiAnswer.content });
    }

    // POST: 新規生成または再生成
    if (req.method === 'POST') {
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
    }
  } catch (error: any) {
    return errorResponse(res, 500, 'AI 回答生成失败', error.message);
  }
}
