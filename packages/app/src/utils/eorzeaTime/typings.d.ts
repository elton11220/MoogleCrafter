import type {Moment} from 'moment';
import type {GatheringRarePopEventState} from './index';

declare namespace EorzeaTimeUtils {
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

  interface ParsedGatheringPoint extends AppGlobal.GatheringPoint {
    rarePopEvent: GatheringRarePopEvent;
    state: GatheringRarePopEventState;
  }

  interface ParsedGatheringPoints {
    gatheringPoints: ParsedGatheringPoint[];
    sortedOccurringGatheringPoints: ParsedGatheringPoint[];
    sortedPreparingGatheringPoints: ParsedGatheringPoint[];
    poppingGatheringPoint: ParsedGatheringPoint;
  }
}
