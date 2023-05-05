declare namespace RadioTagGroup {
  type Item<K> = {
    key: K;
    label: string;
    style?: StyleProps;
    linearGradient?: LinearGradientProps;
  };

  type LinearGradientProps = {
    colors: string[];
  };

  type StyleProps = {
    selectedBorderColor: string;
    selectedBackground: string;
    unselectedBorderColor: string;
    unselectedBackground: string;
  };

  interface Props<T> {
    items: Item<T>[];
    value: T;
    setValue: (value: T) => void;
    showSelectedIcon?: boolean;
    itemSize?: 'auto' | 'large';
  }
}
