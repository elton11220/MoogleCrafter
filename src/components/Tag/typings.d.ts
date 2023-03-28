import type {StyleProp, TextStyle, ViewStyle} from 'react-native';

declare namespace Tag {
  interface Props {
    children: string;
    color?: string;
    labelStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
  }
}
