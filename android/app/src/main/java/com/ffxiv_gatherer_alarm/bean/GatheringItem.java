package com.ffxiv_gatherer_alarm.bean;

import java.util.List;

public class GatheringItem {
    private Integer id;
    private String name;
    private int gatheringItemLevel;
    private List<GatheringPoint> gatheringPoints;

    @Override
    public String toString() {
        return "GatheringItem{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", gatheringItemLevel=" + gatheringItemLevel +
                ", gatheringPoints=" + gatheringPoints +
                '}';
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getGatheringItemLevel() {
        return gatheringItemLevel;
    }

    public void setGatheringItemLevel(int gatheringItemLevel) {
        this.gatheringItemLevel = gatheringItemLevel;
    }

    public List<GatheringPoint> getGatheringPoints() {
        return gatheringPoints;
    }

    public void setGatheringPoints(List<GatheringPoint> gatheringPoints) {
        this.gatheringPoints = gatheringPoints;
    }

    public GatheringItem(Integer id, String name, int gatheringItemLevel, List<GatheringPoint> gatheringPoints) {
        this.id = id;
        this.name = name;
        this.gatheringItemLevel = gatheringItemLevel;
        this.gatheringPoints = gatheringPoints;
    }
}
