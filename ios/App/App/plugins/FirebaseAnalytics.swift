import Firebase
import Capacitor

@objc(FirebaseAnalytics)
public class FirebaseAnalytics: NSObject {
    
    @objc func setUserId(_ call: CAPPluginCall) {
        print("FIREBASE 3: Setting user ID")
        guard let userId = call.getString("userId") else {
            print("FIREBASE: User ID must be provided")
            call.reject("User ID must be provided")
            return
        }
        Analytics.setUserID(userId)
        print("FIREBASE 3: User ID set to \(userId)")
        call.resolve()
    }
    
    @objc func setUserProperty(_ call: CAPPluginCall) {
        print("FIREBASE 3: Setting user property")
        guard let name = call.getString("name"), let value = call.getString("value") else {
            print("FIREBASE 3: Name and value must be provided")
            call.reject("Name and value must be provided")
            return
        }
        Analytics.setUserProperty(value, forName: name)
        print("FIREBASE 3: User property set. Name: \(name), Value: \(value)")
        call.resolve()
    }
    
    @objc func logEvent(_ call: CAPPluginCall) {
        print("FIREBASE 3: Logging event")
        guard let name = call.getString("name") else {
            print("FIREBASE: Event name must be provided")
            call.reject("Event name must be provided")
            return
        }
        let params = call.getObject("params") ?? [:]
        Analytics.logEvent(name, parameters: params)
        print("FIREBASE 3: Event logged. Name: \(name), Params: \(params)")
        call.resolve()
    }
}
