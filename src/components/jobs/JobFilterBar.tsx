'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

interface FilterOptions {
  cities: string[];
  keywords: string[];
}

interface Props {
  options: FilterOptions;
}

export function JobFilterBar({ options }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get('city') || '');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [tech, setTech] = useState(searchParams.get('tech') || '');
  const [salaryMin, setSalaryMin] = useState(searchParams.get('salaryMin') || '');
  const [salaryMax, setSalaryMax] = useState(searchParams.get('salaryMax') || '');
  const [education, setEducation] = useState(searchParams.get('education') || '');

  // Sync state when URL changes externally (e.g. browser back)
  useEffect(() => {
    setCity(searchParams.get('city') || '');
    setKeyword(searchParams.get('keyword') || '');
    setTech(searchParams.get('tech') || '');
    setSalaryMin(searchParams.get('salaryMin') || '');
    setSalaryMax(searchParams.get('salaryMax') || '');
    setEducation(searchParams.get('education') || '');
  }, [searchParams]);

  const applyFilters = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset page when filters change
      params.delete('page');

      const merged = {
        city,
        keyword,
        tech,
        salaryMin,
        salaryMax,
        education,
        ...overrides,
      };

      for (const [key, val] of Object.entries(merged)) {
        if (val) {
          params.set(key, val);
        } else {
          params.delete(key);
        }
      }

      router.push(`/jobs?${params.toString()}`);
    },
    [router, searchParams, city, keyword, tech, salaryMin, salaryMax, education]
  );

  const clearFilters = () => {
    router.push('/jobs');
  };

  const hasFilters = city || keyword || tech || salaryMin || salaryMax || education;

  const inputClass =
    'text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary/50 transition-colors';

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex flex-wrap gap-2.5 items-end">
        {/* City */}
        <select
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            applyFilters({ city: e.target.value });
          }}
          className={inputClass}
        >
          <option value="">全部城市</option>
          {options.cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Keyword */}
        <select
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            applyFilters({ keyword: e.target.value });
          }}
          className={inputClass}
        >
          <option value="">全部关键词</option>
          {options.keywords.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>

        {/* Tech */}
        <input
          type="text"
          placeholder="技术栈（如 Python）"
          value={tech}
          onChange={(e) => setTech(e.target.value)}
          onBlur={() => applyFilters({ tech })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyFilters({ tech });
          }}
          className={`${inputClass} w-32`}
        />

        {/* Salary range */}
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            placeholder="最低(k)"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
            onBlur={() => applyFilters({ salaryMin })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyFilters({ salaryMin });
            }}
            className={`${inputClass} w-20`}
          />
          <span className="text-muted/40 text-sm">-</span>
          <input
            type="number"
            placeholder="最高(k)"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            onBlur={() => applyFilters({ salaryMax })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyFilters({ salaryMax });
            }}
            className={`${inputClass} w-20`}
          />
        </div>

        {/* Education */}
        <select
          value={education}
          onChange={(e) => {
            setEducation(e.target.value);
            applyFilters({ education: e.target.value });
          }}
          className={inputClass}
        >
          <option value="">全部学历</option>
          <option value="博士">博士</option>
          <option value="硕士">硕士</option>
          <option value="本科">本科</option>
          <option value="专科">专科</option>
          <option value="不限">不限</option>
        </select>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm flex items-center gap-1 text-muted hover:text-foreground py-2 px-2 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            清除
          </button>
        )}
      </div>
    </div>
  );
}
