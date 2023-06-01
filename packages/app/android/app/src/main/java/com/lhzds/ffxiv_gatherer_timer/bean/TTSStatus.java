package com.lhzds.ffxiv_gatherer_timer.bean;

public enum TTSStatus {
    UNINITIALIZED(0),
    WORKING(1),
    LANG_NOT_SUPPORT(2),
    FAILED(3);
    private int value;

    public int getValue() {
        return this.value;
    }

    TTSStatus(int value) {
        this.value = value;
    }
}
