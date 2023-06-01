import type {StyleProp, TextStyle} from 'react-native';

declare namespace GatheringItemLite {
  interface Props {
    data: AppGlobal.ItemBase;
    prefix?: string;
    suffix?: JSX.Element;
    showRightNavIcon?: boolean;
    onPress?: (id: number) => void;
    textStyle?: StyleProp<TextStyle>;
    flex?: boolean;
  }
}
