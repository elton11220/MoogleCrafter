declare namespace RegionSelectorMenu {
  interface Props {
    value: number | null;
    onChange: (value: number | null) => void;
    collapsedGroupId: number;
    onCollapseGroup: (id: number) => void;
    activatedGroupId: number;
    onActivateGroup: (id: number) => void;
  }
}
