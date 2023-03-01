declare namespace RegionDropdownMenuSection {
  interface Props {
    id: number;
    label: string;
    onSelected: (sectionId: number, itemId: number) => void;
    activated: boolean;
    activatedItemId: number;
    collapsed: boolean;
    onCollapse: (sectionId: number) => void;
    items: AppGlobal.RegionMap[];
  }
}
