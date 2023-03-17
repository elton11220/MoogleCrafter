package com.ffxiv_gatherer_alarm.modules;

import android.content.Intent;
import android.provider.Settings;

import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NotificationManagerModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactApplicationContext;

    public NotificationManagerModule(ReactApplicationContext context) {
        super(context);
        reactApplicationContext = context;
    }

    @Override
    public String getName() {
        return "NotificationManager";
    }

    @ReactMethod
    public void openNotificationSettings() {
        // Android SDK 26+ Only
        Intent intent = new Intent();
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setAction(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
        intent.putExtra(Settings.EXTRA_APP_PACKAGE, reactApplicationContext.getPackageName());
        reactApplicationContext.startActivity(intent);
    }

    @ReactMethod
    public void areNotificationsEnabled(Promise promise) {
        boolean areNotificationsEnabled = NotificationManagerCompat.from(reactApplicationContext).areNotificationsEnabled();
        promise.resolve(areNotificationsEnabled);
    }
}
