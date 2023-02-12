declare namespace GatheringItemTimerGroup {
  type TimeTableItem = {
    startTime: number;
    duration: number;
  };

  interface Props {
    timeTable: TimeTableItem[];
  }
}
