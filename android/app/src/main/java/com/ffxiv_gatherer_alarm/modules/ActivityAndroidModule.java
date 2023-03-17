package com.ffxiv_gatherer_alarm.modules;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class ActivityAndroidModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private ReactApplicationContext reactApplicationContext;

    public ActivityAndroidModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactApplicationContext = reactContext;
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public void onHostResume() {
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onActivityResume", null);
    }

    @Override
    public void onHostPause() {
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onActivityPause", null);
    }

    @Override
    public void onHostDestroy() {
    }

    @NonNull
    @Override
    public String getName() {
        return "ActivityAndroidModule";
    }
}
