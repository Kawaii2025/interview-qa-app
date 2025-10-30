// components/ui/QuestionItem.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase-client';
import { formatDate } from '../../lib/dateUtils';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize'; // セキュリティが必要なら有効化
import { defaultSchema } from 'hast-util-sanitize';

// 题目类型定义（保持不变）
export interface Question {
  id: number;
  content: string;
  type: number;
  difficulty: number;
  created_at: string;
}

// AI回答表结构类型（与supabase的ai_answers表对应）
interface AiAnswer {
  id: number;
  question_id: number; // 关联的题目ID
  content: string; // AI回答内容
  created_at: string;
  updated_at: string;
}

interface QuestionItemProps {
  question: Question;
  userAnswer?: string;
  onAnswerChange?: (questionId: number, answer: string) => void;
}

// 难度和类型转换函数（保持不变）
const getDifficultyText = (level: number): string => {
  switch(level) {
    case 1: return "简单";
    case 2: return "中等";
    case 3: return "较难";
    default: return "未知";
  }
};

const getTypeText = (type: number): string => {
  switch(type) {
    case 1: return "前端开发";
    case 2: return "后端开发";
    default: return "其他类型";
  }
};

export default function QuestionItem({ 
  question, 
  userAnswer = '', 
  onAnswerChange 
}: QuestionItemProps) {
  const [activeTab, setActiveTab] = useState<'myAnswer' | 'aiAnswer'>('myAnswer');
  const [answer, setAnswer] = useState(userAnswer);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null); // null = not fetched yet
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // 同步用户回答（保持不变）
  useEffect(() => {
    setAnswer(userAnswer);
  }, [userAnswer]);

  // 获取AI回答 - 直接查询supabase的ai_answers表
  const fetchAiAnswer = async () => {
    setIsLoading(true);
    setAiError(null);
    try {
      // 查询ai_answers表，通过question_id关联当前题目
      const { data, error } = await supabase
        .from('ai_answers') // 假设表名为ai_answers
        .select('content') // 只需要content字段
        .eq('question_id', question.id) // 关联题目ID
        .single(); // 只返回一条记录（一个题目对应一个AI回答）

      // 处理supabase查询错误
      if (error) {
        // 如果是"未找到记录"的错误，不提示错误，允许用户重新生成
        if (error.code === 'PGRST116') {
          setAiAnswer(''); // not found -> mark as empty
        } else {
          throw new Error(`查询失败: ${error.message}`);
        }
      } else if (data) {
        // 成功获取到回答
        setAiAnswer(data.content);
      }
    } catch (err) {
      console.error('获取AI回答错误:', err);
      setAiError(err instanceof Error ? err.message : '获取AI回答时发生错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 重新生成AI回答（如果需要生成新回答的逻辑）
  const regenerateAiAnswer = async () => {
    setIsLoading(true);
    setAiError(null);
    // try {
    // //   const supabase = createSupabaseServerClient();
      
    //   // 调用生成AI回答的函数（可以是supabase function）
    //   const { data, error } = await supabase
    //     .rpc('generate_ai_answer', { 
    //       input_question_id: question.id,
    //       input_question_content: question.content 
    //     });

    //   if (error) throw error;
      
    //   // 生成成功后更新本地状态
    //   setAiAnswer(data.content);
      
    //   // 同时更新数据库（如果rpc函数没有自动更新的话）
    //   // await supabase
    //   //   .from('ai_answers')
    //   //   .upsert({ question_id: question.id, content: data.content })
    //   //   .eq('question_id', question.id);
      
    // } catch (err) {
    //   console.error('重新生成AI回答错误:', err);
    //   setAiError(err instanceof Error ? err.message : '生成AI回答失败');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // 切换到AI回答标签时加载回答
  useEffect(() => {
    // fetch only when tab opened and we have not fetched yet (aiAnswer === null)
    if (activeTab === 'aiAnswer' && aiAnswer === null && !isLoading) {
      fetchAiAnswer();
    }
  }, [activeTab, aiAnswer, isLoading, question.id]);

  // 其他逻辑（handleTextChange、页面加载动画等保持不变）
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswer = e.target.value;
    setAnswer(newAnswer);
    if (onAnswerChange) {
      onAnswerChange(question.id, newAnswer);
    }
  };

  useEffect(() => {
    const card = document.querySelector(`.question-card-${question.id}`);
    if (card) {
      setTimeout(() => {
        card.classList.add('fade-in');
      }, 100);
    }
  }, [question.id]);

  const answerLength = answer.length;

  const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      ['className'],
    ],
    pre: [
      ...(defaultSchema.attributes?.pre ?? []),
      ['className'],
    ],
  },
};

  return (
    <div className={`bg-white rounded-xl card-shadow p-6 md:p-8 hover-lift question-card-${question.id}`}>
      {/* 题目头部信息（保持不变） */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
            {getTypeText(question.type)}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
            {getDifficultyText(question.difficulty)}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <i className="fa fa-bookmark-o text-lg"></i>
        </button>
      </div>
      
      <h2 className="text-xl md:text-2xl font-bold mb-6">{question.content}</h2>
      
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
          <span><i className="fa fa-clock-o"></i> 建议用时: 10分钟</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span><i className="fa fa-signal"></i> 难度: {getDifficultyText(question.difficulty)}</span>
          <span className="w-1 h-1 rounded-full-full bg-gray-300"></span>
          <span><i className="fa fa-calendar"></i> 创建时间: {formatDate(question.created_at)}</span>
        </div>
      </div>
      
      {/* 标签切换（保持不变） */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button 
            className={`py-4 font-medium ${
              activeTab === 'myAnswer' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700 transition-colors'
            }`} 
            onClick={() => setActiveTab('myAnswer')}
          >
            我的回答
          </button>
          <button 
            className={`py-4 font-medium ${
              activeTab === 'aiAnswer' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700 transition-colors'
            }`} 
            onClick={() => setActiveTab('aiAnswer')}
          >
            AI回答
          </button>
        </div>
      </div>
      
      {/* 我的回答区域（保持不变） */}
      {activeTab === 'myAnswer' && (
        <div>
          <div className="mb-6">
            <textarea 
              className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all resize-none"
              placeholder="请在此输入你的答案..."
              value={answer}
              onChange={handleTextChange}
            ></textarea>
            <div className="flex justify-between mt-4">
              <div className="flex items-center space-x-2">
                <button className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                  <i className="fa fa-picture-o mr-1"></i> 上传图片
                </button>
                <span className="text-gray-300">|</span>
                <button className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                  <i className="fa fa-code mr-1"></i> 代码块
                </button>
              </div>
              <span className={`text-sm ${answerLength > 1000 ? 'text-danger' : 'text-gray-500'}`}>
                {answerLength}/1000字
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              查看参考答案
            </button>
            <div className="flex space-x-3">
              <button className="px-5 py-2 border border-primary-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                保存草稿
              </button>
              <button className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow">
                提交答案
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* AI回答区域（使用supabase直接直接查询） */}
      {activeTab === 'aiAnswer' && (
        <div>
          <div className="bg-light rounded-lg p-5 mb-6 leading-relaxed space-y-4">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <i className="fa fa-robot text-primary"></i>
              </div>
              <div>
                <h3 className="font-medium">AI 助手</h3>
                <p className="text-sm text-gray-500">基于你的问题生成的参考回答</p>
              </div>
            </div>
            
            {/* AI回答回答内容 */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-500">正在获取AI回答...</span>
              </div>
            ) : aiError ? (
              <div className="p-4 bg-danger/10 text-danger text-sm">
                <i className="fa fa-exclamation-circle mr-1"></i> {aiError}
              </div>
            ) : aiAnswer === '' ? (
               <div className="p-4 bg-gray-50 text-gray-500 rounded-lg text-sm">
                 <i className="fa fa-info-circle-circle mr-1"></i> 暂无找到找到该题的AI回答，请点击"重新生成"
               </div>
            ) : (
              <div className="prose max-w-none text-gray-700 space-y-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[[rehypeSanitize, sanitizeSchema], rehypeHighlight]}
                >
                  {aiAnswer}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <button 
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={aiAnswer ? regenerateAiAnswer : fetchAiAnswer}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa fa-spinner fa-spin mr-1"></i> 处理中...
                </>
              ) : aiAnswer ? (
                <>
                  <i className="fa fa-refresh mr-1"></i> 重新生成
                </>
              ) : (
                <>
                  <i className="fa fa-magic mr-1"></i> 生成回答
                </>
              )}
            </button>
            <button 
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow"
              onClick={() => {
                if (aiAnswer) {
                  navigator.clipboard.writeText(aiAnswer);
                  // 可以添加复制成功提示
                }
              }}
              disabled={!aiAnswer}
            >
              <i className="fa fa-copy mr-1"></i> 复制回答
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
