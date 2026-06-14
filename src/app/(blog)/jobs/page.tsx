import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { JobStatsBar } from '@/components/jobs/JobStatsBar';
import { JobFilterBar } from '@/components/jobs/JobFilterBar';
import { JobCard } from '@/components/jobs/JobCard';
import { Pagination } from '@/components/jobs/Pagination';
import { getJobs, getFilterOptions } from '@/lib/jobs/queries';
import { SITE } from '@/constants/site';

export const metadata: Metadata = {
  title: '求职看板',
  description: `${SITE.name} — BOSS直聘岗位数据分析`,
};

const PER_PAGE = 20;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const options = await getFilterOptions();

  const filters = {
    city: searchParams.city,
    keyword: searchParams.keyword,
    tech: searchParams.tech,
    salaryMin: searchParams.salaryMin ? Number(searchParams.salaryMin) : undefined,
    salaryMax: searchParams.salaryMax ? Number(searchParams.salaryMax) : undefined,
    education: searchParams.education,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    pageSize: PER_PAGE,
  };

  const { items: jobs, total } = await getJobs(filters);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div className="section-padding">
      <Container>
        <AnimatedSection>
          <h1 className="text-4xl font-bold tracking-tight mb-2">求职看板</h1>
          <p className="text-muted mb-8">
            共 {total} 个岗位
            {totalPages > 1 && ` · 第 ${filters.page}/${totalPages} 页`}
          </p>
        </AnimatedSection>

        {/* Stats bar */}
        <AnimatedSection delay={0.05}>
          <JobStatsBar />
        </AnimatedSection>

        {/* Filter bar */}
        <AnimatedSection delay={0.1}>
          <JobFilterBar options={options} />
        </AnimatedSection>

        {/* Job list */}
        <AnimatedSection delay={0.15}>
          {jobs.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <p className="text-lg">没有匹配的岗位</p>
              <p className="text-sm mt-1">尝试调整筛选条件</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </AnimatedSection>

        {/* Pagination */}
        <AnimatedSection delay={0.2}>
          <Pagination
            currentPage={filters.page!}
            totalPages={totalPages}
            currentParams={
              new URLSearchParams(
                Object.entries(searchParams).filter(
                  ([, v]) => v !== undefined
                ) as [string, string][]
              )
            }
          />
        </AnimatedSection>
      </Container>
    </div>
  );
}
