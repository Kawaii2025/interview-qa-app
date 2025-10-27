'use client';

import { useEffect } from 'react';

export default function RelatedQuestions() {
  // 页面加载动画
  useEffect(() => {
    const cards = document.querySelectorAll('.related-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('fade-in');
      }, 200 * (index + 1));
    });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">相关题目推荐</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 相关题目卡片 1 */}
        <div className="bg-white rounded-xl card-shadow p-5 hover-lift related-card">
          <div className="flex justify-between items-start mb-3">
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">前端开发</span>
            <span className="text-xs text-gray-500">10分钟</span>
          </div>
          <h3 className="font-medium mb-2 line-clamp-2">JavaScript中的闭包是什么？它有哪些实际应用场景？</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500"><i className="fa fa-signal mr-1"></i> 中等</span>
            <button className="text-primary text-sm hover:underline">查看题目</button>
          </div>
        </div>
        
        {/* 相关题目卡片 2 */}
        <div className="bg-white rounded-xl card-shadow p-5 hover-lift related-card">
          <div className="flex justify-between items-start mb-3">
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">前端开发</span>
            <span className="text-xs text-gray-500">8分钟</span>
          </div>
          <h3 className="font-medium mb-2 line-clamp-2">请解释JavaScript中的事件冒泡和事件捕获机制，以及如何阻止事件冒泡？</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500"><i className="fa fa-signal mr-1"></i> 简单</span>
            <button className="text-primary text-sm hover:underline">查看题目</button>
          </div>
        </div>
        
        {/* 相关题目卡片 3 */}
        <div className="bg-white rounded-xl card-shadow p-5 hover-lift related-card">
          <div className="flex justify-between items-start mb-3">
            <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">后端开发</span>
            <span className="text-xs text-gray-500">15分钟</span>
          </div>
          <h3 className="font-medium mb-2 line-clamp-2">什么是RESTful API？设计RESTful API时应遵循哪些原则？</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500"><i className="fa fa-signal mr-1"></i> 中等</span>
            <button className="text-primary text-sm hover:underline">查看题目</button>
          </div>
        </div>
        
        {/* 相关题目卡片 4 */}
        <div className="bg-white rounded-xl card-shadow p-5 hover-lift related-card">
          <div className="flex justify-between items-start mb-3">
            <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">后端开发</span>
            <span className="text-xs text-gray-500">20分钟</span>
          </div>
          <h3 className="font-medium mb-2 line-clamp-2">请解释什么是数据库索引，以及它的优缺点和适用场景？</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500"><i className="fa fa-signal mr-1"></i> 较难</span>
            <button className="text-primary text-sm hover:underline">查看题目</button>
          </div>
        </div>
      </div>
    </div>
  );
}
