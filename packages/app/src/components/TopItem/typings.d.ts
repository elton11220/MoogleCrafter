declare namespace TopItemTypes {
  interface Props {
    gatheringItem: AppGlobal.GatheringItem;
    eorzeaTime: {
      currentLt: Date;
      currentEt: Date;
    };
    onRemovePressed: (gatheringItemId: number) => void;
    longPresssable: boolean;
  }
}
