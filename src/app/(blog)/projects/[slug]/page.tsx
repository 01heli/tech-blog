import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProjects, getProjectBySlug } from '@/lib/projects';
import { SITE } from '@/constants/site';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { ProjectTimeline } from './ProjectTimeline';
import { AdminEditProjectButton } from '@/components/admin/AdminEditProjectButton';
import { formatDate } from '@/lib/utils';
import type { ProjectStatus } from '@/types/project';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: 'Not Found' };

  return {
    title: `项目：${project.frontmatter.title}`,
    description: project.frontmatter.description,
    openGraph: {
      title: project.frontmatter.title,
      description: project.frontmatter.description,
      type: 'article',
      siteName: SITE.name,
    },
  };
}

const statusStyles: Record<ProjectStatus, string> = {
  '进行中': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  '已完成': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  '维护中': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  '已暂停': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  '已取消': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default async function ProjectPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <div className="section-padding">
      <Container size="small">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors mb-6"
        >
          ← 返回项目列表
        </Link>
        <AnimatedSection>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {project.frontmatter.title}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[project.frontmatter.status]}`}
              >
                {project.frontmatter.status}
              </span>
            </div>
            <p className="text-muted text-base mb-3">
              {project.frontmatter.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {(project.frontmatter.techStack || []).map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 rounded-md bg-secondary text-xs text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted">
              {project.frontmatter.github && (
                <a
                  href={project.frontmatter.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub →
                </a>
              )}
              {project.frontmatter.demo && (
                <a
                  href={project.frontmatter.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  在线演示 →
                </a>
              )}
              <span>创建于 {formatDate(project.frontmatter.date)}</span>
            </div>
          </div>
        </AnimatedSection>

        <div className="border-t border-border pt-8">
          <ProjectTimeline timeline={project.timeline} />
        </div>
      </Container>
      <AdminEditProjectButton slug={params.slug} />
    </div>
  );
}
