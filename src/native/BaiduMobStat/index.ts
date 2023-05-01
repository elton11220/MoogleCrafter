import {NativeModules} from 'react-native';

export function initStatService() {
  NativeModules.BaiduMobStat.initStatService();
}

export function initStatServiceInBrowseMode() {
  NativeModules.BaiduMobStat.initStatServiceInBrowseMode();
}

export function onPageStart(name: string) {
  NativeModules.BaiduMobStat.onPageStart(name);
}

export function onPageEnd(name: string) {
  NativeModules.BaiduMobStat.onPageEnd(name);
}

export function onEvent(eventId: string, label: string) {
  NativeModules.BaiduMobStat.onEvent(eventId, label);
}

export function onEventWithAttributes(
  eventId: string,
  label: string,
  attributes: Record<string, string>,
) {
  NativeModules.BaiduMobStat.onEventWithAttributes(eventId, label, attributes);
}

export function onEventStart(eventId: string, label: string) {
  NativeModules.BaiduMobStat.onEventStart(eventId, label);
}

export function onEventEnd(eventId: string, label: string) {
  NativeModules.BaiduMobStat.onEventEnd(eventId, label);
}

export function onEventEndWithAttributes(
  eventId: string,
  label: string,
  attributes: Record<string, string>,
) {
  NativeModules.BaiduMobStat.onEventEndWithAttributes(
    eventId,
    label,
    attributes,
  );
}

export function onEventDuration(
  eventId: string,
  label: string,
  milliseconds: number,
) {
  NativeModules.BaiduMobStat.onEventDuration(eventId, label, milliseconds);
}

export function onEventDurationWithAttributes(
  eventId: string,
  label: string,
  milliseconds: number,
  attributes: Record<string, string>,
) {
  NativeModules.BaiduMobStat.onEventDurationWithAttributes(
    eventId,
    label,
    milliseconds,
    attributes,
  );
}
