/** @type {import('tailwindcss').Config} */
module.exports = {
  // 扫描所有使用 Tailwind 类的文件（Page Router 路径）
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",    // 页面文件
    "./components/**/*.{js,jsx,ts,tsx}", // 组件文件
    "./layouts/**/*.{js,jsx,ts,tsx}",  // 若有布局文件也需添加
  ],
  theme: {
    extend: {
      colors: {
        primary: '#165DFF',
        secondary: '#36CFC9',
        dark: '#1D2129',
        light: '#F2F3F5',
        success: '#52C41A',
        warning: '#FAAD14',
        danger: '#FF4D4F',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [], // Tailwind 3 插件（如需要可添加）
}
