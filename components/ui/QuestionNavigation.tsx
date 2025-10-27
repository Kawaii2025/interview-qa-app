export default function QuestionNavigation() {
  return (
    <div className="flex justify-between items-center pt-4">
      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
        <i className="fa fa-angle-left"></i>
        <span>上一题</span>
      </button>
      
      <div className="hidden md:flex items-center space-x-2">
        <button className="w-8 h-8 rounded flex items-center justify-center bg-primary text-white">1</button>
        <button className="w-8 h-8 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">2</button>
        <button className="w-8 h-8 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">3</button>
        <span className="text-gray-400">...</span>
        <button className="w-8 h-8 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">12</button>
      </div>
      
      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
        <span>下一题</span>
        <i className="fa fa-angle-right"></i>
      </button>
    </div>
  );
}
