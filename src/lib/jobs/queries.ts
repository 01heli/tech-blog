/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDb } from './db';
import { cleanDescription } from './format';
import type {
  JobItem,
  JobDetail,
  JobStats,
  JobFilters,
  SalaryBucket,
  TechRank,
  CityStat,
  EducationStat,
  ExperienceStat,
  FilterOptions,
} from '@/types/job';

// ═══════════════════════════════════════════════════════════════
// 岗位列表（分页 + 多条件筛选）
// ═══════════════════════════════════════════════════════════════

export function getJobs(filters: JobFilters = {}): {
  items: JobItem[];
  total: number;
} {
  const db = getDb();
  const {
    city,
    keyword,
    tech,
    salaryMin,
    salaryMax,
    education,
    experienceMin,
    page = 1,
    pageSize = 20,
  } = filters;

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (city) {
    conditions.push('r.city = ?');
    params.push(city);
  }
  if (keyword) {
    conditions.push('r.keyword = ?');
    params.push(keyword);
  }
  if (tech) {
    conditions.push('c.tech_stack LIKE ?');
    params.push(`%${tech}%`);
  }
  if (salaryMin != null) {
    conditions.push('c.salary_max >= ?');
    params.push(salaryMin);
  }
  if (salaryMax != null) {
    conditions.push('c.salary_min <= ?');
    params.push(salaryMax);
  }
  if (education) {
    conditions.push('(c.education = ? OR c.education = \'不限\')');
    params.push(education);
  }
  if (experienceMin != null && experienceMin > 0) {
    conditions.push('(c.experience_years_min <= ? OR c.experience_years_min IS NULL OR c.experience_years_min = 0)');
    params.push(experienceMin);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * pageSize;

  // Count total
  const countRow = db
    .prepare(
      `SELECT COUNT(*) as cnt FROM raw_jobs r
       JOIN cleaned_jobs c ON c.raw_id = r.id
       ${where}`
    )
    .get(...params) as { cnt: number };

  // Fetch items
  const rows = db
    .prepare(
      `SELECT r.id, r.title, r.company_raw, r.salary_raw, r.experience_raw,
              r.education_raw, r.city, r.keyword, r.scraped_at,
              c.salary_min, c.salary_max, c.salary_months,
              c.experience_years_min, c.education, c.location,
              c.company_short, c.tech_stack
       FROM raw_jobs r
       JOIN cleaned_jobs c ON c.raw_id = r.id
       ${where}
       ORDER BY r.scraped_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(...params, pageSize, offset) as any[];

  const items: JobItem[] = rows.map(mapJobItem);

  return { items, total: countRow.cnt };
}

// ═══════════════════════════════════════════════════════════════
// 岗位详情
// ═══════════════════════════════════════════════════════════════

export function getJobById(id: number): JobDetail | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT r.*, c.salary_min, c.salary_max, c.salary_months,
              c.experience_years_min, c.education, c.location,
              c.company_short, c.tech_stack
       FROM raw_jobs r
       JOIN cleaned_jobs c ON c.raw_id = r.id
       WHERE r.id = ?`
    )
    .get(id) as any;

  if (!row) return null;
  return mapJobDetail(row);
}

// ═══════════════════════════════════════════════════════════════
// 概览统计
// ═══════════════════════════════════════════════════════════════

export function getStats(): JobStats {
  const db = getDb();

  const totalJobs = (
    db.prepare('SELECT COUNT(*) as cnt FROM raw_jobs').get() as any
  ).cnt;

  const totalCities = (
    db
      .prepare('SELECT COUNT(DISTINCT city) as cnt FROM raw_jobs')
      .get() as any
  ).cnt;

  const avgRow = db
    .prepare(
      `SELECT AVG((c.salary_min + c.salary_max) / 2.0) as avg_salary
       FROM cleaned_jobs c
       WHERE c.salary_min IS NOT NULL AND c.salary_max IS NOT NULL`
    )
    .get() as any;

  // median via ordered rows
  const medianRow = db
    .prepare(
      `SELECT (c.salary_min + c.salary_max) / 2.0 as mid
       FROM cleaned_jobs c
       WHERE c.salary_min IS NOT NULL AND c.salary_max IS NOT NULL
       ORDER BY mid`
    )
    .all() as any[];
  let medianSalary: number | null = null;
  if (medianRow.length > 0) {
    const mid = Math.floor(medianRow.length / 2);
    medianSalary = medianRow[mid].mid;
  }

  const topCityRow = db
    .prepare(
      `SELECT city, COUNT(*) as cnt FROM raw_jobs GROUP BY city ORDER BY cnt DESC LIMIT 1`
    )
    .get() as any;

  const topTechRow = db
    .prepare(
      `SELECT tech_stack FROM cleaned_jobs WHERE tech_stack IS NOT NULL`
    )
    .all() as any[];

  const techCounts = new Map<string, number>();
  for (const r of topTechRow) {
    try {
      const arr = JSON.parse(r.tech_stack);
      for (const t of arr) {
        techCounts.set(t, (techCounts.get(t) || 0) + 1);
      }
    } catch { /* skip malformed JSON */ }
  }
  const topTech =
    [...techCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  const latestRow = db
    .prepare('SELECT MAX(scraped_at) as latest FROM raw_jobs')
    .get() as any;

  return {
    totalJobs,
    totalCities,
    avgSalary: avgRow?.avg_salary
      ? Math.round(avgRow.avg_salary * 10) / 10
      : null,
    medianSalary: medianSalary
      ? Math.round(medianSalary * 10) / 10
      : null,
    topCity: topCityRow?.city || '',
    topTech,
    latestScrapedAt: latestRow?.latest || null,
  };
}

// ═══════════════════════════════════════════════════════════════
// 薪资分布
// ═══════════════════════════════════════════════════════════════

export function getSalaryDistribution(
  bucketSize: number = 5
): SalaryBucket[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT (c.salary_min + c.salary_max) / 2.0 as mid
       FROM cleaned_jobs c
       WHERE c.salary_min IS NOT NULL AND c.salary_max IS NOT NULL`
    )
    .all() as { mid: number }[];

  const buckets = new Map<number, number>();
  for (const { mid } of rows) {
    const bucket = Math.floor(mid / bucketSize) * bucketSize;
    buckets.set(bucket, (buckets.get(bucket) || 0) + 1);
  }

  const result: SalaryBucket[] = [];
  const sortedKeys = [...buckets.keys()].sort((a, b) => a - b);
  for (const k of sortedKeys) {
    result.push({
      rangeLabel: `${k}-${k + bucketSize}k`,
      min: k,
      max: k + bucketSize,
      count: buckets.get(k)!,
    });
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════
// 技术栈排名
// ═══════════════════════════════════════════════════════════════

export function getTechRanking(limit: number = 15): TechRank[] {
  const db = getDb();
  const rows = db
    .prepare('SELECT tech_stack FROM cleaned_jobs WHERE tech_stack IS NOT NULL')
    .all() as { tech_stack: string }[];

  const counts = new Map<string, number>();
  let totalMentions = 0;
  for (const r of rows) {
    try {
      const arr = JSON.parse(r.tech_stack);
      for (const t of arr) {
        counts.set(t, (counts.get(t) || 0) + 1);
        totalMentions++;
      }
    } catch { /* skip */ }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalMentions > 0
        ? Math.round((count / totalMentions) * 1000) / 10
        : 0,
    }));
}

// ═══════════════════════════════════════════════════════════════
// 城市统计
// ═══════════════════════════════════════════════════════════════

export function getCityStats(): CityStat[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT r.city, COUNT(*) as cnt,
              AVG((c.salary_min + c.salary_max) / 2.0) as avg_salary
       FROM raw_jobs r
       JOIN cleaned_jobs c ON c.raw_id = r.id
       WHERE c.salary_min IS NOT NULL
       GROUP BY r.city
       ORDER BY cnt DESC`
    )
    .all() as any[];

  return rows.map((r) => ({
    city: r.city,
    count: r.cnt,
    avgSalary: r.avg_salary ? Math.round(r.avg_salary * 10) / 10 : null,
  }));
}

// ═══════════════════════════════════════════════════════════════
// 学历分布
// ═══════════════════════════════════════════════════════════════

export function getEducationDistribution(): EducationStat[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT c.education, COUNT(*) as cnt
       FROM cleaned_jobs c
       GROUP BY c.education
       ORDER BY cnt DESC`
    )
    .all() as any[];

  const total = rows.reduce((sum, r) => sum + r.cnt, 0);
  return rows.map((r) => ({
    education: r.education || '未知',
    count: r.cnt,
    percentage: total > 0 ? Math.round((r.cnt / total) * 1000) / 10 : 0,
  }));
}

// ═══════════════════════════════════════════════════════════════
// 经验 vs 薪资
// ═══════════════════════════════════════════════════════════════

export function getExperienceVsSalary(): ExperienceStat[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT c.experience_years_min,
              AVG((c.salary_min + c.salary_max) / 2.0) as avg_salary,
              COUNT(*) as cnt
       FROM cleaned_jobs c
       WHERE c.salary_min IS NOT NULL AND c.experience_years_min IS NOT NULL
       GROUP BY c.experience_years_min
       ORDER BY c.experience_years_min`
    )
    .all() as any[];

  return rows.map((r) => ({
    experienceYears: r.experience_years_min,
    avgSalary: r.avg_salary ? Math.round(r.avg_salary * 10) / 10 : null,
    count: r.cnt,
  }));
}

