
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
    
    func preloadBundleFilxe() {
        if (storeName == "") {
            return
        }

//        let values = readInfo()
//        let a = "123".md5
        
//        // 解压完成并且正在使用的 bundle path
//        String localPath = pref.getString("localPath", "");
//        String moduleName = pref.getString("moduleName", "");
//        // 已经下载完成的 bundle path
//        String remotePath = pref.getString("remotePath", "");
//        String remoteMd5 = pref.getString("remoteMd5", "");
//        Log.i(TAG, "store: " + remotePath + "---" + localPath + "---" + moduleName);
//
//        // 如果没有历史缓存则不做任何处理
//        if (isEmptyString(localPath) || isEmptyString(moduleName)) {
//            resetRemoteValue();
//            resetLocalValue();
//            return;
//        }
//        // 如果文件路径发生变动
//        if (!isEmptyString(remotePath) && !localPath.equals(remotePath)) {
//            mLocalPath = remotePath;
//            mModuleName = moduleName;
//            mModuleMd5 = remoteMd5;
//            mRootPath = RN_BUNDLE_LOCAL_PATH + File.separator + mModuleName;
//            if (!isEmptyString(remoteMd5)) {
//                unzipFile();
//            } else {
//                resetRemoteValue();
//                resetLocalValue();
//            }
//            return;
//        }
//        mLocalPath = localPath;
//        mModuleName = moduleName;
//        mRootPath = RN_BUNDLE_LOCAL_PATH + File.separator + mModuleName;
//        // 若缓存文件存在，则渲染缓存文件
//        File file = getBundleFile(JS_BUNDLE_SUFFIX);
//        if (file.exists()) {
//            loadBundleFromFile(file);
//        }
    }
    
    func startReactViexw() {
        preloadBundleFile()
//        let downloadUrl = "https://public.smoex.com/master-native/ios/index.json"
//        FileTool.getRequest(url: downloadUrl, callback: {(resp) -> Void in
//            print("response:\(resp)")
//            let downLoader = DownLoader()
//            let modalName = resp["moduleName"] as! String
//            let zipUrlStr = resp["downloadUrl"] as! String
//            let md5 = resp["md5"] as! String
//
//            let zipUrl = NSURL(string: zipUrlStr)
//            downLoader.downLoader(url: zipUrl!)
//            let zipLocal = URL(fileURLWithPath: downLoader.getFilePath())
//
//            let fileManager = FileManager()
//
//            let currentWorkingPath = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.cachesDirectory, FileManager.SearchPathDomainMask.userDomainMask, true).first
//
//            let targetURLStr = currentWorkingPath! + "/rn"
//
//            let targetURL = URL(fileURLWithPath: targetURLStr)
//
//            if (FileTool.fileExists(filePath: targetURLStr)) {
//                FileTool.removeFile(targetURLStr)
//            }
//
//            print("local file:\(zipLocal)")
//
//            print("target url:\(targetURL)")
//            do {
//                try fileManager.unzipItem(at: zipLocal, to: targetURL);
//            } catch {
//                print("Creation of ZIP archive failed with error:\(error)")
//                return
//            }
//
//            let jsCodeLocation = URL(fileURLWithPath: currentWorkingPath! + "/rn/index.ios.bundle")
//
//            print("jsCodeLocation url:\(jsCodeLocation)")
//
//
//            DispatchQueue.main.async {
//
//                let rootView = RCTRootView(
//                    bundleURL: jsCodeLocation,
//                    moduleName: modalName,
//                    initialProperties: nil,
//                    launchOptions: nil
//                )
//                self.view = rootView
////                let vc = UIViewController()
////                vc.view = rootView
////                self.present(vc, animated: true, completion: nil)
//            }
//        })
    }
    
    func writeInfo(info: Array<Dictionary<String, Any>>) {
        let defaults = UserDefaults.standard
        let data: NSData = NSKeyedArchiver.archivedData(withRootObject: info) as NSData
        defaults.set(data, forKey: storeName)
        defaults.synchronize()
    }
    
    func readInfo() -> Array<Dictionary<String, Any>> {
        let defaults = UserDefaults.standard
        let data = defaults.object(forKey: storeName)
        if data != nil {
            let ary = NSKeyedUnarchiver.unarchiveObject(with:data as! Data)! as! Array<Any>
            return ary as! Array<Dictionary<String, Any>>
        } else {
            return []
        }
    }
}


