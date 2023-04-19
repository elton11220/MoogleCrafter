package com.lhzds.ffxiv_gatherer_timer.modules;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CustomNativePackage implements ReactPackage {

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactApplicationContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ActivityAndroidModule(reactApplicationContext));
        modules.add(new NotificationManagerModule(reactApplicationContext));
        modules.add(new EorzeaEventNotificationModule(reactApplicationContext));
        modules.add(new SpecialRingtoneModule(reactApplicationContext));
        modules.add(new SystemSettingsModule(reactApplicationContext));
        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactApplicationContext) {
        return Collections.emptyList();
    }
}
