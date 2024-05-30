import Foundation
import Capacitor

@objc(SearchAdsAttributionPlugin)
public class SearchAdsAttributionPlugin: CAPPlugin {
    @objc func checkAdAttribution(_ call: CAPPluginCall) {
        let searchAdsAttribution = SearchAdsAttribution()
        searchAdsAttribution.checkAdAttribution(call)
    }
}
