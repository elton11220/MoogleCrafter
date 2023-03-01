declare namespace RegionDropdownSelector {
  interface Props {
    value: number | null;
    onChange: (value: number | null) => void;
    collapsedSectionId: number;
    onCollapseSection: (id: number) => void;
  }
}
