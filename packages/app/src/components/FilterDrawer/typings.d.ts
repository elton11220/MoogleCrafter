declare namespace FilterDrawer {
  interface Props {
    value: FilterValue;
    onChange: React.Dispatch<React.SetStateAction<FilterValue>>;
  }

  interface FilterValue {
    isRare: true | false | null;
    classJob: string | null;
    specialType: string | null;
    exVersion: number | null;
    craftFilter: number | null;
    gatheringItemLevel: number | null;
    mapId: number | null;
  }
}
