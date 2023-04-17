package com.lhzds.ffxiv_gatherer_timer;

import static com.lhzds.ffxiv_gatherer_timer.modules.EorzeaEventNotificationModule.NOTIFICATION_PRESS_ACTION;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

public class TrampolineActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        int gatheringEventItem = getIntent().getIntExtra("gatheringItemId", -1);
        Intent intent = new Intent(NOTIFICATION_PRESS_ACTION);
        intent.putExtra("gatheringItemId", gatheringEventItem);
        sendBroadcast(intent);
        Intent mainActivityIntent = new Intent(this, MainActivity.class);
        mainActivityIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(mainActivityIntent);
        finish();
    }
}