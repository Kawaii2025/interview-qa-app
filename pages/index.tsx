import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../components/layout/Header').then(mod => mod.default), {
  ssr: false,
  loading: () => <header className="h-16 bg-white shadow-sm" />,
});
import Footer from '../components/layout/Footer';
import CategoryCard from '../components/ui/CategoryCard';
import ProgressCard from '../components/ui/ProgressCard';
import QuestionCard from '../components/ui/QuestionCard';
import RelatedQuestions from '../components/ui/RelatedQuestions';
import QuestionNavigation from '../components/ui/QuestionNavigation';

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-dark mb-2">面试题练习</h1>
          <p className="text-gray-500">提升你的编程技能，轻松应对面试挑战</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧边栏 - 分类和进度 */}
          <div className="lg:col-span-1 space-y-6">
            <CategoryCard />
            <ProgressCard />
          </div>
          
          {/* 右侧主内容 - 题目和回答区域 */}
          <div className="lg:col-span-3 space-y-6">
            <QuestionCard />
            <RelatedQuestions />
            <QuestionNavigation />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       {/* 新增一个红色块，方便观察是否生效 */}
//       <div className="bg-red-500 w-20 h-20"></div>
//     </div>
//   );
// }
