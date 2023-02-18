declare namespace GatheringItem {
  interface Props {
    gatheringItem: AppGlobal.GatheringItem;
    eorzeaTime: {
      currentLt: Date;
      currentEt: Date;
    };
    timeTable: AppGlobal.TimeTableItem[];
  }
}
