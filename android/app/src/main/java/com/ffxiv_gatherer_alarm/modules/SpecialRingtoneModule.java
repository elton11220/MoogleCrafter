package com.ffxiv_gatherer_alarm.modules;

import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.SoundPool;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.widget.Toast;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.ffxiv_gatherer_alarm.R;
import com.ffxiv_gatherer_alarm.bean.ExVersion;
import com.ffxiv_gatherer_alarm.bean.NotificationMode;
import com.ffxiv_gatherer_alarm.bean.TTSStatus;

import java.util.Locale;

@ReactModule(name = SpecialRingtoneModule.NAME)
public class SpecialRingtoneModule extends ReactContextBaseJavaModule implements TextToSpeech.OnInitListener {
    public static final String NAME = "SpecialRingtone";
    private final ReactApplicationContext reactApplicationContext;
    private NotificationMode notificationMode = NotificationMode.SIMPLE;
    private final SoundPool soundPool;
    private final Integer simple_audio; // FFXIV_Incoming_Tell_1
    private final Integer realm_reborn_audio; // 2.0
    private final Integer heaven_sward_audio; // 3.0
    private final Integer storm_blood_audio; // 4.0
    private final Integer shadow_bringers_audio; // 5.0
    private final Integer end_walker_audio; // 6.0
    private TTSStatus ttsStatus = TTSStatus.UNINITIALIZED;
    private final TextToSpeech textToSpeech;

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

        textToSpeech = new TextToSpeech(reactContext, this);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        textToSpeech.stop();
        textToSpeech.shutdown();
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            int langSupport = textToSpeech.setLanguage(Locale.CHINA);
            if (langSupport != TextToSpeech.LANG_AVAILABLE && langSupport != TextToSpeech.LANG_COUNTRY_AVAILABLE) {
                Toast.makeText(reactApplicationContext, "本机TTS不支持中文", Toast.LENGTH_SHORT).show();
                ttsStatus = TTSStatus.LANG_NOT_SUPPORT;
            } else {
                ttsStatus = TTSStatus.WORKING;
            }
        } else {
            Toast.makeText(reactApplicationContext, "TTS引擎初始化失败", Toast.LENGTH_SHORT).show();
            ttsStatus = TTSStatus.FAILED;
        }
    }

    public void speakWithTTS(String content) {
        if (ttsStatus == TTSStatus.WORKING) {
            Bundle ttsOptions = new Bundle();
            ttsOptions.putInt(TextToSpeech.Engine.KEY_PARAM_STREAM, AudioManager.STREAM_NOTIFICATION);
            textToSpeech.speak(content, TextToSpeech.QUEUE_ADD, ttsOptions, String.valueOf(System.currentTimeMillis()));
        }
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

    public TTSStatus getTTSStatus() {
        return ttsStatus;
    }

    public NotificationMode getNotificationMode() {
        return notificationMode;
    }

    @ReactMethod
    public void speakWithTTS(String content, Promise promise) {
        if (ttsStatus == TTSStatus.WORKING) {
            speakWithTTS(content);
            promise.resolve(null);
        } else {
            promise.reject(new Exception("TTS is not working"));
        }
    }

    @ReactMethod
    public void getTTSStatus(Promise promise) {
        promise.resolve(ttsStatus.getValue());
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
