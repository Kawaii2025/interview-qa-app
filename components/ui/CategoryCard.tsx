export default function CategoryCard() {
  return (
    <div className="bg-white rounded-xl card-shadow p-6">
      <h2 className="text-lg font-semibold mb-4">题目分类</h2>
      <div className="space-y-1">
        <button className="w-full text-left px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium flex justify-between items-center">
          <span>全部题目</span>
          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">120</span>
        </button>
        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center">
          <span>前端开发</span>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">58</span>
        </button>
        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center">
          <span>后端开发</span>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">62</span>
        </button>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-3">前端细分</h3>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600">HTML/CSS</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600">JavaScript</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600">框架应用</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600">性能优化</button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-3">后端细分</h3>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600">算法与数据结构</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600">数据库</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600">服务器</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600">系统设计</button>
        </div>
      </div>
    </div>
  );
}
