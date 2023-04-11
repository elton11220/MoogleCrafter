package com.lhzds.ffxiv_gatherer_timer.bean;

import java.util.List;

public class GatheringItem {
    private Integer id;
    private String name;
    private int gatheringItemLevel;
    private int exVersion;
    private List<GatheringPoint> gatheringPoints;

    @Override
    public String toString() {
        return "GatheringItem{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", gatheringItemLevel=" + gatheringItemLevel +
                ", exVersion=" + exVersion +
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

    public int getExVersion() {
        return exVersion;
    }

    public void setExVersion(int exVersion) {
        this.exVersion = exVersion;
    }

    public GatheringItem(Integer id, String name, int gatheringItemLevel, int exVersion, List<GatheringPoint> gatheringPoints) {
        this.id = id;
        this.name = name;
        this.gatheringItemLevel = gatheringItemLevel;
        this.exVersion = exVersion;
        this.gatheringPoints = gatheringPoints;
    }
}
