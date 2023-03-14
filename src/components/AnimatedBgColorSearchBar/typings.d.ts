declare namespace AnimatedBgColorSearchBar {
  interface Props {
    activated: boolean;
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
  }
}
