import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { getAllProjects } from '@/lib/projects';
import { formatDate } from '@/lib/utils';
import { SITE } from '@/constants/site';
import type { Project, ProjectStatus } from '@/types/project';

export const metadata: Metadata = {
  title: '项目',
  description: `${SITE.name} 开发项目记录`,
};

const statusStyles: Record<ProjectStatus, string> = {
  '进行中': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  '已完成': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  '维护中': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const latestDate = project.timeline[0]?.date || project.frontmatter.date;

  return (
    <AnimatedSection delay={index * 0.08}>
      <Link
        href={`/projects/${project.slug}`}
        className="block h-full rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-lg font-semibold leading-tight">
            {project.frontmatter.title}
          </h2>
          <span
            className={`shrink-0 ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[project.frontmatter.status]}`}
          >
            {project.frontmatter.status}
          </span>
        </div>

        <p className="text-sm text-muted mb-4 line-clamp-2">
          {project.frontmatter.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.frontmatter.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted">
          <span>最新：{formatDate(latestDate)}</span>
          <span className="text-primary">
            {project.timeline.length} 条记录 →
          </span>
        </div>
      </Link>
    </AnimatedSection>
  );
}

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="section-padding">
      <Container>
        <AnimatedSection>
          <h1 className="text-4xl font-bold tracking-tight mb-2">项目</h1>
          <p className="text-muted mb-12">
            记录每个项目的开发历程，按时间节点追踪工作进度
          </p>
        </AnimatedSection>

        {projects.length === 0 ? (
          <div className="py-12 text-center text-muted">
            暂无项目记录。
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
