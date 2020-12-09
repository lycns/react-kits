
var fs = require("fs");
var path = require("path");
const { exec } = require('child_process');
const compressing = require('compressing')
const crypto = require('crypto');

deleteFolderRecursive = function(url) {
    var files = [];
    //判断给定的路径是否存在
    if(fs.existsSync(url) ) {
        //返回文件和子目录的数组
        files = fs.readdirSync(url);
         
        files.forEach(function(file,index){
           // var curPath = url + "/" + file;
            var curPath = path.join(url,file);
            //fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
                 
            // 是文件delete file  
            } else {
                fs.unlinkSync(curPath);
            }
        })
        fs.rmdirSync(url);
    }else{
        console.log("给定的路径不存在，请给出正确的路径");
    }
};

const platform = process.argv[2]
const prod = process.argv[3] === 'prod'

console.log('env is prod? ' + prod)

const rootDir = path.join(`./build/${platform}`)
if (!fs.existsSync('./build')) {
    fs.mkdirSync('./build')
}
if (fs.existsSync(rootDir)) {
    deleteFolderRecursive(rootDir)
}

const srcPath = './index.js'
const bundleDir = rootDir + '/bundle'

fs.mkdirSync(rootDir)
fs.mkdirSync(bundleDir)

console.log(bundleDir)

const commend = `react-native bundle --platform ${platform} --dev false --entry-file ${srcPath} --bundle-output ${bundleDir}/index.${platform}.bundle --assets-dest ${bundleDir}`

exec(commend, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    compressing.zip.compressDir(rootDir + '/bundle', rootDir + '/bundle.zip', { ignoreBase: true }).then(() => {
        if (prod) {
            deleteFolderRecursive(rootDir + '/bundle')
        }

        const md5 = createFileHash256Sync(rootDir + '/bundle.zip')

        fs.renameSync(rootDir + '/bundle.zip', rootDir + `/${md5}.zip`)

        const appStr = fs.readFileSync('./public/app.json', { encoding: "utf-8" })
        // const buildStr = fs.readFileSync('./build/index.json', { encoding: "utf-8" })
        const appjson = JSON.parse(appStr || '{}')
        // const buildjson = JSON.parse(buildStr || '{}')
        // console.log(buildStr)
        
        const platJson = {
            md5: md5,
            downloadUrl: `${appjson.publicUrl}/${platform}/${md5}.zip`,
        }

        const json = {
            ...appjson,
            // ...buildjson,
            ...platJson,
        }
        // json[platform] = platJson

        // json.md5 = md5
        // json.downloadUrl = `${json.publicUrl}/${platform}/${md5}.zip`

        fs.writeFile(path.resolve(rootDir + '/index.json'), JSON.stringify(json), { encoding: 'utf8' }, err => {})

    })
})


function createFileHash256Sync(file) {
    const crypto = require('crypto');
    const fs = require('fs');
 
    //读取一个Buffer
    const buffer = fs.readFileSync(file);
    const fsHash = crypto.createHash('md5');
 
    fsHash.update(buffer);
    const md5 = fsHash.digest('hex');
    return md5
}