package com.ffxiv_gatherer_alarm.bean;

import java.util.LinkedHashMap;

public class GatheringEvent {
    GatheringEventTimeInfo timeInfo;
    LinkedHashMap<Integer, GatheringEventItem> items;

    @Override
    public String toString() {
        return "GatheringEvent{" +
                "timeInfo=" + timeInfo +
                ", items=" + items +
                '}';
    }

    public GatheringEventTimeInfo getTimeInfo() {
        return timeInfo;
    }

    public void setTimeInfo(GatheringEventTimeInfo timeInfo) {
        this.timeInfo = timeInfo;
    }

    public LinkedHashMap<Integer, GatheringEventItem> getItems() {
        return items;
    }

    public void setItems(LinkedHashMap<Integer, GatheringEventItem> items) {
        this.items = items;
    }

    public GatheringEvent() {
    }

    public GatheringEvent(GatheringEventTimeInfo timeInfo, LinkedHashMap<Integer, GatheringEventItem> items) {
        this.timeInfo = timeInfo;
        this.items = items;
    }
}
