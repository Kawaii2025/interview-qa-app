import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <i className="fa fa-code text-white text-sm"></i>
              </div>
              <span className="text-lg font-bold text-dark">面试刷题</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">帮助开发者提升面试技能，轻松应对求职挑战</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><i className="fa fa-github"></i></Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><i className="fa fa-twitter"></i></Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><i className="fa fa-linkedin"></i></Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">资源</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-500 hover:text-primary transition-colors">题库</Link></li>
              <li><Link href="/learning-path" className="text-gray-500 hover:text-primary transition-colors">学习路径</Link></li>
              <li><Link href="/interview-experience" className="text-gray-500 hover:text-primary transition-colors">面试经验</Link></li>
              <li><Link href="/salary-guide" className="text-gray-500 hover:text-primary transition-colors">薪资指南</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">公司</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-500 hover:text-primary transition-colors">关于我们</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-primary transition-colors">联系我们</Link></li>
              <li><Link href="/join-us" className="text-gray-500 hover:text-primary transition-colors">加入我们</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-primary transition-colors">隐私政策</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">订阅更新</h3>
            <p className="text-gray-500 text-sm mb-4">获取最新的面试题和技术资讯</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="你的邮箱地址" 
                className="px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-full text-sm"
              />
              <button className="bg-primary text-white px-4 rounded-r-lg hover:bg-primary/90 transition-colors">
                <i className="fa fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2023 面试刷题平台. 保留所有权利.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-primary transition-colors">服务条款</Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary transition-colors">隐私政策</Link>
            <Link href="/cookie" className="text-sm text-gray-500 hover:text-primary transition-colors">Cookie 政策</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
