//
//  ViewController.swift
//  ReactNativeCross
//
//  Created by 哔哩哔哩 on 2020/7/30.
//  Copyright © 2020 test. All rights reserved.
//

import UIKit
import React
import ZIPFoundation

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }

    @IBAction func toRnPage(sender : UIButton) {
//        let jsCodeLocation = Bundle.main.url(forResource: "../assets/index.ios", withExtension: "bundle")
//        Bundle.init(for: <#T##AnyClass#>)
        
//      let jsCodeLocation = URL(string: "http://localhost:8081/index.bundle?platform=ios")
        let downloadUrl = "https://public.smoex.com/master-native/ios/app.json"
//        let remoteUrl = "https://public.smoex.com/master-native/ios/app.json"
        
        
               
//           let url = NSURL(string: "https://public.smoex.com/bbq-test/ios/jsbundle/index.ios.bundle")
        
        
        getRequest(url: downloadUrl, callback: {(resp) -> Void in
            print("response:\(resp)")
            let downLoader = DownLoader()
            let modalName = resp["moduleName"] as! String
            let zipUrlStr = resp["downloadUrl"] as! String
            let md5 = resp["md5"] as! String

            let zipUrl = NSURL(string: zipUrlStr)
            downLoader.downLoader(url: zipUrl!)
            let zipLocal = URL(fileURLWithPath: downLoader.getFilePath())

            let fileManager = FileManager()

            let currentWorkingPath = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.cachesDirectory, FileManager.SearchPathDomainMask.userDomainMask, true).first
            
            let targetURLStr = currentWorkingPath! + "/rn"
            
            let targetURL = URL(fileURLWithPath: targetURLStr)
            
            if (FileTool.fileExists(filePath: targetURLStr)) {
                FileTool.removeFile(targetURLStr)
            }

            print("local file:\(zipLocal)")

            print("target url:\(targetURL)")
            do {
                try fileManager.unzipItem(at: zipLocal, to: targetURL);
            } catch {
                print("Creation of ZIP archive failed with error:\(error)")
                return
            }

            let jsCodeLocation = URL(fileURLWithPath: currentWorkingPath! + "/rn/index.ios.bundle")

            print("jsCodeLocation url:\(jsCodeLocation)")


            DispatchQueue.main.async {
                
                let rootView = RCTRootView(
                    bundleURL: jsCodeLocation,
                    moduleName: modalName,
                    initialProperties: nil,
                    launchOptions: nil
                )
                let vc = UIViewController()
                vc.view = rootView
                self.present(vc, animated: true, completion: nil)
            }
        })
        

//       let url = NSURL(string: "https://public.smoex.com/bbq-test/ios/jsbundle/index.ios.bundle")
//        let downLoader = DownLoader()
//       downLoader.downLoader(url: url!)
//
//
//        let jsCodeLocation = URL(fileURLWithPath: downLoader.getFilePath())
//
//
//      let rootView = RCTRootView(
//          bundleURL: jsCodeLocation,
//          moduleName: "AndroidTestRN",
//          initialProperties: nil,
//          launchOptions: nil
//      )
//      let vc = UIViewController()
//      vc.view = rootView
//      self.present(vc, animated: true, completion: nil)
    }
    
    
    func getRequest(url: String, callback: @escaping (NSDictionary) -> Void){

        let url = URL(string: url)

        var request = URLRequest(url: url!)

        

        let list  = NSMutableArray()

        let paramDic = [String: String]()

        

        if paramDic.count > 0 {

            //设置为POST请求

            request.httpMethod = "GET"

            //拆分字典,subDic是其中一项，将key与value变成字符串

            for subDic in paramDic {

                let tmpStr = "\(subDic.0)=\(subDic.1)"

                list.add(tmpStr)

            }

            //用&拼接变成字符串的字典各项

            let paramStr = list.componentsJoined(by: "&")

            //UTF8转码，防止汉字符号引起的非法网址

            let paraData = paramStr.data(using: String.Encoding.utf8)

            //设置请求体

            request.httpBody = paraData

        }

        

        let configuration:URLSessionConfiguration = URLSessionConfiguration.default

        let session:URLSession = URLSession(configuration: configuration)
        let task:URLSessionDataTask = session.dataTask(with: request) { (data, response, error) -> Void in
            if error == nil{
                do{

                    let responseData: NSDictionary = try JSONSerialization.jsonObject(with: data!, options: JSONSerialization.ReadingOptions.allowFragments) as! NSDictionary

//                    print("response:\(response)")
//
                    print("responseData:\(responseData)")

                    callback(responseData)

                }catch{

                    print("catch")

                }

            }else{

                print("error:\(error)")

            }

        }

        // 启动任务

        task.resume()

    }


    
    @IBAction func toFlutterPage(sender : UIButton) {
//        let flutterEngine = (UIApplication.shared.delegate as! AppDelegate).flutterEngine
//        let flutterViewController =
//            FlutterViewController(engine: flutterEngine, nibName: nil, bundle: nil)
//        present(flutterViewController, animated: true, completion: nil)
    }

}
