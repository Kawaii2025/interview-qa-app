export default function ProgressCard() {
  return (
    <div className="bg-white rounded-xl card-shadow p-6">
      <h2 className="text-lg font-semibold mb-4">学习进度</h2>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">整体进度</span>
            <span className="text-sm text-primary font-medium">32%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full progress-bar" style={{ width: '32%' }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">前端题目</span>
            <span className="text-sm text-primary font-medium">45%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full progress-bar" style={{ width: '45%' }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">后端题目</span>
            <span className="text-sm text-primary font-medium">18%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-warning rounded-full progress-bar" style={{ width: '18%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
