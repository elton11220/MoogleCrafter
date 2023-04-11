package com.lhzds.ffxiv_gatherer_timer.modules;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

@ReactModule(name = ActivityAndroidModule.NAME)
public class ActivityAndroidModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    public static final String NAME = "ActivityAndroidModule";
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
        return NAME;
    }
}
