// components/ui/QuestionList.tsx
import QuestionItem from './QuestionItem';
import { Question } from './QuestionItem'; // 直接使用更新后的Question接口

interface QuestionListProps {
  questions: Question[];
  userAnswers?: Record<number, string>; // 记录每个题目的用户回答
}

export default function QuestionList({ questions, userAnswers = {} }: QuestionListProps) {
  // 处理回答变化的回调
  const handleAnswerChange = (questionId: number, answer: string) => {
    console.log(`Question ${questionId} answer updated`, answer);
    // 这里可以添加保存到API的逻辑
  };

  return (
    <div className="space-y-6">
      {questions.length > 0 ? (
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
