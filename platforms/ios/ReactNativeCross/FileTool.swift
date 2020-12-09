//
//  FileTool.swift
//  ReactNativeCross
//
//  Created by 哔哩哔哩 on 2020/8/27.
//  Copyright © 2020 test. All rights reserved.
//

import UIKit

class FileTool: NSObject {
    class func getRequest(url: String, callback: @escaping (NSDictionary) -> Void){

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

    
    // MARK:- 判断文件目录是否存在
    class func fileExists(filePath : String) -> Bool {
        
        if ((filePath as NSString).length == 0) {
            return false
        }
        return FileManager.default.fileExists(atPath: filePath)
    }
    
    // MARK:- 获取文件的大小
    class func  fileSize(_ filePath : String) ->CLongLong{
    
        if !self.fileExists(filePath: filePath) {
            print("file not exists")
            return 0
        }
        
        let fileInfo = try! FileManager.default.attributesOfItem(atPath: filePath)
        
        return fileInfo[FileAttributeKey.size] as! CLongLong
        
    }
    
    // MARK:- 移动文件
    class func moveFile(_ fromPath : String , _ toPath : String){
        
        if self.fileSize(fromPath)  == 0 {
            return
        }
        try! FileManager.default.moveItem(atPath: fromPath, toPath: toPath)
    }
    
    class func removeFile(_ filePath : String){
       try! FileManager.default.removeItem(atPath: filePath)
    }
    
    class func makeDir(path: String) {
    //        获得文件管理对象，它的主要功能包括文件中写入数据，删除或者复制文件，移动文件，比较两个文件的内容或者测试文件的存在性等
            let manager = FileManager.default
    //        使用文件管理对象，判断文件夹是否存在，并把结果储存在常量中
            let exist = manager.fileExists(atPath: path)
    //        如果文件夹不存在，则执行之后的代码
            if !exist
            {
                do{
    //                创建指定位置上的文件夹
                    try manager.createDirectory(atPath: path, withIntermediateDirectories: true, attributes: nil)
                    print("Succes to create folder")
                }
                catch{
                    print("Error to create folder")
                }
            }
    }
  
}
