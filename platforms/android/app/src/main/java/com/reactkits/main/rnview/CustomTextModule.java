package com.reactkits.main.rnview;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class CustomTextModule extends ReactContextBaseJavaModule {

    public CustomTextModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "CustomText";
    }

    @ReactMethod
    public void show(String msg) {
        Toast.makeText(getReactApplicationContext(), "custom: " + msg, Toast.LENGTH_LONG).show();
    }
}
