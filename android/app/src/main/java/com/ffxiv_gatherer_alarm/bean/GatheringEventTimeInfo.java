package com.ffxiv_gatherer_alarm.bean;

import java.util.Calendar;

public class GatheringEventTimeInfo {
    private Calendar startTimeEt;
    private Calendar startTimeLt;
    private Calendar endTimeEt;
    private Calendar endTimeLt;
    private TimePair rawStartTime;
    private TimePair rawDuration;
    private GatheringRarePopEventState state;

    @Override
    public String toString() {
        return "GatheringEvent{" +
                "startTimeEt=" + startTimeEt +
                ", startTimeLt=" + startTimeLt +
                ", endTimeEt=" + endTimeEt +
                ", endTimeLt=" + endTimeLt +
                ", rawStartTime=" + rawStartTime +
                ", rawDuration=" + rawDuration +
                ", state=" + state +
                '}';
    }

    public Calendar getStartTimeEt() {
        return startTimeEt;
    }

    public void setStartTimeEt(Calendar startTimeEt) {
        this.startTimeEt = startTimeEt;
    }

    public Calendar getStartTimeLt() {
        return startTimeLt;
    }

    public void setStartTimeLt(Calendar startTimeLt) {
        this.startTimeLt = startTimeLt;
    }

    public Calendar getEndTimeEt() {
        return endTimeEt;
    }

    public void setEndTimeEt(Calendar endTimeEt) {
        this.endTimeEt = endTimeEt;
    }

    public Calendar getEndTimeLt() {
        return endTimeLt;
    }

    public void setEndTimeLt(Calendar endTimeLt) {
        this.endTimeLt = endTimeLt;
    }

    public TimePair getRawStartTime() {
        return rawStartTime;
    }

    public void setRawStartTime(TimePair rawStartTime) {
        this.rawStartTime = rawStartTime;
    }

    public TimePair getRawDuration() {
        return rawDuration;
    }

    public void setRawDuration(TimePair rawDuration) {
        this.rawDuration = rawDuration;
    }

    public GatheringRarePopEventState getState() {
        return state;
    }

    public void setState(GatheringRarePopEventState state) {
        this.state = state;
    }

    public GatheringEventTimeInfo(Calendar startTimeEt, Calendar startTimeLt, Calendar endTimeEt, Calendar endTimeLt, TimePair rawStartTime, TimePair rawDuration, GatheringRarePopEventState state) {
        this.startTimeEt = startTimeEt;
        this.startTimeLt = startTimeLt;
        this.endTimeEt = endTimeEt;
        this.endTimeLt = endTimeLt;
        this.rawStartTime = rawStartTime;
        this.rawDuration = rawDuration;
        this.state = state;
    }
}
