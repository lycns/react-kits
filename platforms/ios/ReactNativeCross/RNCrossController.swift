
import UIKit
import React
import ZIPFoundation
import Foundation
struct RNUrl {
    var search: String
    var publicUrl: String
    var path: String
}

private let kCachePath = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.cachesDirectory, FileManager.SearchPathDomainMask.userDomainMask, true).first
private let kTempPath = NSTemporaryDirectory()

class RNCrossController: UIViewController {
    
    var BUNDLE_REMOTE_SUFFIX_URL = "/ios/index.json"
    
    var loadedBundle = false
    var storeName = ""
    var moduleName = ""
    var remotePath = ""
    var localPath = ""
    var rootPath = ""
    var moduleMd5 = ""
    var downloadUrl = ""
    
    var href = ""
    
    open func initReactContent(publicUrl: String) {
//        let jsCodeLocation = URL(string: "http://localhost:8081/index.bundle?platform=ios")
//        self.moduleName = "ReactKitsTest"
//        loadBundleFromUrl(jsCodeLocation: jsCodeLocation!)
//        return
//
            
        self.href = publicUrl
        let url = getUrlInfo(url: publicUrl)
        storeName = "rn-cross_" + url.publicUrl.md5 + ".plist"
        loadedBundle = false
        preloadBundleFile()
        
        let configUrl = url.publicUrl + BUNDLE_REMOTE_SUFFIX_URL;
        print("request URL: " + configUrl)
        FileTool.getRequest(url: configUrl) { (resp) -> Void in
            self.moduleName = resp["moduleName"] as! String
            self.downloadUrl = resp["downloadUrl"] as! String
            self.moduleMd5 = resp["md5"] as! String
            
            print("JSON Config: \(resp)")
            
            self.rootPath = "/rn-modules" + "/" + self.moduleName
            self.localPath = self.rootPath + "/" + self.moduleMd5
            
            let values = self.readInfo();
            let remotePath = values["remotePath"] as? String
            
            // 如果缓存路径与远程路径一致，则不做任何处理
            if (!self.isEmptyString(str: remotePath) && remotePath == self.localPath) {
                return
            }
            
            DispatchQueue.main.async {
                self.startDownload()
            }
        }
        
//        let m = publicUrl.split(separator: "#")
    }
    
    func startDownload() {
        let downLoader = DownLoader()
        let zipUrl = NSURL(string: self.downloadUrl)
       
        downLoader.addDownListener {
            print("文件下载成功!!!" + downLoader.getFilePath())
            print("local path: " + self.localPath)
            var values = self.readInfo()
            values["remotePath"] = self.localPath
            values["remoteMd5"] = self.moduleMd5
            self.writeInfo(info: values)
            
            if (!self.loadedBundle) {
                self.UnzipFile()
            }
            
        }
        downLoader.downLoader(url: zipUrl!, dir: "rn-modules/" + self.moduleName)
    }
    
    func UnzipFile() {
        let zipPath = kCachePath! + self.rootPath + "/" + self.moduleMd5 + ".zip"
        let targetPath = kCachePath! + self.localPath
        print("zip path: " + zipPath + "---" + targetPath)
        
        if (FileTool.fileExists(filePath: targetPath)) {
            FileTool.removeFile(targetPath)
        }
        
        let targetURL = URL(fileURLWithPath: targetPath)
        let zipURL = URL(fileURLWithPath: zipPath)
        

        print("local file:\(zipURL)")

        print("target url:\(targetURL)")
        do {
            let fileManager = FileManager()
            try fileManager.unzipItem(at: zipURL, to: targetURL);
            let filepath = targetPath + "/index.ios.bundle"
            if (FileTool.fileExists(filePath: filepath)) {
                let jsCodeLocation = URL(fileURLWithPath: filepath)
                loadBundleFromUrl(jsCodeLocation: jsCodeLocation);
            } else {
                self.resetRemoteValue()
                print("文件不存在")
            }
        } catch {
            print("Creation of ZIP archive failed with error:\(error)")
            self.resetRemoteValue()
            return
        }
    }
    
