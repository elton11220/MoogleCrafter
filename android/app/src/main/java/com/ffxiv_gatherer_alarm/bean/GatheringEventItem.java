package com.ffxiv_gatherer_alarm.bean;

public class GatheringEventItem {
    private Integer id;
    private String name;
    private int gatheringItemLevel;
    private String placeName;
    private int gatheringType;
    private double x;
    private double y;

    @Override
    public String toString() {
        return "GatheringEventItem{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", gatheringItemLevel=" + gatheringItemLevel +
                ", placeName='" + placeName + '\'' +
                ", gatheringType=" + gatheringType +
                ", x=" + x +
                ", y=" + y +
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

    public String getPlaceName() {
        return placeName;
    }

    public void setPlaceName(String placeName) {
        this.placeName = placeName;
    }

    public int getGatheringType() {
        return gatheringType;
    }

    public void setGatheringType(int gatheringType) {
        this.gatheringType = gatheringType;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public GatheringEventItem(Integer id, String name, int gatheringItemLevel, String placeName, int gatheringType, double x, double y) {
        this.id = id;
        this.name = name;
        this.gatheringItemLevel = gatheringItemLevel;
        this.placeName = placeName;
        this.gatheringType = gatheringType;
        this.x = x;
        this.y = y;
    }

    public GatheringEventItem(GatheringItem gatheringItem, GatheringPoint gatheringPoint) {
        this.id = gatheringItem.getId();
        this.name = gatheringItem.getName();
        this.gatheringItemLevel = gatheringItem.getGatheringItemLevel();
        this.placeName = gatheringPoint.getPlaceName();
        this.gatheringType = gatheringPoint.getGatheringType();
        this.x = gatheringPoint.getX();
        this.y = gatheringPoint.getY();
    }
}
