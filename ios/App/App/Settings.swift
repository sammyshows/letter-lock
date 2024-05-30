import Foundation

class Settings {
    static let shared = Settings()
    
    private init() {}
    
    var isAdvertiserTrackingEnabled: Bool {
        get {
            return UserDefaults.standard.bool(forKey: "isAdvertiserTrackingEnabled")
        }
        set {
            UserDefaults.standard.set(newValue, forKey: "isAdvertiserTrackingEnabled")
        }
    }
}