    func resetRemoteValue() {
        var values = self.readInfo()
        values["remotePath"] = ""
        self.writeInfo(info: values)
    }
    
    func resetLocalValue() {
        var values = self.readInfo()
        values["localPath"] = ""
        self.writeInfo(info: values)
    }

  
    func preloadBundleFile() {
//
//        self.resetRemoteValue();
//        self.resetLocalValue();
//
        let values = readInfo()
        
        // 解压完成并且正在使用的 bundle path
        let localPath = values["localPath"] as? String
        let moduleName = values["moduleName"] as? String
        
        // 已经下载完成的 bundle path
        let remotePath = values["remotePath"] as? String
        let remoteMd5 = values["remoteMd5"] as? String
        
        print("localPath: \(localPath), moduleName: \(moduleName), remotePath: \(remotePath), remoteMd5: \(remoteMd5)")
        
        if (isEmptyString(str: localPath) || isEmptyString(str: moduleName)) {
            self.resetRemoteValue();
            self.resetLocalValue();
            return;
        }
        
      //如果文件路径发生变动
        if (!isEmptyString(str: remotePath) && localPath != remotePath) {
            self.localPath = remotePath!;
            self.moduleName = moduleName!;
            self.moduleName = remoteMd5!;
            self.rootPath = "/rn-modules" + "/" + self.moduleName
            if (!isEmptyString(str: remoteMd5)) {
                UnzipFile();
            } else {
                resetRemoteValue();
                resetLocalValue();
            }
            return;
        }
        
        self.localPath = localPath!
        self.moduleName = moduleName!
        let targetPath = kCachePath! + self.localPath
        let filepath = targetPath + "/index.ios.bundle"
        if (FileTool.fileExists(filePath: filepath)) {
            let jsCodeLocation = URL(fileURLWithPath: filepath)
            loadBundleFromUrl(jsCodeLocation: jsCodeLocation);
        }
        
        
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
    
    override func viewDidLoad() {
          super.viewDidLoad()
          let view = UIView()
          view.backgroundColor = UIColor.systemBackground
          self.view = view
        
  }
    
    func getUrlInfo(url: String) -> RNUrl {
        let m = url.split(separator: "?").compactMap({ "\($0)" })
        let publicUrl = m[0]
        let search = "?" + m[1]
        return RNUrl(search: search, publicUrl: publicUrl, path: "/")
    }
    
  
  func loadBundleFromUrl(jsCodeLocation: URL) {
    let url = getUrlInfo(url: self.href)
    let props = [
        "publicUrl": url.publicUrl,
        "path": url.path,
        "search": url.search
    ]
      let rootView = RCTRootView(
          bundleURL: jsCodeLocation,
          moduleName: moduleName,
          initialProperties: props,
          launchOptions: nil
      )
      self.view = rootView
    self.loadedBundle = true
    
    var values = self.readInfo()
    values["localPath"] = self.localPath
    values["moduleName"] = self.moduleName
    self.writeInfo(info: values)
  }
      
  func isEmptyString(str: String?) -> Bool {
          if (str == nil) {
              return true
          }
          return str == ""
      }
    
    func writeInfo(info: Dictionary<String, Any>) {
        let defaults = UserDefaults.standard
        let data: NSData = NSKeyedArchiver.archivedData(withRootObject: info) as NSData
        defaults.set(data, forKey: storeName)
        defaults.synchronize()
    }
    
    func readInfo() -> Dictionary<String, Any> {
        let defaults = UserDefaults.standard
        let data = defaults.object(forKey: storeName)
        if data != nil {
            let ary = NSKeyedUnarchiver.unarchiveObject(with:data as! Data)! as! Dictionary<String, Any>
            return ary
        } else {
            return [:]
        }
    }
}



extension String {
    var md5:String {
        let utf8 = cString(using: .utf8)
        var digest = [UInt8](repeating: 0, count: Int(CC_MD5_DIGEST_LENGTH))
        CC_MD5(utf8, CC_LONG(utf8!.count - 1), &digest)
        return digest.reduce("") { $0 + String(format:"%02x", $1) }
    }
}
