package com.ffxiv_gatherer_alarm.modules;

import android.media.AudioAttributes;
import android.media.SoundPool;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.ffxiv_gatherer_alarm.R;
import com.ffxiv_gatherer_alarm.bean.ExVersion;
import com.ffxiv_gatherer_alarm.bean.NotificationMode;

public class SpecialRingtoneModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactApplicationContext;
    private NotificationMode notificationMode = NotificationMode.SIMPLE;
    private SoundPool soundPool;
    private Integer simple_audio; // FFXIV_Incoming_Tell_1
    private Integer realm_reborn_audio; // 2.0
    private Integer heaven_sward_audio; // 3.0
    private Integer storm_blood_audio; // 4.0
    private Integer shadow_bringers_audio; // 5.0
    private Integer end_walker_audio; // 6.0

    public SpecialRingtoneModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactApplicationContext = reactContext;

        AudioAttributes audioAttributesBuilder = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build();
        soundPool = new SoundPool.Builder()
                .setMaxStreams(6)
                .setAudioAttributes(audioAttributesBuilder)
                .build();
        simple_audio = soundPool.load(reactContext, R.raw.simple_audio, 1);
        realm_reborn_audio = soundPool.load(reactContext, R.raw.relam_reborn_accepted, 1);
        heaven_sward_audio = soundPool.load(reactContext, R.raw.heaven_sward_accepted, 1);
        storm_blood_audio = soundPool.load(reactContext, R.raw.storm_blood_accepted, 1);
        shadow_bringers_audio = soundPool.load(reactContext, R.raw.shadow_bringers_accepted, 1);
        end_walker_audio = soundPool.load(reactContext, R.raw.end_walker_accepted, 1);
    }

    @Override
    public String getName() {
        return "SpecialRingtone";
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
    }

    public void playSound(ExVersion exVersion) {
        if (soundPool != null) {
            if (exVersion == ExVersion.REALM_REBORN) {
                soundPool.play(realm_reborn_audio, 1, 1, 1, 0, 1.0f);
            } else if (exVersion == ExVersion.HEAVEN_SWARD) {
                soundPool.play(heaven_sward_audio, 1, 1, 1, 0, 1.0f);
            } else if (exVersion == ExVersion.STORM_BLOOD) {
                soundPool.play(storm_blood_audio, 1, 1, 1, 0, 1.0f);
            } else if (exVersion == ExVersion.SHADOW_BRINGERS) {
                soundPool.play(shadow_bringers_audio, 1, 1, 1, 0, 1.0f);
            } else if (exVersion == ExVersion.END_WALKER) {
                soundPool.play(end_walker_audio, 1, 1, 1, 0, 1.0f);
            }
        }
    }

    public void playSimpleSound() {
        if (soundPool != null) {
            soundPool.play(simple_audio, 1, 1, 1, 0, 1.0f);
        }
    }

    public void setNotificationMode(NotificationMode notificationMode) {
        this.notificationMode = notificationMode;
    }

    @ReactMethod
    public void setNotificationMode(int mode) {
        if (mode == 0) {
            setNotificationMode(NotificationMode.OFF);
        } else if (mode == 1) {
            setNotificationMode(NotificationMode.SIMPLE);
        } else if (mode == 2) {
            setNotificationMode(NotificationMode.TTS);
        } else if (mode == 3) {
            setNotificationMode(NotificationMode.EORZEA_THEME);
        }
    }

    @ReactMethod
    public void playSimpleSound(Promise promise) {
        if (soundPool != null) {
            playSimpleSound();
            promise.resolve(null);
        } else {
            promise.reject(new Exception("soundPool has not been initialized"));
        }
    }

    @ReactMethod
    public void playSound(int exVersion, Promise promise) {
        if (exVersion == 0) {
            playSound(ExVersion.REALM_REBORN);
            promise.resolve(null);
        } else if (exVersion == 1) {
            playSound(ExVersion.HEAVEN_SWARD);
            promise.resolve(null);
        } else if (exVersion == 2) {
            playSound(ExVersion.STORM_BLOOD);
            promise.resolve(null);
        } else if (exVersion == 3) {
            playSound(ExVersion.SHADOW_BRINGERS);
            promise.resolve(null);
        } else if (exVersion == 4) {
            playSound(ExVersion.END_WALKER);
            promise.resolve(null);
        } else {
            promise.reject(new Exception("exVersion not found"));
        }
    }
}
