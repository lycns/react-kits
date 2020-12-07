package com.reactkits.main.rnview;

import android.graphics.Color;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.text.ReactTextView;


public class CustomTextManager extends SimpleViewManager<ReactTextView> {
    @NonNull
    @Override
    public String getName() {
        return "CustomViewx";
    }

    @NonNull
    @Override
    protected ReactTextView createViewInstance(@NonNull ThemedReactContext reactContext) {
        ReactTextView textView = new ReactTextView(reactContext);
        return textView;
    }

    @ReactProp(name = "text")
    public void setText(ReactTextView view, String text) {
        view.setText("custom: " + text);
    }

    @ReactProp(name = "color")
    public void setColorx(ReactTextView view, String color) {
        view.setTextColor(Color.parseColor(color));
    }
}
