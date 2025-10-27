// API 接口相关函数
import axios from 'axios';

// 定义Question类型
export type Question = {
  id: string;
  content: string;
  type: string | number;
  difficulty: number;
  duration?: number;
  views?: number;
};

// API 基础 URL
const API_BASE_URL = '/api';

/**
 * 获取问题列表
 */
export async function getQuestions(): Promise<Question[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/questions`);
    // 确保response.data存在且包含content数组
    const questionsData = Array.isArray(response.data?.content) ? response.data.content : [];
    // 添加一些模拟数据以丰富展示
    return questionsData.map((q: any) => ({
      ...q,
      id: String(q.id), // 确保 ID 是字符串类型
      type: q.type === 1 ? 'frontend' : 'backend', // 将数字类型转为字符串类型
      duration: Math.floor(Math.random() * 20) + 5, // 5-25分钟
      views: Math.floor(Math.random() * 2000) + 100, // 100-2100次浏览
    }));
  } catch (error) {
    console.error('获取问题列表失败:', error);
    // 返回一些模拟数据以便演示
    return generateMockQuestions();
  }
}

/**
 * 根据 ID 获取单个问题详情
 */
export async function getQuestionById(id: string): Promise<Question | null> {
  try {
    const response = await axios.get(`${API_BASE_URL}/questions/${id}`);
    const question = response.data;
    return {
      ...question,
      id: String(question.id),
      type: question.type === 1 ? 'frontend' : 'backend',
      duration: Math.floor(Math.random() * 20) + 5,
      views: Math.floor(Math.random() * 2000) + 100,
    };
  } catch (error) {
    console.error(`获取问题 ${id} 详情失败:`, error);
    return null;
  }
}

/**
 * 生成模拟问题数据
 */
function generateMockQuestions(): Question[] {
  return [
    {
      id: '1',
      content: '请解释 React Hooks 的原理及其使用场景',
      type: 'frontend',
      difficulty: 2,
      duration: 15,
      views: 1280,
    },
    {
      id: '2',
      content: '什么是 RESTful API？请设计一个符合 RESTful 规范的 API',
      type: 'backend',
      difficulty: 2,
      duration: 20,
      views: 892,
    },
    {
      id: '3',
      content: '请实现一个简单的防抖和节流函数',
      type: 'frontend',
      difficulty: 1,
      duration: 10,
      views: 1567,
    },
    {
      id: '4',
      content: '数据库索引的作用是什么？如何优化索引性能？',
      type: 'database',
      difficulty: 2,
      duration: 15,
      views: 1120,
    },
    {
      id: '5',
      content: '请实现快速排序算法，并分析其时间复杂度',
      type: 'algorithm',
      difficulty: 3,
      duration: 25,
      views: 1890,
    },
    {
      id: '6',
      content: '什么是闭包？闭包在 JavaScript 中的应用场景有哪些？',
      type: 'frontend',
      difficulty: 1,
      duration: 15,
      views: 2045,
    },
    {
      id: '7',
      content: '请解释 TCP/IP 协议的三次握手和四次挥手过程',
      type: 'system',
      difficulty: 2,
      duration: 20,
      views: 1340,
    },
    {
      id: '8',
      content: 'React 中 Virtual DOM 的工作原理是什么？',
      type: 'frontend',
      difficulty: 2,
      duration: 15,
      views: 1678,
    },
    {
      id: '9',
      content: '如何设计一个高可用的分布式系统？',
      type: 'backend',
      difficulty: 3,
      duration: 30,
      views: 987,
    },
    {
      id: '10',
      content: '请解释 HTTP/2 的主要特性和优势',
      type: 'frontend',
      difficulty: 1,
      duration: 15,
      views: 1430,
    },
  ];
}
