import type { Metadata } from 'next';
import { cache } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Container } from '@/components/layout/Container';
import { SITE } from '@/constants/site';
import { AboutContent } from './AboutContent';

export const metadata: Metadata = {
  title: '关于我',
  description: `${SITE.author.name} - ${SITE.author.bio}`,
};

const getAboutContent = cache(() => {
  const filePath = path.join(process.cwd(), 'content', 'about.mdx');
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return matter(raw).content;
});

export default function AboutPage() {
  const content = getAboutContent();

  if (!content) {
    return (
      <div className="section-padding">
        <Container size="small">
          <div className="py-12 text-center text-muted">
            关于页面内容尚未发布。
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <Container size="small">
        <div className="py-12">
          <AboutContent content={content} />
        </div>
      </Container>
    </div>
  );
}
