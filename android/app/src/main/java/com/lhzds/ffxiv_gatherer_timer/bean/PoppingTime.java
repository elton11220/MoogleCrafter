package com.lhzds.ffxiv_gatherer_timer.bean;

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

    public PoppingTime(TimePair startTime, TimePair duration) {
        this.startTime = startTime.getHour() * 100 + startTime.getMinute();
        this.duration = duration.getHour() * 100 + duration.getMinute();
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
