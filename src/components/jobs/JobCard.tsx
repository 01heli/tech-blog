import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { JobItem } from '@/types/job';
import { formatSalary, formatExperience, formatEducation, formatDate } from '@/lib/jobs/format';

interface JobCardProps {
  job: JobItem;
}

export function JobCard({ job }: JobCardProps) {
  const displayCompany = job.companyShort || job.companyRaw;

  return (
    <Link href={`/jobs/${job.id}`} className="group block">
      <article className="glass-card p-5 hover:shadow-md hover:border-primary/50 transition-all duration-300">
        {/* Desktop layout */}
        <div className="hidden md:flex items-center gap-4">
          {/* Title + tech stack */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {job.techStack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="default">
                  {tech}
                </Badge>
              ))}
              {job.techStack.length > 4 && (
                <span className="text-[10px] text-muted/50 leading-5">
                  +{job.techStack.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Company */}
          <div className="w-28 shrink-0 text-sm text-muted truncate">
            {displayCompany}
          </div>

          {/* Salary */}
          <div className="w-24 shrink-0 text-sm font-semibold text-right">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryMonths)}
          </div>

          {/* Experience */}
          <div className="w-16 shrink-0 text-sm text-muted text-center">
            {formatExperience(job.experienceYearsMin, job.experienceRaw)}
          </div>

          {/* Education */}
          <div className="w-16 shrink-0 text-sm text-muted text-center">
            {formatEducation(job.education)}
          </div>

          {/* Location */}
          <div className="w-28 shrink-0 text-sm text-muted text-right flex items-center justify-end gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {job.city}
              {job.location ? ` ${job.location}` : ''}
            </span>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden space-y-1.5">
          <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>{displayCompany}</span>
            <span>·</span>
            <span className="font-medium text-foreground">
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryMonths)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>{job.city} {job.location || ''}</span>
            <span>·</span>
            <span>{formatExperience(job.experienceYearsMin, job.experienceRaw)}</span>
            <span>·</span>
            <span>{formatEducation(job.education)}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {job.techStack.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="default">
                {tech}
              </Badge>
            ))}
            {job.techStack.length > 3 && (
              <span className="text-[10px] text-muted/50 leading-5">
                +{job.techStack.length - 3}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted/50 pt-1">
            <Clock className="w-2.5 h-2.5" />
            <span>{formatDate(job.scrapedAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
