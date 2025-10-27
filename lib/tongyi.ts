// lib/tongyi.ts
import axios from 'axios';

// 从环境变量获取配置
const TONGYI_API_KEY = process.env.TONGYI_API_KEY;
const TONGYI_BASE_URL = process.env.TONGYI_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1';

if (!TONGYI_API_KEY) {
  throw new Error('请在 .env.local 中配置 TONGYI_API_KEY');
}

// 创建兼容模式的请求实例
const tongyiClient = axios.create({
  baseURL: TONGYI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TONGYI_API_KEY}` // 兼容模式用 Bearer Token 验证
  }
});

// 调用通义千问兼容模式 API（格式和 OpenAI 一致）
export async function callTongyi(prompt: string) {
  try {
    const response = await tongyiClient.post('/chat/completions', {
      model: 'qwen-plus', // 模型名称，可替换为 qwen-turbo 等
      messages: [
        { role: 'user', content: prompt } // 兼容 OpenAI 的 messages 格式
      ],
      temperature: 0.7, // 回答灵活度，0-1 之间
      max_tokens: 2000 // 最大生成字数，根据需求调整
    });

    // 兼容模式返回格式和 OpenAI 一致，直接提取 content
    const aiContent = response.data.choices[0].message.content.trim();
    return aiContent;
  } catch (error: any) {
    // 捕获错误信息（兼容模式错误响应也和 OpenAI 类似）
    const errorMsg = error.response?.data?.error?.message || error.message;
    throw new Error(`通义千问调用失败：${errorMsg}`);
  }
}
