import FirebaseAnalytics
import Capacitor

@objc(FirebaseAnalyticsPlugin)
public class FirebaseAnalyticsPlugin: CAPPlugin {
    
    @objc func setUserId(_ call: CAPPluginCall) {
        print("FIREBASE 2: Setting user ID")
        guard let userId = call.getString("userId") else {
            call.reject("User ID must be provided")
            return
        }
        Analytics.setUserID(userId)
        call.resolve()
    }
    
    @objc func setUserProperty(_ call: CAPPluginCall) {
        print("FIREBASE 2: Setting user property")
        guard let name = call.getString("name"), let value = call.getString("value") else {
            call.reject("Name and value must be provided")
            return
        }
        Analytics.setUserProperty(value, forName: name)
        call.resolve()
    }
    
    @objc func logEvent(_ call: CAPPluginCall) {
        print("FIREBASE 2: Logging event")
        guard let name = call.getString("name") else {
            call.reject("Event name must be provided")
            return
        }
        let params = call.getObject("params") ?? [:]
        Analytics.logEvent(name, parameters: params)
        call.resolve()
    }
}
