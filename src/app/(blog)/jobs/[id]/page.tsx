import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Badge } from '@/components/ui/Badge';
import { JobMetaGrid } from '@/components/jobs/JobMetaGrid';
import { getJobById } from '@/lib/jobs/queries';
import {
  formatSalary,
  formatExperience,
  formatEducation,
  formatDate,
} from '@/lib/jobs/format';


interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = getJobById(parseInt(params.id));
  if (!job) return { title: '岗位未找到' };
  return {
    title: `${job.title} - ${job.companyShort || job.companyRaw}`,
    description: `${job.title} | ${formatSalary(job.salaryMin, job.salaryMax, job.salaryMonths)} | ${job.city}`,
  };
}

export default function JobDetailPage({ params }: Props) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const job = getJobById(id);
  if (!job) notFound();

  return (
    <div className="section-padding">
      <Container>
        {/* Back nav */}
        <AnimatedSection>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            返回岗位列表
          </Link>
        </AnimatedSection>

        {/* Header card */}
        <AnimatedSection delay={0.05}>
          <div className="glass-card p-6 md:p-8 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted">
              <span className="font-medium text-foreground text-base">
                {job.companyShort || job.companyRaw}
              </span>
              {job.companyShort && job.companyShort !== job.companyRaw && (
                <span className="text-xs text-muted/60">
                  ({job.companyRaw})
                </span>
              )}
              <span className="text-muted/30">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.city} {job.location || ''}
              </span>
            </div>

            {/* Meta grid */}
            <div className="mt-6">
              <JobMetaGrid
                items={[
                  {
                    label: '薪资范围',
                    value: formatSalary(
                      job.salaryMin,
                      job.salaryMax,
                      job.salaryMonths
                    ),
                  },
                  {
                    label: '经验要求',
                    value: formatExperience(
                      job.experienceYearsMin,
                      job.experienceRaw
                    ),
                  },
                  {
                    label: '学历要求',
                    value: formatEducation(job.education),
                  },
                  {
                    label: '搜索关键词',
                    value: job.keyword,
                  },
                ]}
              />
            </div>

            {/* Highlights */}
            {job.highlights && (
              <div className="mt-5 pt-5 border-t border-border">
                <span className="text-xs font-medium text-muted/60">
                  福利待遇：
                </span>
                <span className="text-sm text-muted ml-1">
                  {job.highlights}
                </span>
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Tech stack */}
        {job.techStack.length > 0 && (
          <AnimatedSection delay={0.1}>
            <div className="glass-card p-5 md:p-6 mb-4">
              <h3 className="text-sm font-semibold mb-3">技术栈</h3>
              <div className="flex flex-wrap gap-2">
                {job.techStack.map((tech, i) => (
                  <Badge
                    key={tech}
                    variant={i === 0 ? 'primary' : 'default'}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Description */}
        {job.description && (
          <AnimatedSection delay={0.15}>
            <div className="glass-card p-5 md:p-6 mb-4">
              <h3 className="text-sm font-semibold mb-3">职位描述</h3>
              <div className="text-sm leading-relaxed whitespace-pre-wrap text-muted">
                {job.description}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Address */}
        {job.address && (
          <AnimatedSection delay={0.2}>
            <div className="glass-card p-5 md:p-6 mb-4">
              <h3 className="text-sm font-semibold mb-2">办公地址</h3>
              <p className="text-sm text-muted">{job.address}</p>
            </div>
          </AnimatedSection>
        )}

        {/* Footer */}
        <AnimatedSection delay={0.25}>
          <div className="flex items-center justify-between text-xs text-muted/60 mt-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              爬取时间：{formatDate(job.scrapedAt)}
            </span>
            <a
              href={`https://www.zhipin.com${job.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              在 BOSS直聘 查看 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </AnimatedSection>
      </Container>
    </div>
  );
}
