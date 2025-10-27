import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// 前端组件只能用 supabase 客户端
import { supabase } from '@/lib/supabase-client';

type Question = {
  id: number;
  content: string;
  type: number;
  difficulty: number;
};

type UserAnswer = {
  content: string;
};

export default function QuestionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [savedUserAnswer, setSavedUserAnswer] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [loading, setLoading] = useState({
    question: true,
    userAnswer: false,
    aiAnswer: false
  });

  useEffect(() => {
    if (!id || isNaN(Number(id))) return;
    const questionId = Number(id);

    async function fetchData() {
      setLoading(prev => ({ ...prev, question: true }));
      // 前端查询用 supabase 客户端
      const { data: questionData, error: questionErr } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (questionErr) {
        alert(`加载题目失败：${questionErr.message}`);
        return;
      }
      setQuestion(questionData as Question);

      // 前端查询用户回答也用 supabase 客户端
      const { data: answerData } = await supabase
        .from('user_answers')
        .select('content')
        .eq('question_id', questionId)
        .single();

      if (answerData) {
        setUserAnswer(answerData.content);
        setSavedUserAnswer(answerData.content);
      }

      setLoading(prev => ({ ...prev, question: false }));
    }

    fetchData();
  }, [id]);

  // 保存用户回答（调用 API 接口，前端不直接操作数据库）
  const handleSaveAnswer = async () => {
    if (!id || !userAnswer.trim()) {
      alert('请输入回答内容');
      return;
    }

    setLoading(prev => ({ ...prev, userAnswer: true }));
    try {
      const response = await fetch('/api/user-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: Number(id),
          content: userAnswer.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert('回答保存成功！');
      setSavedUserAnswer(userAnswer.trim());
    } catch (error: any) {
      alert(`保存失败：${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, userAnswer: false }));
    }
  };

  // 获取 AI 回答（调用 API 接口，前端不直接操作数据库）
  const handleGetAiAnswer = async () => {
    if (!id) return;

    setLoading(prev => ({ ...prev, aiAnswer: true }));
    setAiAnswer('AI 正在思考...');
    try {
      const response = await fetch(`/api/ai-answers/${id}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setAiAnswer(data.content);
    } catch (error: any) {
      setAiAnswer(`获取失败：${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, aiAnswer: false }));
    }
  };

  if (loading.question) return <div className="p-8">加载题目中...</div>;
  if (!question) return <div className="p-8">题目不存在</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button 
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← 返回列表
      </button>

      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold mb-4">{question.content}</h1>
        <div className="flex gap-4 text-gray-600">
          <span>类型：{question.type === 1 ? '前端' : '后端'}</span>
          <span>难度：{
            question.difficulty === 1 ? '简单' : 
            question.difficulty === 3 ? '困难' : '中等'
          }</span>
        </div>
      </div>

      {/* 用户回答区域 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">我的回答</h2>
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          rows={6}
          className="w-full p-3 border rounded-md mb-3"
          placeholder="请输入你的回答..."
        />
        <button
          onClick={handleSaveAnswer}
          disabled={loading.userAnswer || userAnswer.trim() === savedUserAnswer}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading.userAnswer ? '保存中...' : '保存回答'}
        </button>
      </div>

      {/* AI 回答区域 */}
      <div>
        <h2 className="text-xl font-semibold mb-3">AI 参考回答</h2>
        <button
          onClick={handleGetAiAnswer}
          disabled={loading.aiAnswer}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 mb-3"
        >
          {loading.aiAnswer ? '生成中...' : '获取 AI 回答'}
        </button>
        <div className="border rounded-md p-4 bg-gray-50 min-h-[100px]">
          {aiAnswer ? aiAnswer : '点击上方按钮获取 AI 回答'}
        </div>
      </div>
    </div>
  );
}
