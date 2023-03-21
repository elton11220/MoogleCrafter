package com.ffxiv_gatherer_alarm.services;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;

import androidx.core.app.NotificationCompat;

import com.ffxiv_gatherer_alarm.R;
import com.ffxiv_gatherer_alarm.bean.EorzeaEventManager;

public class EorzeaEventNotificationService extends Service {
    public static final String EORZEA_EVENT_NOTIFICATION_SERVICE_CHANNEL_ID = "EorzeaEventNotificationService";

    public static final String EORZEA_EVENT_NOTIFICATION_CHANNEL_ID = "EorzeaEventNotification";

    private EorzeaEventManager eorzeaEventManager;

    public EorzeaEventNotificationService() {
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Notification notification = new NotificationCompat.Builder(this, EORZEA_EVENT_NOTIFICATION_SERVICE_CHANNEL_ID)
                .setContentTitle("采集事件监控服务")
                .setContentText("正在为您监控采集事件")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setOngoing(true)
                .setShowWhen(false)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .build();
        startForeground(1, notification);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    @Override
    public boolean onUnbind(Intent intent) {
        stopForeground(STOP_FOREGROUND_DETACH);
        return super.onUnbind(intent);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_NOT_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return localBinder;
    }

    private LocalBinder localBinder = new LocalBinder();

    public class LocalBinder extends Binder {

    }
}