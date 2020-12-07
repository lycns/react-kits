package com.reactkits.main;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleObserver;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.OnLifecycleEvent;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Objects;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;

/**
 * m.poizon.com Inc.
 * Copyright (c) 1999-2020 All Rights Reserved.
 *
 * @author lizhenquan
 * @contact lizhenquan@theduapp.com
 */
public class DownloadUtils implements LifecycleObserver {
    public static final String TAG = "DownloadUtils";
    private static String DEFAULT_PATH_PARENT = null;
    //下载器
    private DownloadManager downloadManager;
    private Context mContext;
    //下载的ID
    private long downloadId;
    private String pathstr;

    public DownloadUtils(Context context) {
        this.mContext = context;
        DEFAULT_PATH_PARENT = Objects.requireNonNull(context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS)).getAbsolutePath();
    }

    public void download(String url, String name) {
        this.download(url, name, "");
    }

    //下载apk
    public void download(String url, String name, String path) {
        //创建下载任务
        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
        //移动网络情况下是否允许漫游
        request.setAllowedOverRoaming(false);
        //在通知栏中显示，默认就是显示的
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE);
        request.setTitle("通知标题");
        request.setDescription("下载中...");
        request.setVisibleInDownloadsUi(true);

        //设置下载的路径
        File file = new File(DEFAULT_PATH_PARENT + path, name);
        if (file.exists()) {
            file.delete();
        }
        request.setDestinationUri(Uri.fromFile(file));
        pathstr = file.getAbsolutePath();
        //获取DownloadManager
        if (downloadManager == null)
            downloadManager = (DownloadManager) mContext.getSystemService(Context.DOWNLOAD_SERVICE);
        //将下载请求加入下载队列，加入下载队列后会给该任务返回一个long型的id，通过该id可以取消任务，重启任务、获取下载的文件等等
        if (downloadManager != null) {
            downloadId = downloadManager.enqueue(request);
        }

        //注册广播接收者，监听下载状态
        mContext.registerReceiver(receiver,
                new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
    }

    private DownloadListener listener;

    public void setDownloadListener(DownloadListener listener) {
        this.listener = listener;
    }

    //广播监听下载的各个状态
    private BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            checkStatus();
        }
    };

    //检查下载状态
    private void checkStatus() {
        DownloadManager.Query query = new DownloadManager.Query();
        //通过下载的id查找
        query.setFilterById(downloadId);
        Cursor cursor = downloadManager.query(query);
        if (cursor.moveToFirst()) {
            int status = cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_STATUS));
            switch (status) {
                //下载暂停
                case DownloadManager.STATUS_PAUSED:
                    break;
                //下载延迟
                case DownloadManager.STATUS_PENDING:
                    break;
                //正在下载
                case DownloadManager.STATUS_RUNNING:
                    break;
                //下载完成
                case DownloadManager.STATUS_SUCCESSFUL:
                    //下载完成安装APK
                    Log.i(TAG, "下载成功! path= " + pathstr);
                    if (listener != null) {
                        listener.onSuccess(pathstr);
                    }
                    cursor.close();
                    mContext.unregisterReceiver(receiver);
                    break;
                //下载失败
                case DownloadManager.STATUS_FAILED:
                    Log.i(TAG, "下载失败!");
                    if (listener != null) {
                        listener.onFailed();
                    }
                    cursor.close();
                    mContext.unregisterReceiver(receiver);
                    break;
            }
        }
    }

    public interface DownloadListener {
        void onSuccess(String path);

        void onFailed();
    }

    // 内部处理生命周期事件
    public void setLifecycleOwner(LifecycleOwner lifecycleOwner) {
        lifecycleOwner.getLifecycle().addObserver(this);
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    private void onDestroy() {
        Log.d(TAG, "onDestroy");
    }

    public static String getDefaultPathParent(Context context){
        return Objects.requireNonNull(context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS)).getAbsolutePath();
    }


    public static void UnZipFolder(File zipFileString, String outPathString) throws Exception {
        ZipInputStream inZip = new ZipInputStream(new FileInputStream(zipFileString));
        ZipEntry zipEntry;
        String szName = "";
        while ((zipEntry = inZip.getNextEntry()) != null) {
            szName = zipEntry.getName().replaceAll("bundle/", "");
            if (zipEntry.isDirectory()) {
                //获取部件的文件夹名
                szName = szName.substring(0, szName.length() - 1);
                Log.e(TAG, szName);
                File folder = new File(outPathString + File.separator + szName);
                folder.mkdirs();
            } else {
                Log.e(TAG, szName);
                Log.e(TAG, outPathString + File.separator + szName);
                File file = new File(outPathString + File.separator + szName);
                if (!file.exists()) {
                    Log.e(TAG, "Create the file:" + outPathString + File.separator + szName);
                    file.getParentFile().mkdirs();
                    file.createNewFile();
                }
                // 获取文件的输出流
                FileOutputStream out = new FileOutputStream(file);
                int len;
                byte[] buffer = new byte[1024];
                // 读取（字节）字节到缓冲区
                while ((len = inZip.read(buffer)) != -1) {
                    // 从缓冲区（0）位置写入（字节）字节
                    out.write(buffer, 0, len);
                    out.flush();
                }
                out.close();
            }
        }
        inZip.close();
    }


}
