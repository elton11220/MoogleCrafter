package com.ffxiv_gatherer_alarm.modules;

import static com.ffxiv_gatherer_alarm.services.EorzeaEventNotificationService.EORZEA_EVENT_NOTIFICATION_CHANNEL_ID;
import static com.ffxiv_gatherer_alarm.services.EorzeaEventNotificationService.EORZEA_EVENT_NOTIFICATION_SERVICE_CHANNEL_ID;

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
    public void getNotificationsEnabledStatus(Promise promise) {
        // Android SDK 26+ Only
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactApplicationContext);
        NotificationChannel eventNotificationServiceChannel = notificationManager.getNotificationChannel(EORZEA_EVENT_NOTIFICATION_SERVICE_CHANNEL_ID);
        NotificationChannel eventNotificationChannel = notificationManager.getNotificationChannel(EORZEA_EVENT_NOTIFICATION_CHANNEL_ID);

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
