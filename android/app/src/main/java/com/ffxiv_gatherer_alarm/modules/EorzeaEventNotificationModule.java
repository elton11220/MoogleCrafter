package com.ffxiv_gatherer_alarm.modules;

import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.widget.Toast;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.ffxiv_gatherer_alarm.MainActivity;
import com.ffxiv_gatherer_alarm.bean.ExVersion;
import com.ffxiv_gatherer_alarm.bean.GatheringEvent;
import com.ffxiv_gatherer_alarm.bean.GatheringEventItem;
import com.ffxiv_gatherer_alarm.bean.GatheringItem;
import com.ffxiv_gatherer_alarm.bean.NotificationMode;
import com.ffxiv_gatherer_alarm.services.EorzeaEventNotificationService;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;

import java.util.List;
import java.util.Map;

@ReactModule(name = EorzeaEventNotificationModule.NAME)
public class EorzeaEventNotificationModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    public static final String NAME = "EorzeaEventNotification";

    public static String GATHERING_EVENT_TRIGGERED_ACTION = "com.elton11220.ffxiv_gatherer_timer.GATHERING_EVENT_TRIGGERED";
    public static String NOTIFICATION_PRESS_ACTION = "com.elton11220.ffxiv_gatherer_timer.NOTIFICATION_PRESSED";

    public final ReactApplicationContext reactApplicationContext;

    private ServiceConnection eorzeaEventNotificationServiceConn = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            eorzeaEventNotificationServiceBinder = (EorzeaEventNotificationService.LocalBinder) iBinder;
            eorzeaEventNotificationServiceBound = true;
            sendEvent(reactApplicationContext, "onENServiceBound");
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            eorzeaEventNotificationServiceBound = false;
            sendEvent(reactApplicationContext, "onENServiceUnbound");
        }
    };

    private EorzeaEventNotificationService.LocalBinder eorzeaEventNotificationServiceBinder;
    private boolean eorzeaEventNotificationServiceBound = false;

    private class GatheringEventReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            GatheringEvent currentEvent = eorzeaEventNotificationServiceBinder.getCurrentEvent();
            if (currentEvent != null) {
                // Special Ringtone
                SpecialRingtoneModule specialRingtoneModule = reactApplicationContext.getNativeModule(SpecialRingtoneModule.class);
                NotificationMode notificationMode = specialRingtoneModule.getNotificationMode();
                if (notificationMode == NotificationMode.SIMPLE) {
                    specialRingtoneModule.playSimpleSound();
                } else if (notificationMode == NotificationMode.TTS) {
                    for (GatheringEventItem gatheringEventItem : currentEvent.getItems().values()) {
                        StringBuilder stringBuilder = new StringBuilder();
                        stringBuilder.append(gatheringEventItem.getGatheringItemLevel())
                                .append("级 ")
                                .append(gatheringEventItem.getPlaceName())
                                .append(" ")
                                .append(gatheringEventItem.getName());
                        specialRingtoneModule.speakWithTTS(stringBuilder.toString());
                    }
                } else if (notificationMode == NotificationMode.EORZEA_THEME) {
                    int mostExVersion = 0;
                    int maxCount = -1;
                    for (Map.Entry<Integer, Integer> entry : currentEvent.getItemExVersionCounts().entrySet()) {
                        if (entry.getValue() != 0) {
                            if (maxCount == -1) {
                                maxCount = entry.getValue();
                                mostExVersion = entry.getKey();
                            } else {
                                if (entry.getValue() > maxCount) {
                                    maxCount = entry.getValue();
                                    mostExVersion = entry.getKey();
                                }
                            }
                        }
                    }
                    if (mostExVersion == 0) {
                        specialRingtoneModule.playSound(ExVersion.REALM_REBORN);
                    } else if (mostExVersion == 1) {
                        specialRingtoneModule.playSound(ExVersion.HEAVEN_SWARD);
                    } else if (mostExVersion == 2) {
                        specialRingtoneModule.playSound(ExVersion.STORM_BLOOD);
                    } else if (mostExVersion == 3) {
                        specialRingtoneModule.playSound(ExVersion.SHADOW_BRINGERS);
                    } else if (mostExVersion == 4) {
                        specialRingtoneModule.playSound(ExVersion.END_WALKER);
                    }
                }
                //

                WritableArray writableArray = Arguments.createArray();
                for (Map.Entry<Integer, GatheringEventItem> gatheringEventItemEntry : currentEvent.getItems().entrySet()) {
                    writableArray.pushInt(gatheringEventItemEntry.getValue().getId());
                }
                sendEvent(reactApplicationContext, "gatheringEventTriggered", writableArray);
            }
            if (eorzeaEventNotificationServiceBinder != null) {
                eorzeaEventNotificationServiceBinder.performNextEvent();
            }
        }
    }

    private class NotificationPressReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            int gatheringItemId = intent.getIntExtra("gatheringItemId", -1);
            Intent resumeActivityIntent = new Intent(context, MainActivity.class);
            resumeActivityIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(resumeActivityIntent);
            if (gatheringItemId > -1) {
                WritableMap params = Arguments.createMap();
                params.putInt("gatheringItemId", gatheringItemId);
                sendEvent(reactApplicationContext, "backFromNotification", params);
            }
        }
    }

    private GatheringEventReceiver gatheringEventReceiver;
    private NotificationPressReceiver notificationPressReceiver;

    public EorzeaEventNotificationModule(ReactApplicationContext context) {
        super(context);
        reactApplicationContext = context;
        context.addLifecycleEventListener(this);

        gatheringEventReceiver = new GatheringEventReceiver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(GATHERING_EVENT_TRIGGERED_ACTION);
        context.registerReceiver(gatheringEventReceiver, intentFilter);

        notificationPressReceiver = new NotificationPressReceiver();
        IntentFilter intentFilter1 = new IntentFilter();
        intentFilter1.addAction(NOTIFICATION_PRESS_ACTION);
        context.registerReceiver(notificationPressReceiver, intentFilter1);
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        reactApplicationContext.unregisterReceiver(gatheringEventReceiver);
        reactApplicationContext.unregisterReceiver(notificationPressReceiver);
        stopService();
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        stopService();
    }

    private void stopService() {
        if (eorzeaEventNotificationServiceBound) {
            reactApplicationContext.unbindService(eorzeaEventNotificationServiceConn);
            eorzeaEventNotificationServiceBound = false;
        }
        reactApplicationContext.stopService(new Intent(reactApplicationContext, EorzeaEventNotificationService.class));
    }

    private void sendEvent(ReactContext context, String eventName, WritableMap params) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    private void sendEvent(ReactContext context, String eventName, WritableArray params) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    private void sendEvent(ReactContext context, String eventName) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, null);
    }

    private final Gson gson = new Gson();

    @ReactMethod
    public void isServiceReady(Promise promise) {
        promise.resolve(this.eorzeaEventNotificationServiceBound);
    }

    @ReactMethod
    public void bindService() {
        if (!eorzeaEventNotificationServiceBound) {
            Intent bindServiceIntent = new Intent(reactApplicationContext, EorzeaEventNotificationService.class);
            reactApplicationContext.bindService(bindServiceIntent, eorzeaEventNotificationServiceConn, Context.BIND_AUTO_CREATE);
        } else {
            sendEvent(reactApplicationContext, "onENServiceBound");
        }
    }

    @ReactMethod
    public void addSubscription(String gatheringItemsJson) {
        new Thread(() -> {
            try {
                List<GatheringItem> gatheringItems = gson.fromJson(gatheringItemsJson, new TypeToken<List<GatheringItem>>() {
                }.getType());
                if (eorzeaEventNotificationServiceBound) {
                    eorzeaEventNotificationServiceBinder.addGatheringEvents(gatheringItems);
                }
            } catch (JsonParseException e) {
                Toast.makeText(reactApplicationContext, "采集事件信息解析失败", Toast.LENGTH_SHORT).show();
            }
        }).start();
    }

    @ReactMethod
    public void removeSubscription(String gatheringItemsJson) {
        new Thread(() -> {
            try {
                List<GatheringItem> gatheringItems = gson.fromJson(gatheringItemsJson, new TypeToken<List<GatheringItem>>() {
                }.getType());
                if (eorzeaEventNotificationServiceBound) {
                    eorzeaEventNotificationServiceBinder.removeGatheringEvents(gatheringItems);
                }
            } catch (JsonParseException e) {
                Toast.makeText(reactApplicationContext, "采集事件信息解析失败", Toast.LENGTH_SHORT).show();
            }
        }).start();
    }
}
