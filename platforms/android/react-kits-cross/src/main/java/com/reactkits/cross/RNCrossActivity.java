package com.reactkits.cross;

import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.KeyEvent;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactInstanceManagerBuilder;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactRootView;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class RNCrossActivity extends AppCompatActivity {
    public static final String TAG = "RNCrossActivity";
    public static final String SP_STORE_NAME = "rn-cross";
    public static final String RN_BUNDLE_LOCAL_PATH = File.separator + "rn-modules";
    public static final String JS_BUNDLE_SUFFIX =  File.separator + "index.android.bundle";
    public static final String BUNDLE_REMOTE_SUFFIX_URL = "/android/index.json";

//    public static final String BUNDLE_REMOTE_URL = "https://public.smoex.com/master-native/android/app.json";

    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;
    private ReactInstanceManagerBuilder mBuilder;


    private String mModuleName;
    private String mModuleMd5;
    private String mDownloadUrl;
    private String mLocalPath;
    private String mRootPath;
    private boolean loadedBundle;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    protected void initReactContent(String publicUrl) {
        this.initReactContent(publicUrl, null);
    }

    protected List<ReactPackage> getPackages() {
        return new ArrayList<>();
    }

    protected void initReactContent(String publicUrl, List<ReactPackage> reactPackages) {
//        resetRemoteValue();
//        resetLocalValue();

        SoLoader.init(this, false);
        loadedBundle = false;
        preloadBundleFile();


        String configUrl = publicUrl + BUNDLE_REMOTE_SUFFIX_URL;
        OkHttpClient okHttpClient = new OkHttpClient();
        Request request = new Request.Builder().url(configUrl).get().build();
        okHttpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {

            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                try {
                    String string = response.body().string();
                    Log.i(TAG, "Loaded JSON String: " + string);

                    JSONObject json = new JSONObject(string);
                    mModuleName = json.getString("moduleName");
                    mDownloadUrl = json.getString("downloadUrl");
                    mModuleMd5 = json.getString("md5");
                    mRootPath = RN_BUNDLE_LOCAL_PATH + File.separator + mModuleName;
                    mLocalPath =  mRootPath + File.separator + mModuleMd5;

                    SharedPreferences pref = getSharedPreferences(SP_STORE_NAME, MODE_PRIVATE);
                    // 已经下载完成的 bundle path
                    String remotePath = pref.getString("remotePath", "");

                    // 如果缓存路径与远程路径一致，则不做任何处理
                    if (!isEmptyString(remotePath) && remotePath.equals(mLocalPath)) {
                        return;
                    }

                    startDownload();

                } catch (Exception e) {

                }
            }
        });
    }

    private void resetRemoteValue() {
        SharedPreferences.Editor editor = getSharedPreferences(SP_STORE_NAME, MODE_PRIVATE).edit();
        editor.putString("remotePath", "");
        editor.apply();
    }
    private void resetLocalValue() {
        SharedPreferences.Editor editor = getSharedPreferences(SP_STORE_NAME, MODE_PRIVATE).edit();
        editor.putString("localPath", "");
        editor.apply();
    }

    private void unzipFile() {
        File zipFile = getRootFile(mModuleMd5 + ".zip");
        if (zipFile.exists()) {
            try {
                Log.i(TAG, mLocalPath);
                DownloadUtils.UnZipFolder(zipFile, getRootPath(mLocalPath));
                File file = getBundleFile(JS_BUNDLE_SUFFIX);
                if (file.exists()) {
                    loadBundleFromFile(file);
                } else {
                    resetRemoteValue();
                    // delete zip file
                }
            } catch (Exception e) {
                resetRemoteValue();
                Log.i(TAG, "解压失败：" + e.toString());
            }
        } else {
            Log.i(TAG, "解压失败：文件不存在：" + mLocalPath + ".zip" );
        }
    }


    private void preloadBundleFile() {
        SharedPreferences pref = getSharedPreferences(SP_STORE_NAME, MODE_PRIVATE);
        // 解压完成并且正在使用的 bundle path
        String localPath = pref.getString("localPath", "");
        String moduleName = pref.getString("moduleName", "");
        // 已经下载完成的 bundle path
        String remotePath = pref.getString("remotePath", "");
        String remoteMd5 = pref.getString("remoteMd5", "");
        Log.i(TAG, "store: " + remotePath + "---" + localPath + "---" + moduleName);

        // 如果没有历史缓存则不做任何处理
        if (isEmptyString(localPath) || isEmptyString(moduleName)) {
            resetRemoteValue();
            resetLocalValue();
            return;
        }
        // 如果文件路径发生变动
        if (!isEmptyString(remotePath) && !localPath.equals(remotePath)) {
            mLocalPath = remotePath;
            mModuleName = moduleName;
            mModuleMd5 = remoteMd5;
            mRootPath = RN_BUNDLE_LOCAL_PATH + File.separator + mModuleName;
            if (!isEmptyString(remoteMd5)) {
                unzipFile();
            } else {
                resetRemoteValue();
                resetLocalValue();
            }
            return;
        }
        mLocalPath = localPath;
        mModuleName = moduleName;
        mRootPath = RN_BUNDLE_LOCAL_PATH + File.separator + mModuleName;
        // 若缓存文件存在，则渲染缓存文件
        File file = getBundleFile(JS_BUNDLE_SUFFIX);
        if (file.exists()) {
            loadBundleFromFile(file);
        }
    }

    private void startDownload() {
        DownloadUtils downloadUtils = new DownloadUtils(this);
        downloadUtils.setLifecycleOwner(this);
        downloadUtils.setDownloadListener(new DownloadUtils.DownloadListener() {
            @Override
            public void onSuccess(String path) {
                Log.i(TAG, "下载成功！ path: " + path);
                SharedPreferences.Editor editor = getSharedPreferences(SP_STORE_NAME, MODE_PRIVATE).edit();
                editor.putString("remotePath", mLocalPath);
                editor.putString("remoteMd5", mModuleMd5);
                editor.apply();

                if (!loadedBundle) {
                    unzipFile();
                }
            }

            @Override
            public void onFailed() {
                Log.i(TAG, "下载失败");
            }
        });
        downloadUtils.download(mDownloadUrl, mLocalPath + ".zip");
    }

    private void loadBundleFromFile(File file) {
        List<ReactPackage> packages = getPackages();
        if (packages == null) {
            packages = new ArrayList<>();
        }
        packages.add(new MainReactPackage());

        mBuilder = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setCurrentActivity(this)
                // assets 目录下文件
                //                .setBundleAssetName("index.android.bundle")
                // hot load https://10.0.2.2/index.js 文件
                .setJSMainModulePath("index")
                .addPackages(packages)
//            .setUseDeveloperSupport(BuildConfiig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED);

        Log.i(TAG, "JS FILE: " + file.getAbsolutePath());
        mBuilder.setJSBundleFile(file.getAbsolutePath());

        // set content view
        mReactRootView = new ReactRootView(this);
        mReactInstanceManager = mBuilder.build();
        mReactRootView.startReactApplication(mReactInstanceManager, mModuleName, null);
        setContentView(mReactRootView);

        loadedBundle = true;
        SharedPreferences.Editor editor = getSharedPreferences(SP_STORE_NAME, MODE_PRIVATE).edit();
        editor.putString("localPath", mLocalPath);
        editor.putString("moduleName", mModuleName);
        editor.apply();
    }

    private String getRootPath(String path) {
        return DownloadUtils.getDefaultPathParent(this) + path;
    }

    private File getBundleFile(String fileName) {
        Log.i(TAG, getRootPath(mLocalPath) + fileName);
        return new File(getRootPath(mLocalPath) , fileName);
    }

    private File getRootFile(String fileName) {
        Log.i(TAG, getRootPath(mRootPath) + fileName);
        return new File(getRootPath(mRootPath), fileName);
    }

    private boolean isEmptyString(String text) {
        return text == null || "".equals(text);
    }


    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
