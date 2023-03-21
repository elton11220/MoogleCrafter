package com.ffxiv_gatherer_alarm.modules;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.ffxiv_gatherer_alarm.services.EorzeaEventNotificationService;

public class EorzeaEventNotificationModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    public final ReactApplicationContext reactApplicationContext;

    private ServiceConnection eorzeaEventNotificationServiceConn = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            eorzeaEventNotificationServiceBinder = (EorzeaEventNotificationService.LocalBinder) iBinder;
            eorzeaEventNotificationServiceBound = true;
            sendEvent(reactApplicationContext, "onENServiceBound", null);
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            eorzeaEventNotificationServiceBound = false;
            sendEvent(reactApplicationContext, "onENServiceUnbound", null);
        }
    };

    private EorzeaEventNotificationService.LocalBinder eorzeaEventNotificationServiceBinder;
    private boolean eorzeaEventNotificationServiceBound = false;

    public EorzeaEventNotificationModule(ReactApplicationContext context) {
        super(context);
        reactApplicationContext = context;
        context.addLifecycleEventListener(this);
    }

    @Override
    public String getName() {
        return "EorzeaEventNotification";
    }

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        if (eorzeaEventNotificationServiceBound) {
            reactApplicationContext.unbindService(eorzeaEventNotificationServiceConn);
            eorzeaEventNotificationServiceBound = false;
        }
        reactApplicationContext.stopService(new Intent(reactApplicationContext, EorzeaEventNotificationService.class));
    }

    private void sendEvent(ReactContext context, String eventName, @Nullable WritableMap params) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

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
            sendEvent(reactApplicationContext, "onENServiceBound", null);
        }
    }
}
