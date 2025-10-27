// lib/dateUtils.ts
/**
 * 统一格式化日期为 YYYY-MM-DD 格式
 * @param dateString - 原始日期字符串（如 ISO 格式）
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    // 手动拼接年月日，避免浏览器默认格式差异
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，补 0 到两位数
    const day = String(date.getDate()).padStart(2, '0'); // 日期补 0 到两位数
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('日期格式化失败:', error);
    return '未知日期'; // 异常时返回默认值
  }
}
