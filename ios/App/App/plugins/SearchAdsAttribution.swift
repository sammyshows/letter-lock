import AdServices
import Capacitor

@objc(SearchAdsAttribution)
public class SearchAdsAttribution: NSObject {
    
    @objc func checkAdAttribution(_ call: CAPPluginCall) {
        if #available(iOS 14.3, *) {
            if let attributionToken = try? AAAttribution.attributionToken() {
                let url = URL(string: "https://api-adservices.apple.com/api/v1/")!.appendingPathComponent("searchads_attribution")
                var request = URLRequest(url: url)
                request.httpMethod = "POST"
                request.setValue("application/json", forHTTPHeaderField: "Content-Type")
                request.httpBody = try? JSONSerialization.data(withJSONObject: ["token": attributionToken])

                let task = URLSession.shared.dataTask(with: request) { data, response, error in
                    guard let data = data, error == nil else {
                        call.reject("Failed to get attribution data")
                        return
                    }
                    if let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                        if let attribution = json["attribution"] as? Bool, attribution {
                            call.resolve([
                                "campaignId": json["campaignId"] ?? "unknown",
                                "adGroupId": json["adGroupId"] ?? "unknown",
                                "adGroupName": json["adGroupName"] ?? "unknown",
                                "keyword": json["keyword"] ?? "unknown",
                            ])
                        } else {
                            call.resolve([
                                "attribution": false
                            ])
                        }
                    } else {
                        call.reject("Failed to parse attribution data")
                    }
                }
                task.resume()
            } else {
                call.reject("Failed to get attribution token")
            }
        } else {
            call.reject("Unsupported iOS version")
        }
    }
}
