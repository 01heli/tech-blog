import { NextResponse } from 'next/server';
import { incrementViewCount, getViewCount } from '@/lib/views';

export async function POST(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const count = await incrementViewCount(params.slug);
  return NextResponse.json({ slug: params.slug, count });
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const count = await getViewCount(params.slug);
  return NextResponse.json({ slug: params.slug, count });
}
