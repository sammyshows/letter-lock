import { registerPlugin } from '@capacitor/core';
import type { FirebaseAnalyticsPlugin } from '@/types/types';

const FirebaseAnalytics = registerPlugin<FirebaseAnalyticsPlugin>(
  'FirebaseAnalytics',
);

export const setFirebaseUserId = (userId: string) => {
  console.log('FIREBASE 1: setFirebaseUserId', userId);
  return FirebaseAnalytics.setUserId({ userId });
}

export const setFirebaseUserProperty = (name: string, value: string) => {
  console.log('FIREBASE 1: setFirebaseUserProperty', name, value);
  return FirebaseAnalytics.setUserProperty({ name, value });
}

export const logFirebaseEvent = (name: string, params: { [key: string]: any } = {}) => {
  console.log('FIREBASE 1: logFirebaseEvent', name, params);
  return FirebaseAnalytics.logEvent({ name, params });
}
