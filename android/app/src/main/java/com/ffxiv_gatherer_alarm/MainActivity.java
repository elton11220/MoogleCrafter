package com.ffxiv_gatherer_alarm;

import static com.ffxiv_gatherer_alarm.services.EorzeaEventNotificationService.EORZEA_EVENT_NOTIFICATION_CHANNEL_ID;
import static com.ffxiv_gatherer_alarm.services.EorzeaEventNotificationService.EORZEA_EVENT_NOTIFICATION_SERVICE_CHANNEL_ID;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.os.Bundle;

import androidx.core.view.WindowCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.ffxiv_gatherer_alarm.services.EorzeaEventNotificationService;

import org.devio.rn.splashscreen.SplashScreen;

import androidx.appcompat.app.AppCompatDelegate;

public class MainActivity extends ReactActivity {
    //react-native-screens override
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);

        NotificationChannel serviceChannel = new NotificationChannel(EORZEA_EVENT_NOTIFICATION_SERVICE_CHANNEL_ID, "采集事件监控服务", NotificationManager.IMPORTANCE_DEFAULT);
        serviceChannel.setDescription("用于监控采集事件并在事件发生时激活应用内全屏提醒并推送系统通知");
        serviceChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        serviceChannel.setShowBadge(false);

        NotificationChannel eventNotificationChannel = new NotificationChannel(EORZEA_EVENT_NOTIFICATION_CHANNEL_ID, "采集事件通知", NotificationManager.IMPORTANCE_DEFAULT);
        serviceChannel.setDescription("采集事件发生时推送系统通知");
        serviceChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        notificationManager.createNotificationChannel(serviceChannel);
        notificationManager.createNotificationChannel(eventNotificationChannel);

        Intent initEorzeaNotificationServiceIntent = new Intent(MainActivity.this, EorzeaEventNotificationService.class);
        startForegroundService(initEorzeaNotificationServiceIntent);

        SplashScreen.show(this, true);
        super.onCreate(null);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ffxiv_gatherer_alarm";
    }

    /**
     * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
     * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
     * (aka React 18) with two boolean flags.
     */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
                this,
                getMainComponentName(),
                // If you opted-in for the New Architecture, we enable the Fabric Renderer.
                DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
                // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
                DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        );
    }
}
