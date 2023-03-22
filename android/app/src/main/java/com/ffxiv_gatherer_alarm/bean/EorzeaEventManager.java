package com.ffxiv_gatherer_alarm.bean;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;


public class EorzeaEventManager {
    public static final BigDecimal EORZEA_CONVERT_CONSTANT = new BigDecimal("20.571428571428573");

    public static final int INVALID_START_TIME = 65535;

    public static Calendar computeEorzeaDate(Date date) {
        long unixTime = (long) Math.floor(new BigDecimal(date.getTime()).multiply(EORZEA_CONVERT_CONSTANT).doubleValue());
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeZone(TimeZone.getTimeZone("UTC"));
        calendar.setTimeInMillis(unixTime);
        return calendar;
    }

    public static Calendar computeLocalDate(Calendar date) {
        long unixTime = new BigDecimal(date.getTimeInMillis()).divide(EORZEA_CONVERT_CONSTANT, RoundingMode.HALF_UP).longValue();
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeZone(TimeZone.getTimeZone("UTC"));
        calendar.setTimeInMillis(unixTime);
        return calendar;
    }

    public static TimePair parseTimePair(int startTime) {
        if (startTime == INVALID_START_TIME) {
            return null;
        }
        if (startTime == 0) {
            return new TimePair();
        }
        int hour = (int) Math.floor(startTime / 100.0);
        int minute = startTime % 100;
        if (minute >= 60) {
            hour += (int) Math.floor(minute / 60.0);
            minute = minute % 60;
        }
        return new TimePair(hour, minute);
    }

    public static GatheringEventTimeInfo initGatheringEventTimeInfo(PoppingTime poppingTime) {
        Calendar currentEt = computeEorzeaDate(new Date());
        TimePair startTime = parseTimePair(poppingTime.getStartTime());
        TimePair duration = parseTimePair(poppingTime.getDuration());
        Calendar startTimeEt = Calendar.getInstance();
        startTimeEt.setTimeZone(TimeZone.getTimeZone("UTC"));
        startTimeEt.setTimeInMillis(currentEt.getTimeInMillis());
        startTimeEt.set(Calendar.HOUR_OF_DAY, startTime.getHour());
        startTimeEt.set(Calendar.MINUTE, startTime.getMinute());
        startTimeEt.set(Calendar.SECOND, 0);
        if (currentEt.get(Calendar.HOUR_OF_DAY) > (startTime.getHour() + duration.getHour()) % 24) {
            startTimeEt.add(Calendar.DAY_OF_MONTH, 1);
        }
        Calendar endTimeEt = Calendar.getInstance();
        endTimeEt.setTimeZone(TimeZone.getTimeZone("UTC"));
        endTimeEt.setTimeInMillis(startTimeEt.getTimeInMillis());
        endTimeEt.set(Calendar.HOUR_OF_DAY, endTimeEt.get(Calendar.HOUR_OF_DAY) + duration.getHour());
        endTimeEt.set(Calendar.MINUTE, endTimeEt.get(Calendar.MINUTE) + duration.getMinute());
        return new GatheringEventTimeInfo(startTimeEt, computeLocalDate(startTimeEt), endTimeEt, computeLocalDate(endTimeEt), startTime, duration, currentEt.getTimeInMillis() <= endTimeEt.getTimeInMillis() && currentEt.getTimeInMillis() >= startTimeEt.getTimeInMillis() ? GatheringRarePopEventState.OCCURRING : GatheringRarePopEventState.PREPARING);
    }

    private final HashMap<Integer, GatheringEvent> eventMap = new HashMap<>();

    public HashMap<Integer, GatheringEvent> getEventMap() {
        return eventMap;
    }

    private Integer currentPendingEventKey = null;

    public Integer getNearestGatheringEventKey() {
        Integer bestEventKey = null;
        Calendar now = Calendar.getInstance();
        for (Map.Entry<Integer, GatheringEvent> gatheringEventEntry : this.eventMap.entrySet()) {
            if (gatheringEventEntry.getValue().items.size() > 0) {
                if (bestEventKey == null) {
                    bestEventKey = gatheringEventEntry.getKey();
                } else {
                    Calendar workingNodeStartTimeLt = gatheringEventEntry.getValue().getTimeInfo().getStartTimeLt();
                    Calendar bestStartTimeLt = this.eventMap.get(bestEventKey).getTimeInfo().getStartTimeLt();
                    if (workingNodeStartTimeLt.compareTo(bestStartTimeLt) < 0 && workingNodeStartTimeLt.compareTo(now) > 0) {
                        bestEventKey = gatheringEventEntry.getKey();
                    }
                }
            }
        }
        return bestEventKey;
    }

