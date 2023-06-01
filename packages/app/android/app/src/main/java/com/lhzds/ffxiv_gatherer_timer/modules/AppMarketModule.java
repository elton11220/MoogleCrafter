package com.lhzds.ffxiv_gatherer_timer.modules;

import android.content.Intent;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = AppMarketModule.NAME)
public class AppMarketModule extends ReactContextBaseJavaModule {
    public final static String NAME = "AppMarket";

    private final ReactApplicationContext reactApplicationContext;

    public AppMarketModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        reactApplicationContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void openAppDetailsInAppMarket() {
        Intent marketIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + reactApplicationContext.getPackageName()));
        marketIntent.addCategory(Intent.CATEGORY_DEFAULT);
        Intent chooserIntent = Intent.createChooser(marketIntent, "");
        chooserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactApplicationContext.startActivity(chooserIntent);
    }
}
