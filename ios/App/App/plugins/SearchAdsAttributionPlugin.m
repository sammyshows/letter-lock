#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(SearchAdsAttributionPlugin, "SearchAdsAttribution",
  CAP_PLUGIN_METHOD(checkAdAttribution, CAPPluginReturnPromise);
)
