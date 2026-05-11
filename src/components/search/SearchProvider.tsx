'use client';

import { SearchDialog } from './SearchDialog';
import type { SearchIndexEntry } from '@/lib/search';

export function SearchProvider({ index }: { index: SearchIndexEntry[] }) {
  return <SearchDialog index={index} />;
}
