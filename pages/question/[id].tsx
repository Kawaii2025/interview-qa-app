import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, easeInOut } from 'framer-motion';
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
  
  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
          duration: 0.6,
          ease: easeInOut
        }
    }
  };

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

      // 使用更友好的提示方式（Toast通知）
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
      successMessage.innerHTML = `
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>回答保存成功！</span>
        </div>
      `;
      document.body.appendChild(successMessage);
      
      // 添加出现动画
      setTimeout(() => {
        successMessage.classList.add('translate-y-0');
        successMessage.classList.remove('translate-y-10');
      }, 10);
      
      // 3秒后移除
      setTimeout(() => {
        successMessage.classList.add('opacity-0');
        setTimeout(() => successMessage.remove(), 300);
      }, 3000);
      
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

  // 获取难度对应的样式类
  const getDifficultyClass = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-emerald-100 text-emerald-800';
      case 2: return 'bg-amber-100 text-amber-800';
      case 3: return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  // 获取类型对应的样式类
  const getTypeClass = (type: number) => {
    return type === 1 ? 'bg-sky-100 text-sky-800' : 'bg-violet-100 text-violet-800';
  };

  // 获取难度文本
  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return '简单';
      case 2: return '中等';
      case 3: return '困难';
      default: return '中等';
    }
  };

  // 获取类型文本
  const getTypeText = (type: number) => {
    return type === 1 ? '前端' : '后端';
  };

  // 加载中状态
  if (loading.question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-xl font-medium text-slate-700">加载题目中...</p>
        </div>
      </div>
    );
  }

  // 题目不存在
  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-card p-8 max-w-md text-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">题目不存在</h3>
          <p className="text-slate-500 mb-8">抱歉，您访问的题目不存在或已被删除</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            返回首页
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h1 className="text-xl font-bold text-primary">面试助手</h1>
            </div>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-slate-600 hover:text-primary transition-all duration-300 px-3.5 py-2 rounded-lg hover:bg-slate-100 transform hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回列表
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* 题目详情卡片 */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-card p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 leading-tight">{question.content}</h1>
            <div className="flex flex-wrap gap-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-medium ${getTypeClass(question.type)}`}>
                {getTypeText(question.type)}
              </span>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-medium ${getDifficultyClass(question.difficulty)}`}>
                {getDifficultyText(question.difficulty)}
              </span>
            </div>
          </motion.div>

          {/* 用户回答区域 */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-card p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              我的回答
            </h2>
            <div className="mb-6">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-5 h-48 focus:ring-3 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 resize-none shadow-sm hover:shadow-md"
                placeholder="请输入你的回答..."
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveAnswer}
                disabled={loading.userAnswer || userAnswer.trim() === savedUserAnswer}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${loading.userAnswer || userAnswer.trim() === savedUserAnswer ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-sm' : 'bg-sky-500 text-white hover:bg-sky-600 hover:shadow-lg active:scale-98'}`}
              >
                {loading.userAnswer ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    保存中...
                  </>
                ) : '保存回答'}
              </button>
              {userAnswer.trim() === savedUserAnswer && userAnswer.trim() && (
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  已保存
                </div>
              )}
            </div>
          </motion.div>

          {/* AI 回答区域 */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-card p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI 参考回答
            </h2>
            <div className="mb-6">
              <button
                onClick={handleGetAiAnswer}
                disabled={loading.aiAnswer}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${loading.aiAnswer ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-sm' : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg active:scale-98'}`}
              >
                {loading.aiAnswer ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    生成中...
                  </>
                ) : '获取 AI 回答'}
              </button>
            </div>
            <div className={`rounded-xl p-6 ${aiAnswer ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-200'} min-h-[250px] transition-all duration-500 shadow-sm`}>
              {aiAnswer ? (
                <div className="whitespace-pre-line text-slate-700 leading-relaxed text-balance">{aiAnswer}</div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium">点击上方按钮获取 AI 回答</p>
                  <p className="text-sm mt-2 text-slate-400 max-w-md text-center">AI 将为您提供专业的参考答案，帮助您更好地理解问题</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* 页脚 */}
      <footer className="bg-slate-900 text-white py-12 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-xl font-bold">面试助手</h2>
            </div>
            <p className="text-slate-400 mb-2">帮助你准备技术面试</p>
            <p className="text-slate-500 text-sm mt-4">© {new Date().getFullYear()} 面试助手 | 让面试准备更高效</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
