declare namespace GatheringItemTimerGroup {
  type TimeTableItem = {
    startTime: number;
    duration: number;
  };

  interface Props {
    startTimeLt: string;
    startTimeEt: string;
    countdownValue: string;
    countdownActivate: boolean;
    theme?: 'light' | 'dark';
  }
}
