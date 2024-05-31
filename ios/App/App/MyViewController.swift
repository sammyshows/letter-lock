//  MyViewController.swift
//  App
//
//  Created by Sam McCarthy on 31/5/2024.
//

import UIKit
import Capacitor

class MyViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(FirebaseAnalyticsPlugin())
        bridge?.registerPluginInstance(SearchAdsAttributionPlugin())
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */
}
