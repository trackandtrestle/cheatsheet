import type { Entry } from './types';
import { setsMapsEntries as data } from './sets-maps.data';
import { LruCacheDemo } from '../demos/sets-maps/LruCacheDemo';

const DEMOS: Partial<Record<string, Entry['Demo']>> = {
  'sets-maps-lru-cache': LruCacheDemo,
};

export const setsMapsEntries: Entry[] = data.map((e) => {
  const Demo = DEMOS[e.id];
  return Demo ? { ...e, Demo } : e;
});