// ═══════════════════════════════════════════════════════════════
// 筛选选项
// ═══════════════════════════════════════════════════════════════

export function getFilterOptions(): FilterOptions {
  const db = getDb();

  const cityRows = db
    .prepare('SELECT DISTINCT city FROM raw_jobs ORDER BY city')
    .all() as { city: string }[];

  const keywordRows = db
    .prepare('SELECT DISTINCT keyword FROM raw_jobs ORDER BY keyword')
    .all() as { keyword: string }[];

  return {
    cities: cityRows.map((r) => r.city),
    keywords: keywordRows.map((r) => r.keyword),
  };
}

// ═══════════════════════════════════════════════════════════════
// 内部映射函数
// ═══════════════════════════════════════════════════════════════

function parseTechStack(raw: string | null): string[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function mapJobItem(row: any): JobItem {
  return {
    id: row.id,
    title: row.title || '',
    companyRaw: row.company_raw || '',
    companyShort: row.company_short || null,
    salaryRaw: row.salary_raw || null,
    salaryMin: row.salary_min ?? null,
    salaryMax: row.salary_max ?? null,
    salaryMonths: row.salary_months ?? 12,
    experienceRaw: row.experience_raw || null,
    experienceYearsMin: row.experience_years_min ?? null,
    education: row.education || null,
    city: row.city || '',
    location: row.location || null,
    techStack: parseTechStack(row.tech_stack),
    keyword: row.keyword || '',
    scrapedAt: row.scraped_at || '',
  };
}

function mapJobDetail(row: any): JobDetail {
  return {
    ...mapJobItem(row),
    description: cleanDescription(row.description),
    highlights: row.highlights || null,
    address: row.address || null,
    url: row.url || '',
  };
}
