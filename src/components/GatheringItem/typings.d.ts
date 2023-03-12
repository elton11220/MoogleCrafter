declare namespace GatheringItem {
  interface Props {
    gatheringItem: AppGlobal.GatheringItem;
    eorzeaTime: {
      currentLt: Date;
      currentEt: Date;
    };
    timeTable: AppGlobal.TimeTableItem[];
    onLongPressed: (item: AppGlobal.GatheringItem) => void;
    onIconPressed: (item: AppGlobal.GatheringItem) => void;
    onPressed: (item: AppGlobal.GatheringItem) => void;
    selected: boolean;
  }
}
