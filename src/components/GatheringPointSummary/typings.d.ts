declare namespace GatheringPointSummary {
  interface Props {
    gatheringPointBaseId: number;
    startTimeLt: string | null;
    startTimeEt: string | null;
    countdownValue: string | null;
    countdownActivate: boolean;
    regionName: string;
    prefix?: string;
    coordinate?: string;
    onPress?: (gatheringPointBaseId: number) => void;
  }
}
