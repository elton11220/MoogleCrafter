import {NativeModules} from 'react-native';
import type {ExVersion} from '../../utils/eorzeaConstant';

export enum NotificationMode {
  OFF,
  SIMPLE,
  TTS,
  EORZEA_THEME,
}

export enum TTSStatus {
  UNINITIALIZED,
  WORKING,
  LANG_NOT_SUPPORT,
  FAILED,
}

export function playSound(exVersion: ExVersion) {
  return NativeModules.SpecialRingtone.playSound(exVersion);
}

export function playSimpleSound() {
  return NativeModules.SpecialRingtone.playSimpleSound();
}

export const setNotificationMode =
  NativeModules.SpecialRingtone.setNotificationMode;

export const getTTSStatus = NativeModules.SpecialRingtone.getTTSStatus;

export const speakWithTTS = NativeModules.SpecialRingtone.speakWithTTS;
