import type {StyleProp, ViewStyle} from 'react-native';

declare namespace ListSection {
  interface Props {
    title?: string;
    children: JSX.Element | JSX.Element[];
    contentContainerStyle?: StyleProp<ViewStyle>;
  }
}

declare namespace ListItem {
  interface Props {
    title: JSX.Element | string;
    right?: JSX.Element | string;
    onPress?: () => void;
  }
}
