
import UIKit
import React
import ZIPFoundation
import Foundation

class RNViewController: RNCrossController {
    var REMOTE_URL = "https://public.smoex.com/master-native#/home?route=/path"
    override func viewDidLoad() {
        super.viewDidLoad()
        super.initReactContent(publicUrl: REMOTE_URL)
    }
}


