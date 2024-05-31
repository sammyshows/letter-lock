#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(FirebaseAnalyticsPlugin, "FirebaseAnalytics",
  CAP_PLUGIN_METHOD(setUserId, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(setUserProperty, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(logEvent, CAPPluginReturnPromise);
)
