declare namespace RegionSelectorMenuItem {
  interface Props {
    selected: boolean;
    onSelected: (key: number) => void;
    label: string;
    id: number;
  }
}
