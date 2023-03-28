import 'react-native';
import type {ExVersion} from '../../utils/eorzeaConstant';
import type {NotificationMode} from './index';

declare namespace SpecialRingtoneModule {
  interface NativeModuleStatic {
    playSound: (exVersion: ExVersion) => Promise<null>;
    playSimpleSound: () => Promise<null>;
    setNotificationMode: (mode: NotificationMode) => void;
  }
}

declare module 'react-native' {
  interface NativeModulesStatic {
    SpecialRingtone: SpecialRingtoneModule.NativeModuleStatic;
  }
}
