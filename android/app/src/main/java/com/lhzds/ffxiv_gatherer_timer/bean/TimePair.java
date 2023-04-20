package com.lhzds.ffxiv_gatherer_timer.bean;

public class TimePair {
    private int hour;
    private int minute;
    private boolean nextDay;

    @Override
    public String toString() {
        return "TimePair{" +
                "hour=" + hour +
                ", minute=" + minute +
                ", nextDay=" + nextDay +
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

    public boolean isNextDay() {
        return nextDay;
    }

    public void setNextDay(boolean nextDay) {
        this.nextDay = nextDay;
    }

    public TimePair(int hour, int minute) {
        this.hour = hour;
        this.minute = minute;
        nextDay = false;
    }

    public TimePair(int hour, int minute, boolean nextDay) {
        this.hour = hour;
        this.minute = minute;
        this.nextDay = nextDay;
    }

    public TimePair() {
        this.hour = 0;
        this.minute = 0;
        this.nextDay = false;
    }
}
