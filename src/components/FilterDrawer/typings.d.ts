declare namespace FilterDrawer {
  interface Props {
    value: FilterValue;
    onChange: React.Dispatch<React.SetStateAction<FilterValue>>;
  }

  interface FilterValue {
    isRare: true | false | null;
    classJob: string | null;
    exVersion: number | null;
    gatheringItemLevel: number | null;
    mapId: number | null;
  }
}
