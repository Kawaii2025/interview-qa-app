// pages/index.tsx
import { GetServerSideProps } from 'next';
import { supabase } from '../lib/supabase-client';
import { formatDate } from '../lib/dateUtils';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CategoryCard from '../components/ui/CategoryCard';
import ProgressCard from '../components/ui/ProgressCard';
import QuestionList from '../components/ui/QuestionList';
import RelatedQuestions from '../components/ui/RelatedQuestions';
import QuestionNavigation from '../components/ui/QuestionNavigation';
import { Question } from '../components/ui/QuestionItem'; // 引入更新后的Question接口

interface HomePageProps {
  questions: Array<Question & { formattedCreatedAt: string }>;
  userAnswers: Record<number, string>;
  error?: string;
}

export default function Home({ questions, userAnswers, error }: HomePageProps) {
  // 页面渲染部分保持不变
  return (
    <>
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-dark mb-2">面试题练习</h1>
          <p className="text-gray-500">提升你的编程技能，轻松应对面试挑战</p>
          
          {error && (
            <div className="mt-4 p-3 bg-danger/10 text-danger rounded-lg text-sm">
              <i className="fa fa-exclamation-circle mr-1"></i> {error}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <CategoryCard />
            <ProgressCard />
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <QuestionList questions={questions} userAnswers={userAnswers} />
            <RelatedQuestions />
            <QuestionNavigation />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // 创建Supabase服务端客户端
    // const supabase = createSupabaseServerClient();
    
    // 1. 获取当前用户信息
    const { data: { user } } = await supabase.auth.getUser();
    
    // 2. 获取题目列表（根据实际字段调整查询）
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions') // 假设表名为questions
      .select('*')
      .order('created_at', { ascending: false }); // 按创建时间倒序排列
      
    if (questionsError) throw questionsError;

     // 预格式化日期（服务端统一处理）
    const questions = (questionsData || []).map(question => ({
      ...question,
      formattedCreatedAt: formatDate(question.created_at) // 服务端预格式化
    }));
    
    // 3. 获取用户回答
    let userAnswers: Record<number, string> = {};
    if (user) {
      const { data: answersData, error: answersError } = await supabase
        .from('user_answers') // 假设用户回答表名为user_answers
        .select('question_id, answer')
        .eq('user_id', user.id);
        
      if (answersError) throw answersError;
      
      // 转换为 { questionId: answer } 格式
      if (answersData && answersData.length > 0) {
        userAnswers = answersData.reduce((acc, item) => {
          acc[item.question_id] = item.answer;
          return acc;
        }, {} as Record<number, string>);
      }
    }
    
    return {
      props: {
        questions,
        userAnswers,
      },
    };
  } catch (error) {
    console.error('获取数据失败:', error);
    return {
      props: {
        questions: [],
        userAnswers: {},
        error: error instanceof Error ? error.message : '获取数据时发生错误',
      },
    };
  }
};
