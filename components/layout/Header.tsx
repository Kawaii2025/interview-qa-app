import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase-client';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const userMenuButton = document.getElementById('userMenuButton');
      const userMenu = document.getElementById('userMenu');

      if (
        userMenuButton &&
        userMenu &&
        !userMenuButton.contains(event.target as Node) &&
        !userMenu.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      console.error('退出登录失败:', error);
      alert('退出登录失败，请重试');
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? 'shadow' : 'shadow-sm'
      }`}
      id="navbar"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <i className="fa fa-code text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-dark">面试刷题</span>
            </Link>
          </div>

          {/* 导航链接 - 桌面版 */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-primary font-medium border-b-2 border-primary py-5"
            >
              题库
            </Link>
            <Link
              href="/wrong-questions"
              className="text-gray-600 hover:text-primary transition-colors py-5"
            >
              错题集
            </Link>
            <Link
              href="/learning-path"
              className="text-gray-600 hover:text-primary transition-colors py-5"
            >
              学习路径
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-primary transition-colors py-5"
            >
              关于
            </Link>
          </nav>

          {/* 用户区域 */}
          <div className="flex items-center space-x-4">
            <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-light text-gray-600 hover:bg-gray-200 transition-colors">
              <i className="fa fa-bell-o"></i>
            </button>
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                id="userMenuButton"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <Image
                    src="https://picsum.photos/id/64/200/200"
                    alt="用户头像"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  张同学
                </span>
                <i className="fa fa-angle-down text-gray-500 hidden sm:inline"></i>
              </button>

              {/* 用户菜单 */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 ${
                  userMenuOpen ? 'block' : 'hidden'
                }`}
                id="userMenu"
              >
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-light"
                >
                  个人中心
                </Link>
                <Link
                  href="/collections"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-light"
                >
                  我的收藏
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-light"
                >
                  设置
                </Link>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-danger hover:bg-light"
                >
                  退出登录
                </button>
              </div>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden text-gray-600 focus:outline-none"
              id="mobileMenuButton"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className="fa fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      <div
        className={`md:hidden bg-white border-t ${
          mobileMenuOpen ? 'block' : 'hidden'
        }`}
        id="mobileMenu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-primary bg-primary/10"
          >
            题库
          </Link>
          <Link
            href="/wrong-questions"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/10"
          >
            错题集
          </Link>
          <Link
            href="/learning-path"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/10"
          >
            学习路径
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/10"
          >
            关于
          </Link>
        </div>
      </div>
    </header>
  );
}
