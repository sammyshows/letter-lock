import Foundation
import Capacitor

@objc(FirebaseAnalyticsPlugin)
public class FirebaseAnalyticsPlugin: CAPPlugin {
    
    @objc func setUserId(_ call: CAPPluginCall) {
        print("FIREBASE 2: Setting user ID")
        let firebaseAnalytics = FirebaseAnalytics()
        firebaseAnalytics.setUserId(call)
    }
    
    @objc func setUserProperty(_ call: CAPPluginCall) {
        print("FIREBASE 2: Set user property")
        let firebaseAnalytics = FirebaseAnalytics()
        firebaseAnalytics.setUserProperty(call)
    }
    
    @objc func logEvent(_ call: CAPPluginCall) {
        print("FIREBASE 2: Logging event")
        let firebaseAnalytics = FirebaseAnalytics()
        firebaseAnalytics.logEvent(call)
    }
}
