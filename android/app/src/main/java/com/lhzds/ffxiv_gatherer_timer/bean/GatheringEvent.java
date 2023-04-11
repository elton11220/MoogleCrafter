package com.lhzds.ffxiv_gatherer_timer.bean;

import java.util.HashMap;
import java.util.LinkedHashMap;

public class GatheringEvent {
    GatheringEventTimeInfo timeInfo;
    LinkedHashMap<Integer, GatheringEventItem> items;
    HashMap<Integer, Integer> itemExVersionCounts = new HashMap<>();

    @Override
    public String toString() {
        return "GatheringEvent{" +
                "timeInfo=" + timeInfo +
                ", items=" + items +
                ", itemExVersionCounts=" + itemExVersionCounts +
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

    public HashMap<Integer, Integer> getItemExVersionCounts() {
        return itemExVersionCounts;
    }

    public void setItemExVersionCounts(HashMap<Integer, Integer> itemExVersionCounts) {
        this.itemExVersionCounts = itemExVersionCounts;
    }

    public GatheringEvent() {
    }

    public GatheringEvent(GatheringEventTimeInfo timeInfo, LinkedHashMap<Integer, GatheringEventItem> items, HashMap<Integer, Integer> itemExVersionCounts) {
        this.timeInfo = timeInfo;
        this.items = items;
        this.itemExVersionCounts = itemExVersionCounts;
    }
}
