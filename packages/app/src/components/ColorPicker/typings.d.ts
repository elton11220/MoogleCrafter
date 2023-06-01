declare namespace ColorPicker {
  type ColorItem = {
    key: string;
    value: string;
  };

  type ColorList = ColorItem[];

  type ComponentValueType = ColorItem.key;

  interface Props {
    colorList: ColorList;
    value: ComponentValueType;
    setValue: (value: ComponentValueType) => void;
  }
}
