'use client';

import { useState, useEffect } from 'react';

export default function QuestionCard() {
  const [activeTab, setActiveTab] = useState('myAnswer');
  const [answerLength, setAnswerLength] = useState(0);

  // 监听文本框输入
  const handleTextChange = (e: { target: { value: string | any[]; }; }) => {
    setAnswerLength(e.target.value.length);
  };

  // 页面加载动画
  useEffect(() => {
    const card = document.querySelector('.question-card');
    if (card) {
      setTimeout(() => {
        card.classList.add('fade-in');
      }, 100);
    }
  }, []);

  return (
    <div className="bg-white rounded-xl card-shadow p-6 md:p-8 hover-lift question-card">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">前端开发</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">JavaScript</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <i className="fa fa-bookmark-o text-lg"></i>
        </button>
      </div>
      
      <h2 className="text-xl md:text-2xl font-bold mb-6">请解释JavaScript中的原型链是什么，以及它如何影响继承？</h2>
      
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
          <span><i className="fa fa-clock-o"></i> 建议用时: 10分钟</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span><i className="fa fa-signal"></i> 难度: 中等</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span><i className="fa fa-eye"></i> 1245人浏览</span>
        </div>
      </div>
      
      {/* 回答区域切换 */}
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
      
      {/* 我的回答区域 */}
      {activeTab === 'myAnswer' && (
        <div>
          <div className="mb-6">
            <textarea 
              className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
              placeholder="请在此输入你的答案..."
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
              <button className="px-5 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                保存草稿
              </button>
              <button className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow">
                提交答案
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* AI回答区域 */}
      {activeTab === 'aiAnswer' && (
        <div>
          <div className="bg-light rounded-lg p-5 mb-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <i className="fa fa-robot text-primary"></i>
              </div>
              <div>
                <h3 className="font-medium">AI 助手</h3>
                <p className="text-sm text-gray-500">基于你的问题生成的参考回答</p>
              </div>
            </div>
            
            {/* AI回答内容 */}
            <div className="prose max-w-none text-gray-700">
              <p className="mb-3">在JavaScript中，原型链（Prototype Chain）是实现继承的核心机制。每个对象都有一个原型对象，对象可以通过原型链访问其原型的属性和方法。</p>
              
              <p className="mb-3">当访问一个对象的属性或方法时，JavaScript引擎会首先在该对象自身查找，如果找不到，则会沿着原型链向上查找，直到找到该属性或方法，或者到达原型链的终点（null）。</p>
              
              <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto my-4">
                <code>
                    {`// 示例
                    function Person(name) {
                    this.name = name;
                    }

                    Person.prototype.sayHello = function() {
                    console.log(\`Hello, \${this.name}\`);
                    };

                    const person = new Person("John");
                    person.sayHello(); // 输出 "Hello, John"`}
                    </code>
                </pre>
              <p>在这个例子中，person对象本身没有sayHello方法，但它的原型（Person.prototype）有，因此可以通过原型链访问到该方法。</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <i className="fa fa-refresh mr-1"></i> 重新生成
            </button>
            <button className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow">
              <i className="fa fa-copy mr-1"></i> 复制回答
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
