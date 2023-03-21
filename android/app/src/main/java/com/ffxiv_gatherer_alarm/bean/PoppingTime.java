package com.ffxiv_gatherer_alarm.bean;

public class PoppingTime {
    private int startTime;
    private int duration;

    @Override
    public String toString() {
        return "PoppingTime{" +
                "startTime=" + startTime +
                ", duration=" + duration +
                '}';
    }

    public PoppingTime(int startTime, int duration) {
        this.startTime = startTime;
        this.duration = duration;
    }

    public int getStartTime() {
        return startTime;
    }

    public void setStartTime(int startTime) {
        this.startTime = startTime;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }
}
