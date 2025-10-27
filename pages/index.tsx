import { useEffect, useState } from 'react';
import Link from 'next/link';
// 前端组件只能用 supabase（不带 Server 后缀）
import { supabase } from '@/lib/supabase-client';

type Question = {
  id: number;
  content: string;
  type: number;
  difficulty: number;
  created_at: string;
};

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      // 前端查询必须用 supabase 客户端
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        alert(`加载失败：${error.message}`);
      } else {
        setQuestions(data as Question[]);
      }
      setLoading(false);
    }

    fetchQuestions();
  }, []);

  // 类型和难度转换函数（不变）
  const getTypeText = (type: number) => type === 1 ? '前端' : '后端';
  const getDifficultyText = (diff: number) => {
    const map = { 1: '简单', 2: '中等', 3: '困难' };
    return map[diff as keyof typeof map] || '中等';
  };

  if (loading) return <div className="p-8">加载题目中...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">面试题列表</h1>
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">{q.content}</h3>
            <div className="flex gap-4 text-sm text-gray-600 mb-4">
              <span>类型：{getTypeText(q.type)}</span>
              <span>难度：{getDifficultyText(q.difficulty)}</span>
            </div>
            <Link href={`/question/${q.id}`} className="text-blue-600 hover:underline">
              查看详情 →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
