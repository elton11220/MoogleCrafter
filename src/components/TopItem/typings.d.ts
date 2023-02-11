declare namespace TopItemTypes {
  interface Props {
    gatheringListItem: AppGlobal.GatheringListItem;
    onRemovePressed: (gatheringItemId: number) => void;
    longPresssable: boolean;
  }
}
