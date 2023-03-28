import 'react-native';
import type {ExVersion} from '../../utils/eorzeaConstant';
import type {NotificationMode, TTSStatus} from './index';

declare namespace SpecialRingtoneModule {
  interface NativeModuleStatic {
    playSound: (exVersion: ExVersion) => Promise<null> | never;
    playSimpleSound: () => Promise<null> | never;
    setNotificationMode: (mode: NotificationMode) => void;
    getTTSStatus: () => Promise<TTSStatus>;
    speakWithTTS: (content: string) => Promise<null> | never;
  }
}

declare module 'react-native' {
  interface NativeModulesStatic {
    SpecialRingtone: SpecialRingtoneModule.NativeModuleStatic;
  }
}