    public void generateAlarm(Calendar startTimeLt) {
    }

    public void clearAlarm() {

    }

    public void insertItems(List<GatheringItem> gatheringItems) {
        Integer alterEventKey = null;
        Calendar now = Calendar.getInstance();
        for (GatheringItem gatheringItem : gatheringItems) {
            for (GatheringPoint gatheringPoint : gatheringItem.getGatheringPoints()) {
                if (gatheringPoint.getTimeTable().size() > 0) {
                    for (PoppingTime poppingTime : gatheringPoint.getTimeTable()) {
                        if (poppingTime.getStartTime() != INVALID_START_TIME) {
                            if (this.eventMap.containsKey(poppingTime.getStartTime())) {
                                if (!this.eventMap.get(poppingTime.getStartTime()).items.containsKey(gatheringItem.getId())) {
                                    this.eventMap.get(poppingTime.getStartTime()).items.put(gatheringItem.getId(), new GatheringEventItem(gatheringItem, gatheringPoint));
                                }
                            } else {
                                GatheringEvent gatheringEvent = new GatheringEvent();
                                gatheringEvent.timeInfo = initGatheringEventTimeInfo(poppingTime);
                                LinkedHashMap<Integer, GatheringEventItem> gatheringEventItemLinkedHashMap = new LinkedHashMap<>();
                                gatheringEventItemLinkedHashMap.put(gatheringItem.getId(), new GatheringEventItem(gatheringItem, gatheringPoint));
                                gatheringEvent.items = gatheringEventItemLinkedHashMap;
                                this.eventMap.put(poppingTime.getStartTime(), gatheringEvent);
                                if (this.currentPendingEventKey != null) {
                                    Calendar currentPendingEventTime = this.eventMap.get(this.currentPendingEventKey).timeInfo.getStartTimeLt();
                                    if (gatheringEvent.timeInfo.getStartTimeLt().compareTo(currentPendingEventTime) < 0 && gatheringEvent.timeInfo.getStartTimeLt().compareTo(now) > 0) {
                                        alterEventKey = poppingTime.getStartTime();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (alterEventKey != null) {
            this.currentPendingEventKey = alterEventKey;
            generateAlarm(this.eventMap.get(alterEventKey).getTimeInfo().getStartTimeLt());
        }
        if (gatheringItems.size() > 0 && this.currentPendingEventKey == null) {
            Integer nearestEventKey = getNearestGatheringEventKey();
            if (nearestEventKey != null) {
                this.currentPendingEventKey = nearestEventKey;
                generateAlarm(this.eventMap.get(nearestEventKey).getTimeInfo().getStartTimeLt());
            }
        }
    }

    public void removeItems(List<GatheringItem> gatheringItems) {
        boolean alarmNeedClear = currentPendingEventKey != null;
        Set<Integer> startTimeTagSet = new HashSet<>();
        for (GatheringItem gatheringItem : gatheringItems) {
            for (GatheringPoint gatheringPoint : gatheringItem.getGatheringPoints()) {
                if (gatheringPoint.getTimeTable().size() > 0) {
                    for (PoppingTime poppingTime : gatheringPoint.getTimeTable()) {
                        if (poppingTime.getStartTime() != INVALID_START_TIME) {
                            if (this.eventMap.containsKey(poppingTime.getStartTime())) {
                                startTimeTagSet.add(poppingTime.getStartTime());
                                this.eventMap.get(poppingTime.getStartTime()).items.remove(gatheringItem.getId());
                            }
                        }
                    }
                }
            }
        }
        if (alarmNeedClear) {
            if (startTimeTagSet.contains(currentPendingEventKey)) {
                if (this.eventMap.get(currentPendingEventKey).items.size() == 0) {
                    this.currentPendingEventKey = null;
                    clearAlarm();
                    Integer nearestEventKey = getNearestGatheringEventKey();
                    if (nearestEventKey != null) {
                        // 其他时间存在有效的事件
                        this.currentPendingEventKey = nearestEventKey;
                        generateAlarm(this.eventMap.get(nearestEventKey).getTimeInfo().getStartTimeLt());
                    } else {
                        // 不存在其他事件，清空
                    }
                }
            }
        }
    }
}
