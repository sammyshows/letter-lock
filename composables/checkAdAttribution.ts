import { registerPlugin } from '@capacitor/core';
import type { SearchAdsAttributionPlugin } from '@/types/types';

const ScreenOrientation = registerPlugin<SearchAdsAttributionPlugin>(
  'ScreenOrientation',
);

export const checkAdAttribution = () => {
  return ScreenOrientation.checkAdAttribution();
}
