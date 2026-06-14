/** 格式化薪资范围 */
export function formatSalary(
  min: number | null,
  max: number | null,
  months: number = 12
): string {
  if (min == null && max == null) return '薪资面议';

  const minStr = min != null ? `${min}k` : '?k';
  const maxStr = max != null ? `${max}k` : '?k';
  const monthsStr = months !== 12 ? `·${months}薪` : '';

  return `${minStr}-${maxStr}${monthsStr}`;
}

/** 格式化学历要求 */
export function formatEducation(edu: string | null): string {
  if (!edu || edu === '不限') return '学历不限';
  return edu;
}

/** 格式化经验要求 */
export function formatExperience(
  years: number | null,
  raw: string | null
): string {
  if (raw) return raw;
  if (years == null || years === 0) return '经验不限';
  return `${years}年以上`;
}

/** 格式化日期字符串 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '未知';
  // boss_ai 的日期格式为 "2026-06-05 23:30:00" 或 ISO 8601
  return dateStr.replace('T', ' ').slice(0, 16);
}

/**
 * 清洗职位描述中的 BOSS直聘 页面页脚垃圾。
 *
 * BOSS直聘的职位描述末尾经常夹带两类页脚内容：
 * 1. 认证资质块 —— 以 "\n认证资质" 开头，包含许可证说明和猎头信息
 *    （影响约 35 条猎头发布的岗位）
 * 2. 公司列表垃圾 —— 以 "\n华为腾讯" 开头，包含"热门公司"和相关搜索
 *    （影响 ID 1-47 约 47 条早期爬取的岗位）
 *
 * 这两类内容都位于描述末尾，直接截断即可。
 */
export function cleanDescription(raw: string | null): string | null {
  if (!raw) return raw;

  let text = raw;

  // 1. 截断 "\n认证资质" 及之后的所有内容（猎头认证资质块）
  const certIdx = text.indexOf('\n认证资质');
  if (certIdx !== -1) {
    text = text.slice(0, certIdx);
  }

  // 2. 截断 "\n华为腾讯" 及之后的所有内容（热门公司列表 + 页面导航）
  const spamIdx = text.indexOf('\n华为腾讯');
  if (spamIdx !== -1) {
    text = text.slice(0, spamIdx);
  }

  // 3. 去掉末尾多余空行
  return text.trimEnd() || null;
}
