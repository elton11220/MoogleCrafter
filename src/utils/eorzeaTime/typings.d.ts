import type {Moment} from 'moment';
import type {GatheringRarePopEventState} from './index';

declare namespace EorzeaTimeUtils {
  interface TimeTableItem {
    startTime: number;
    duration: number;
    gatheringPointIndex: number;
    gatheringPointBaseId: number;
  }

  interface ParsedTimePair {
    hour: number;
    minute: number;
  }

  type GatheringRarePopEvent = {
    gatheringPointIndex: number;
    gatheringPointBaseId: number;
    startTimeEt: Moment;
    startTimeLt: Moment;
    endTimeLt: Moment;
    endTimeEt: Moment;
    rawStartTime: ParsedTimePair;
    rawDuration: ParsedTimePair;
    state: GatheringRarePopEventState;
  } | null;

  interface ParsedGatheringRarePopEvents {
    events: GatheringRarePopEvent[];
    sortedOccurringEvents: GatheringRarePopEvent[];
    sortedPreparingEvents: GatheringRarePopEvent[];
  }
}
