// 与 boss_ai SQLite 数据库 schema 对应的 TypeScript 类型

export interface JobItem {
  id: number;
  title: string;
  companyRaw: string;
  companyShort: string | null;
  salaryRaw: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryMonths: number;
  experienceRaw: string | null;
  experienceYearsMin: number | null;
  education: string | null;
  city: string;
  location: string | null;
  techStack: string[];
  keyword: string;
  scrapedAt: string;
}

export interface JobDetail extends JobItem {
  description: string | null;
  highlights: string | null;
  address: string | null;
  url: string;
}

export interface JobStats {
  totalJobs: number;
  totalCities: number;
  avgSalary: number | null;
  medianSalary: number | null;
  topCity: string;
  topTech: string;
  latestScrapedAt: string | null;
}

export interface SalaryBucket {
  rangeLabel: string;
  min: number;
  max: number | null; // null for "above" bucket
  count: number;
}

export interface TechRank {
  name: string;
  count: number;
  percentage: number;
}

export interface CityStat {
  city: string;
  count: number;
  avgSalary: number | null;
}

export interface EducationStat {
  education: string;
  count: number;
  percentage: number;
}

export interface ExperienceStat {
  experienceYears: number;
  avgSalary: number | null;
  count: number;
}

export interface JobFilters {
  city?: string;
  keyword?: string;
  tech?: string;
  salaryMin?: number;
  salaryMax?: number;
  education?: string;
  experienceMin?: number;
  page?: number;
  pageSize?: number;
}

export interface FilterOptions {
  cities: string[];
  keywords: string[];
}
