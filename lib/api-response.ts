// lib/api-response.ts
import { NextApiResponse } from 'next';

// 成功响应
export function successResponse(
  res: NextApiResponse,
  data: any,
  message = 'success'
) {
  return res.status(200).json({
    statusCode: 200,
    message,
    data,
    error: null
  });
}

// 错误响应
export function errorResponse(
  res: NextApiResponse,
  statusCode: number,
  message: string,
  error?: string
) {
  return res.status(statusCode).json({
    statusCode,
    message,
    data: null,
    error: error || message // 默认为 message
  });
}
