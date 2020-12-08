package com.reactkits.main;

import android.os.Bundle;

import androidx.annotation.Nullable;

import com.reactkits.cross.RNCrossActivity;


public class ReactNativeActivity extends RNCrossActivity {
    public static final String REMOTE_URL = "https://public.smoex.com/master-native#/home?route=/path";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initReactContent(REMOTE_URL);
    }

    @Override
    protected boolean getDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    //    private ReactRootView mReactRootView;
//    private ReactInstanceManager mReactInstanceManager;
//    private ReactInstanceManagerBuilder builder;
//    public static final String JS_BUNDLE_LOCAL_FILE = "index.android.bundle";
//
//    public static final String REMOTE_URL = "https://public.smoex.com/master-native/android/app.json";
//
//    private String moduleName;
//    private String downloadUrl;
//    private String localFile;
//    private String moduleKey;
//
//
//    @Override
//    protected void onCreate(@Nullable Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//
//
//        OkHttpClient okHttpClient = new OkHttpClient();
//        Request request = new Request.Builder().url(REMOTE_URL).get().build();
//        okHttpClient.newCall(request).enqueue(new Callback() {
//            @Override
//            public void onFailure(Call call, IOException e) {
//
//            }
//
//            @Override
//            public void onResponse(Call call, Response response) throws IOException {
//                String string = response.body().string();
//                try {
//                    JSONObject json = new JSONObject(string);
//                    moduleName = json.getString("moduleName");
//                    downloadUrl = json.getString("downloadUrl");
//                    localFile = json.getString("md5") + ".zip";
//                    moduleKey = json.getString("md5") + "_" + json.getString("md5");
//
//                    Log.i("XXXX", string);
//
//                    SharedPreferences pref = getSharedPreferences("ReactNativeCross", MODE_PRIVATE);
//                    String name = pref.getString("moduleKey", "");
//                    Log.i("XXXX", moduleKey + "-"  + name + "," + moduleKey.equals(name));
//                    if (moduleKey.equals(name)) {
//                        File file = getBundleFile();
//                        if (file.exists()) {
//                            ReactNativeActivity.this.runOnUiThread(new Runnable() {
//                                @Override
//                                public void run() {
//                                    loadBundleFromFile(file);
//                                }
//                            });
//                            return;
//                        }
//                    }
//
//                    File zipFile = getZipFile();
//                    if (zipFile.exists()) {
//                        try {
//                            String mpath = DownloadUtils.getDefaultPathParent(ReactNativeActivity.this);
//                            DownloadUtils.UnZipFolder(new File(mpath, localFile), mpath);
//                            File file = getBundleFile();
//                            if (file.exists()) {
//                                ReactNativeActivity.this.runOnUiThread(new Runnable() {
//                                    @Override
//                                    public void run() {
//                                        loadBundleFromFile(file);
//                                    }
//                                });
//                                return;
//                            }
//                        } catch (Exception e) {
//                            Log.i("DownloadUtils", e.toString());
//                            Toast.makeText(ReactNativeActivity.this, "解压失败！", Toast.LENGTH_SHORT).show();
//                        }
//                    }
//
//                    startDownload();
//                } catch (JSONException e) {
//                    e.printStackTrace();
//                }
//                Log.i("RNActivity", string);
//
//            }
//        });
//
////            string//开始解析
////            Gson gson = new Gson();
////            Type type = new TypeToken<Result<List<User>>>() {
////            }.getType();
////            Result result = gson.fromJson(string, type);
////            return result;
//
//
//    }
//
//    private void loadBundleFromFile(File file) {
//        builder = initBuilder();
//        builder.setJSBundleFile(file.getAbsolutePath());
//        setContentView();
//        SharedPreferences.Editor editor = getSharedPreferences("ReactNativeCross", MODE_PRIVATE).edit();
//        editor.putString("moduleKey", moduleKey);
//        editor.apply();
//    }
//
//    @NotNull
//    private File getBundleFile() {
//        return new File(DownloadUtils.getDefaultPathParent(this), JS_BUNDLE_LOCAL_FILE);
//    }
//
//    @NotNull
//    private File getZipFile() {
//        return new File(DownloadUtils.getDefaultPathParent(this), localFile);
//    }
//
//    private ReactInstanceManagerBuilder initBuilder() {
//       return ReactInstanceManager.builder()
//                .setApplication(getApplication())
//                .setCurrentActivity(this)
//                // assets 目录下文件
////                .setBundleAssetName("index.android.bundle")
//                // hot load https://10.0.2.2/index.js 文件
//                .setJSMainModulePath("index")
//               .addPackages(Arrays.asList(
//                   new MainReactPackage(),
////                   new ReactVideoPackage(),
//                   new CustomViewPackage()
//               ))
//                .setUseDeveloperSupport(BuildConfig.DEBUG)
//                .setInitialLifecycleState(LifecycleState.RESUMED);
//    }
//
//    private void setContentView() {
//        mReactRootView = new ReactRootView(this);
//        mReactInstanceManager = builder.build();
//        mReactRootView.startReactApplication(mReactInstanceManager, moduleName, null);
//        setContentView(mReactRootView);
//    }
//
//    public void startDownload() {
//        DownloadUtils downloadUtils = new DownloadUtils(this);
//        downloadUtils.setLifecycleOwner(this);
//        downloadUtils.setDownloadListener(new DownloadUtils.DownloadListener() {
//            @Override
//            public void onSuccess(String path) {
//                Toast.makeText(ReactNativeActivity.this, "下载成功！ path: " + path, Toast.LENGTH_LONG).show();
//                try {
//                    String mpath = DownloadUtils.getDefaultPathParent(ReactNativeActivity.this);
//                    DownloadUtils.UnZipFolder(new File(mpath, localFile), mpath);
//                } catch (Exception e) {
//                    Log.i("DownloadUtils", e.toString());
//                    Toast.makeText(ReactNativeActivity.this, "解压失败！", Toast.LENGTH_SHORT).show();
//                }
//                loadBundleFromFile(getBundleFile());
//            }
//
//            @Override
//            public void onFailed() {
//                Toast.makeText(ReactNativeActivity.this, "下载失败！", Toast.LENGTH_SHORT).show();
//            }
//        });
//        downloadUtils.download(downloadUrl, localFile);
////        String path = DownloadUtils.getDefaultPathParent(this);
////        new Thread() {
////            @Override
////            public void run() {
////                super.run();
////                try {
////                    Thread.sleep(1000);
////                    try {
////                        DownloadUtils.UnZipFolder(new File(path, BUNDLE_LOCAL_FILE), path);
////                    } catch (Exception e) {
////                        Log.i("DownloadUtils", e.toString());
////                        Toast.makeText(ReactNativeActivity.this, "解压失败！", Toast.LENGTH_SHORT).show();
////                    }
////                } catch (InterruptedException e) {
////                    e.printStackTrace();
////                }
////            }
////        }.start();
//    }
}
