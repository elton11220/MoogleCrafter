package com.lhzds.ffxiv_gatherer_timer.modules;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.provider.Settings;

import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.lhzds.ffxiv_gatherer_timer.services.EorzeaEventNotificationService;

@ReactModule(name = NotificationManagerModule.NAME)
public class NotificationManagerModule extends ReactContextBaseJavaModule {
    public static final String NAME = "NotificationManager";
    private final ReactApplicationContext reactApplicationContext;

    public NotificationManagerModule(ReactApplicationContext context) {
        super(context);
        reactApplicationContext = context;
    }

    @Override
    public String getName() {
        return NAME;
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
    public void getNotificationsEnabledStatus(Promise promise) {
        // Android SDK 26+ Only
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactApplicationContext);
        NotificationChannel eventNotificationServiceChannel = notificationManager.getNotificationChannel(EorzeaEventNotificationService.EORZEA_EVENT_NOTIFICATION_SERVICE_CHANNEL_ID);
        NotificationChannel eventNotificationChannel = notificationManager.getNotificationChannel(EorzeaEventNotificationService.EORZEA_EVENT_NOTIFICATION_CHANNEL_ID);

        boolean areNotificationsEnabled = notificationManager.areNotificationsEnabled();
        boolean isENSChannelEnabled = eventNotificationServiceChannel != null && eventNotificationServiceChannel.getImportance() != NotificationManager.IMPORTANCE_NONE;
        boolean isENChannelEnabled = eventNotificationChannel != null && eventNotificationChannel.getImportance() != NotificationManager.IMPORTANCE_NONE;

        WritableMap params = Arguments.createMap();
        params.putBoolean("areNotificationsEnabled", areNotificationsEnabled);
        params.putBoolean("isENSChannelEnabled", isENSChannelEnabled);
        params.putBoolean("isENChannelEnabled", isENChannelEnabled);

        promise.resolve(params);
    }
}
