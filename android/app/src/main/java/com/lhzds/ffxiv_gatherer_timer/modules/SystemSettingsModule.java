package com.lhzds.ffxiv_gatherer_timer.modules;

import static com.lhzds.ffxiv_gatherer_timer.services.EorzeaEventNotificationService.EORZEA_EVENT_NOTIFICATION_CHANNEL_ID;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = SystemSettingsModule.NAME)
public class SystemSettingsModule extends ReactContextBaseJavaModule {
    public static final String NAME = "SystemSettings";

    private final ReactApplicationContext reactApplicationContext;

    public SystemSettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactApplicationContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void openScheduleExactAlarmSettings(Promise promise) {
        Intent intent = new Intent();
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.S) {
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.setAction(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
            reactApplicationContext.startActivity(intent);
            promise.resolve(null);
        } else {
            promise.reject(new Exception("当前SDK版本小于31，无需设置此功能"));
        }
    }

    @ReactMethod
    public void openApplicationDetailsSettings() {
        Intent intent = new Intent();
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.setData(Uri.fromParts("package", reactApplicationContext.getPackageName(), null));
        reactApplicationContext.startActivity(intent);
    }

    @ReactMethod
    public void openChannelNotificationSettings() {
        Intent intent = new Intent();
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setAction(Settings.ACTION_CHANNEL_NOTIFICATION_SETTINGS);
        intent.putExtra(Settings.EXTRA_APP_PACKAGE, reactApplicationContext.getPackageName());
        intent.putExtra(Settings.EXTRA_CHANNEL_ID, EORZEA_EVENT_NOTIFICATION_CHANNEL_ID);
        reactApplicationContext.startActivity(intent);
    }

    @ReactMethod
    public void openIgnoreBatteryOptimizationSettings() {
        Intent intent = new Intent();
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setAction(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
        reactApplicationContext.startActivity(intent);
    }
}