//            mReactInstanceManager.onHostResume(this, this);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostDestroy(this);
        }
        if (mReactRootView != null) {
            mReactRootView.unmountReactApplication();
        }
    }
    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

//    @Override
//    protected void onCreate(@Nullable Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
////
////        OkHttpClient okHttpClient = new OkHttpClient();
////        Request request = new Request.Builder().url(REMOTE_URL).get().build();
////        okHttpClient.newCall(request).enqueue(new Callback() {
////            @Override
////            public void onFailure(Call call, IOException e) {
////
////            }
////
////            @Override
////            public void onResponse(Call call, Response response) throws IOException {
////                String string = response.body().string();
////                try {
////                    JSONObject json = new JSONObject(string);
////                    moduleName = json.getString("moduleName");
////                    downloadUrl = json.getString("downloadUrl");
////                    localFile = json.getString("md5") + ".zip";
////                    moduleKey = json.getString("md5") + "_" + json.getString("md5");
////
////                    Log.i("XXXX", string);
////
////                    SharedPreferences pref = getSharedPreferences("ReactNativeCross", MODE_PRIVATE);
////                    String name = pref.getString("moduleKey", "");
////                    Log.i("XXXX", moduleKey + "-"  + name + "," + moduleKey.equals(name));
////                    if (moduleKey.equals(name)) {
////                        File file = getBundleFile();
////                        if (file.exists()) {
////                            ReactNativeActivity.this.runOnUiThread(new Runnable() {
////                                @Override
////                                public void run() {
////                                    loadBundleFromFile(file);
////                                }
////                            });
////                            return;
////                        }
////                    }
////
////                    File zipFile = getZipFile();
////                    if (zipFile.exists()) {
////                        try {
////                            String mpath = DownloadUtils.getDefaultPathParent(ReactNativeActivity.this);
////                            DownloadUtils.UnZipFolder(new File(mpath, localFile), mpath);
////                            File file = getBundleFile();
////                            if (file.exists()) {
////                                ReactNativeActivity.this.runOnUiThread(new Runnable() {
////                                    @Override
////                                    public void run() {
////                                        loadBundleFromFile(file);
////                                    }
////                                });
////                                return;
////                            }
////                        } catch (Exception e) {
////                            Log.i("DownloadUtils", e.toString());
////                            Toast.makeText(ReactNativeActivity.this, "解压失败！", Toast.LENGTH_SHORT).show();
////                        }
////                    }
////
////                    startDownload();
////                } catch (JSONException e) {
////                    e.printStackTrace();
////                }
////                Log.i("RNActivity", string);
////
////            }
////        });
//    }



//    private File getBundleFile() {
//        return new File(DownloadUtils.getDefaultPathParent(this), JS_BUNDLE_LOCAL_FILE);
//    }
//
//    private File getZipFile() {
//        return new File(DownloadUtils.getDefaultPathParent(this), localFile);
//    }
//
////    private ReactInstanceManagerBuilder initBuilder() {
//////        return ReactInstanceManager.builder()
//////                .setApplication(getApplication())
//////                .setCurrentActivity(this)
//////                // assets 目录下文件
////////                .setBundleAssetName("index.android.bundle")
//////                // hot load https://10.0.2.2/index.js 文件
//////                .setJSMainModulePath("index")
//////                .addPackages(Arrays.asList(
//////                        new MainReactPackage(),
////////                   new ReactVideoPackage(),
////////                        new CustomViewPackage()
////////                ))
//////                .setUseDeveloperSupport(BuildConfiig.DEBUG)
//////                .setInitialLifecycleState(LifecycleState.RESUMED);
////    }
//
//    private void setContentView() {
//
//    }


}
