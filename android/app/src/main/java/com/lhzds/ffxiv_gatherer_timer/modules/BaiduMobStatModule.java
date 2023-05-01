package com.lhzds.ffxiv_gatherer_timer.modules;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.baidu.mobstat.StatService;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.module.annotations.ReactModule;
import com.lhzds.ffxiv_gatherer_timer.BuildConfig;

import java.util.HashMap;

@ReactModule(name = BaiduMobStatModule.NAME)
public class BaiduMobStatModule extends ReactContextBaseJavaModule {
    public static final String NAME = "BaiduMobStat";

    private ReactApplicationContext reactApplicationContext;

    public BaiduMobStatModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        reactApplicationContext = reactContext;
        StatService.init(reactContext, appKey, appChannel);
        StatService.setAuthorizedState(reactContext, false);
        if (BuildConfig.DEBUG) {
            StatService.setDebugOn(true);
            String testDeviceId = StatService.getTestDeviceId(reactContext);
            Log.d("BaiduMobStat", "Test DeviceId : " + testDeviceId);
        }
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
    }

    public static final String appKey = "e56f416809";

    public static final String appChannel = "defaultChannel";

    private boolean isStatServiceStarted = false;

    @ReactMethod
    public void initStatService() {
        if (isStatServiceStarted) {
            return;
        }
        StatService.setAuthorizedState(reactApplicationContext, true);
        StatService.start(reactApplicationContext);
        isStatServiceStarted = true;
    }

    @ReactMethod
    public void initStatServiceInBrowseMode() {
        if (isStatServiceStarted) {
            return;
        }
        StatService.browseMode(true);
        StatService.start(reactApplicationContext);
        isStatServiceStarted = true;
    }

    @ReactMethod
    public void onPageStart(String name) {
        StatService.onPageStart(reactApplicationContext, name);
    }

    @ReactMethod
    public void onPageEnd(String name) {
        StatService.onPageEnd(reactApplicationContext, name);
    }

    @ReactMethod
    public void onEvent(String eventId, String label) {
        StatService.onEvent(reactApplicationContext, eventId, label);
    }

    @ReactMethod
    public void onEventWithAttributes(String eventId, String label, ReadableMap readableMap) {
        StatService.onEvent(reactApplicationContext, eventId, label, 1, getConvertedMap(readableMap));
    }

    @ReactMethod
    public void onEventStart(String eventId, String label) {
        StatService.onEventStart(reactApplicationContext, eventId, label);
    }

    @ReactMethod
    public void onEventEnd(String eventId, String label) {
        StatService.onEventEnd(reactApplicationContext, eventId, label);
    }

    @ReactMethod
    public void onEventEndWithAttributes(String eventId, String label, ReadableMap readableMap) {
        StatService.onEventEnd(reactApplicationContext, eventId, label, getConvertedMap(readableMap));
    }

    @ReactMethod
    public void onEventDuration(String eventId, String label, Integer milliseconds) {
        StatService.onEventDuration(reactApplicationContext, eventId, label, milliseconds.longValue());
    }

    @ReactMethod
    public void onEventDurationWithAttributes(String eventId, String label, Integer milliseconds, ReadableMap readableMap) {
        StatService.onEventDuration(reactApplicationContext, eventId, label, milliseconds.longValue(), getConvertedMap(readableMap));
    }

    private HashMap<String, String> getConvertedMap(ReadableMap readableMap) {
        HashMap<String, String> hashMap = null;
        if (readableMap == null) {
            return hashMap;
        }
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        if ((iterator != null) && (iterator.hasNextKey())) {
            hashMap = new HashMap<String, String>();
        }
        while (iterator.hasNextKey()) {
            try {
                String key = iterator.nextKey();
                String value = readableMap.getString(key);
                hashMap.put(key, value);
            } catch (Exception e) {
                // no to print
            }
        }

        return hashMap;
    }
}
