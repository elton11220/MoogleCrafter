package com.ffxiv_gatherer_alarm.bean;

import java.util.ArrayList;
import java.util.List;

public class GatheringPoint {
    public static List<String> gatheringTypes = new ArrayList<>();
    static {
        gatheringTypes.add("采掘");
        gatheringTypes.add("碎石");
        gatheringTypes.add("采伐");
        gatheringTypes.add("割草");
    }
    private String placeName;
    private int gatheringType;
    private double x;
    private double y;
    private List<PoppingTime> timeTable;

    @Override
    public String toString() {
        return "GatheringPoint{" +
                "placeName='" + placeName + '\'' +
                ", gatheringType=" + gatheringType +
                ", x=" + x +
                ", y=" + y +
                ", timeTable=" + timeTable +
                '}';
    }

    public static List<String> getGatheringTypes() {
        return gatheringTypes;
    }

    public static void setGatheringTypes(List<String> gatheringTypes) {
        GatheringPoint.gatheringTypes = gatheringTypes;
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

    public List<PoppingTime> getTimeTable() {
        return timeTable;
    }

    public void setTimeTable(List<PoppingTime> timeTable) {
        this.timeTable = timeTable;
    }

    public GatheringPoint() {
    }

    public GatheringPoint(String placeName, int gatheringType, double x, double y, List<PoppingTime> timeTable) {
        this.placeName = placeName;
        this.gatheringType = gatheringType;
        this.x = x;
        this.y = y;
        this.timeTable = timeTable;
    }
}
