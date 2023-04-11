package com.lhzds.ffxiv_gatherer_timer.bean;

public class TimePair {
    private int hour;
    private int minute;

    @Override
    public String toString() {
        return "StartTime{" +
                "hour=" + hour +
                ", minute=" + minute +
                '}';
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

    public int getMinute() {
        return minute;
    }

    public void setMinute(int minute) {
        this.minute = minute;
    }

    public TimePair(int hour, int minute) {
        this.hour = hour;
        this.minute = minute;
    }

    public TimePair() {
    }
}
