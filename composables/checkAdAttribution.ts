import { registerPlugin } from '@capacitor/core';
import type { SearchAdsAttributionPlugin } from '@/types/types';

const SearchAdsAttribution = registerPlugin<SearchAdsAttributionPlugin>(
  'SearchAdsAttribution',
);

export const checkAdAttribution = () => {
  return SearchAdsAttribution.checkAdAttribution();
}
