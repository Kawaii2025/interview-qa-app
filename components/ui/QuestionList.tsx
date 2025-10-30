// components/ui/QuestionList.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import QuestionItem from './QuestionItem';
import { Question } from './QuestionItem'; // 直接使用更新后的Question接口
import { formatDate } from '@/lib/dateUtils';

type QuestionWithFormatted = Question & { formattedCreatedAt?: string };
interface QuestionListProps {
  userAnswers?: Record<number, string>;
}

export default function QuestionList({ userAnswers = {} }: QuestionListProps) {
  const [questions, setQuestions] = useState<QuestionWithFormatted[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .order('id', { ascending: true });

        if (questionsError) throw questionsError;

        const mapped = (questionsData || []).map((q: any) => ({
          ...q,
          formattedCreatedAt: formatDate(q.created_at),
        })) as QuestionWithFormatted[];

        if (mounted) setQuestions(mapped);
      } catch (err: any) {
        if (mounted) setError(err?.message ?? '获取题目失败');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, []);

  
  // 处理回答变化的回调
  const handleAnswerChange = (questionId: number, answer: string) => {
    console.log(`Question ${questionId} answer updated`, answer);
    // 这里可以添加保存到API的逻辑
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="bg-white rounded-xl card-shadow p-8 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            <span className="text-gray-600">加载题目中...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-6">
          <p className="font-medium mb-2">加载失败</p>
          <p className="text-sm">{error}</p>
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg"
              onClick={() => {
                // 简单的重试逻辑：清空并触发 useEffect reload（通过重新调用 load via location.reload 或自定义方案）
                // 这里用 location.reload 以保持实现最小化
                location.reload();
              }}
            >
              重试
            </button>
          </div>
        </div>
      ) : questions && questions.length > 0 ? (
        questions.map(question => (
          <QuestionItem
            key={question.id}
            question={question}
            userAnswer={userAnswers[question.id]}
            onAnswerChange={handleAnswerChange}
          />
        ))
      ) : (
        <div className="bg-white rounded-xl card-shadow p-8 text-center">
          <p className="text-gray-500">没有找到题目，请稍后再试</p>
        </div>
      )}
    </div>
  );
}
