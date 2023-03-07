import moment from 'moment';
import type {EorzeaTimeUtils} from './typings';

function computeEorzeaDate(date: Date): Date {
  const eorzeaTime = new Date();
  const unixTime = Math.floor(date.getTime() * (1440 / 70));
  eorzeaTime.setTime(unixTime);
  return eorzeaTime;
}

function computeLocalDate(date: Date): Date {
  const localTime = new Date();
  const unixTime = Math.ceil(date.getTime() / (1440 / 70));
  localTime.setTime(unixTime);
  return localTime;
}

function parseStartTime(startTime: number) {
  if (startTime === 65535) {
    return null;
  }
  if (startTime === 0) {
    return {
      hour: 0,
      minute: 0,
    };
  }
  let hour = Math.floor(startTime / 100);
  let minute = startTime % 100;
  if (minute >= 60) {
    hour += Math.floor(minute / 60);
    minute = minute % 60;
  }
  return {
    hour,
    minute,
  };
}

enum GatheringRarePopEventState {
  'PREPARING',
  'OCCURRING',
}

const getTimeTableFromGatheringPoints = (
  gatheringPoints: AppGlobal.GatheringPoint[],
) =>
  gatheringPoints.reduce(
    (prev, curr, idx) => [
      ...prev,
      ...curr.timeTable.map(time => ({
        ...time,
        gatheringPointIndex: idx,
        gatheringPointBaseId: curr.gatheringPointBaseId,
      })),
    ],
    [] as AppGlobal.TimeTableItem[],
  );

function parseGatheringRarePopEvents(
  timeTable: AppGlobal.TimeTableItem[],
  currentEt: Date,
): EorzeaTimeUtils.ParsedGatheringRarePopEvents {
  const events: EorzeaTimeUtils.GatheringRarePopEvent[] = timeTable.map(
    time => {
      const parsedStartTime = parseStartTime(time.startTime);
      const parsedDuration = parseStartTime(time.duration);
      if (parsedStartTime !== null && parsedDuration !== null) {
        const startTimeEt = new Date(currentEt.valueOf());
        startTimeEt.setUTCHours(parsedStartTime.hour);
        startTimeEt.setUTCMinutes(parsedStartTime.minute);
        startTimeEt.setUTCSeconds(0);
        if (
          currentEt.getUTCHours() >
          parsedStartTime.hour + parsedDuration.hour
        ) {
          startTimeEt.setUTCDate(startTimeEt.getUTCDate() + 1);
        }
        const endTimeEt = new Date(startTimeEt.valueOf());
        endTimeEt.setUTCHours(endTimeEt.getUTCHours() + parsedDuration.hour);
        endTimeEt.setUTCMinutes(
          endTimeEt.getUTCMinutes() + parsedDuration.minute,
        );
        return {
          gatheringPointIndex: time.gatheringPointIndex,
          gatheringPointBaseId: time.gatheringPointBaseId,
          startTimeEt: moment(startTimeEt).utc(),
          startTimeLt: moment(computeLocalDate(startTimeEt)),
          endTimeEt: moment(endTimeEt).utc(),
          endTimeLt: moment(computeLocalDate(endTimeEt)),
          rawStartTime: parsedStartTime,
          rawDuration: parsedDuration,
          state:
            currentEt <= endTimeEt && currentEt >= startTimeEt
              ? GatheringRarePopEventState.OCCURRING
              : GatheringRarePopEventState.PREPARING,
        };
      } else {
        return null;
      }
    },
  );
  const occurringEvents = events
    .filter(
      event =>
        event !== null && event.state === GatheringRarePopEventState.OCCURRING,
    )
    .sort((a, b) => {
      if (a === null || b === null) {
        return -1;
      }
      return (
        a.endTimeEt.valueOf() -
        currentEt.valueOf() -
        (b.endTimeEt.valueOf() - currentEt.valueOf())
      );
    });
  const preparingEvents = events
    .filter(
      event =>
        event !== null && event.state === GatheringRarePopEventState.PREPARING,
    )
    .sort((a, b) => {
      if (a === null || b === null) {
        return -1;
      }
      return (
        currentEt.valueOf() -
        b.startTimeEt.valueOf() -
        (currentEt.valueOf() - a.startTimeEt.valueOf())
      );
    });
  return {
    events,
    sortedOccurringEvents: occurringEvents,
    sortedPreparingEvents: preparingEvents,
  };
}

function getPoppingEvent(events: EorzeaTimeUtils.ParsedGatheringRarePopEvents) {
  if (
    events.sortedOccurringEvents.length > 0 &&
    events.sortedOccurringEvents[0] !== null
  ) {
    return events.sortedOccurringEvents[0];
  } else if (
    events.sortedPreparingEvents.length > 0 &&
    events.sortedPreparingEvents[0] !== null
  ) {
    return events.sortedPreparingEvents[0];
  } else {
    return null;
  }
}

function getCountdownValueByParsedEvent(
  event: EorzeaTimeUtils.GatheringRarePopEvent,
  currentLt: Date,
) {
  if (event !== null) {
    if (event.state === GatheringRarePopEventState.OCCURRING) {
      return moment(event.endTimeLt.valueOf() - currentLt.valueOf()).format(
        'mm:ss',
      );
    } else if (event.state === GatheringRarePopEventState.PREPARING) {
      return moment(event.startTimeLt.valueOf() - currentLt.valueOf()).format(
        'mm:ss',
      );
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function getCountdownValueByParsedEvents(
  events: EorzeaTimeUtils.ParsedGatheringRarePopEvents,
  currentLt: Date,
) {
  const poppingEvent = getPoppingEvent(events);
  if (poppingEvent !== null) {
    if (poppingEvent.state === GatheringRarePopEventState.OCCURRING) {
      return moment(
        poppingEvent.endTimeLt.valueOf() - currentLt.valueOf(),
      ).format('mm:ss');
    } else if (poppingEvent.state === GatheringRarePopEventState.PREPARING) {
      return moment(
        poppingEvent.startTimeLt.valueOf() - currentLt.valueOf(),
      ).format('mm:ss');
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function getPoppingGatheringPointByParsedEvents(
  gatheringPoints: AppGlobal.GatheringPoint[],
  events: EorzeaTimeUtils.ParsedGatheringRarePopEvents,
) {
  const poppingEvent = getPoppingEvent(events);
  if (poppingEvent === null) {
    return gatheringPoints[0];
  } else {
    return gatheringPoints[poppingEvent.gatheringPointIndex];
  }
}

function parseGatheringPoints(
  gatheringPoints: AppGlobal.GatheringPoint[],
  currentEt: Date,
): EorzeaTimeUtils.ParsedGatheringPoints {
  const parsedGatheringPoints: EorzeaTimeUtils.ParsedGatheringPoint[] =
    gatheringPoints.map((point, pointIdx) => {
      if (point.timeTable.length === 0) {
        return {
          ...point,
          rarePopEvent: null,
          state: GatheringRarePopEventState.OCCURRING,
        };
      } else {
        const events: EorzeaTimeUtils.GatheringRarePopEvent[] =
          point.timeTable.map(time => {
            const parsedStartTime = parseStartTime(time.startTime);
            const parsedDuration = parseStartTime(time.duration);
            if (parsedStartTime !== null && parsedDuration !== null) {
              const startTimeEt = new Date(currentEt.valueOf());
              startTimeEt.setUTCHours(parsedStartTime.hour);
              startTimeEt.setUTCMinutes(parsedStartTime.minute);
              startTimeEt.setUTCSeconds(0);
              if (
                currentEt.getUTCHours() >
                parsedStartTime.hour + parsedDuration.hour
              ) {
                startTimeEt.setUTCDate(startTimeEt.getUTCDate() + 1);
              }
              const endTimeEt = new Date(startTimeEt.valueOf());
              endTimeEt.setUTCHours(
                endTimeEt.getUTCHours() + parsedDuration.hour,
              );
              endTimeEt.setUTCMinutes(
                endTimeEt.getUTCMinutes() + parsedDuration.minute,
              );
              return {
                gatheringPointIndex: pointIdx,
                gatheringPointBaseId: point.gatheringPointBaseId,
                startTimeEt: moment(startTimeEt).utc(),
                startTimeLt: moment(computeLocalDate(startTimeEt)),
                endTimeEt: moment(endTimeEt).utc(),
                endTimeLt: moment(computeLocalDate(endTimeEt)),
                rawStartTime: parsedStartTime,
                rawDuration: parsedDuration,
                state:
                  currentEt <= endTimeEt && currentEt >= startTimeEt
                    ? GatheringRarePopEventState.OCCURRING
                    : GatheringRarePopEventState.PREPARING,
              };
            } else {
              return null;
            }
          });
        const occurringEvents = events
          .filter(
            event =>
              event !== null &&
              event.state === GatheringRarePopEventState.OCCURRING,
          )
          .sort((a, b) => {
            if (a === null || b === null) {
              return -1;
            }
            return (
              a.endTimeEt.valueOf() -
              currentEt.valueOf() -
              (b.endTimeEt.valueOf() - currentEt.valueOf())
            );
          });
        if (occurringEvents.length > 0) {
          return {
            ...point,
            rarePopEvent: occurringEvents[0],
            state: GatheringRarePopEventState.OCCURRING,
          };
        }
        const preparingEvents = events
          .filter(
            event =>
              event !== null &&
              event.state === GatheringRarePopEventState.PREPARING,
          )
          .sort((a, b) => {
            if (a === null || b === null) {
              return -1;
            }
            return (
              currentEt.valueOf() -
              b.startTimeEt.valueOf() -
              (currentEt.valueOf() - a.startTimeEt.valueOf())
            );
          });
        return {
          ...point,
          rarePopEvent: preparingEvents.length > 0 ? preparingEvents[0] : null,
          state: GatheringRarePopEventState.PREPARING,
        };
      }
    });
  const sortedOccurringGatheringPoints = parsedGatheringPoints
    .filter(point => point.state === GatheringRarePopEventState.OCCURRING)
    .sort((a, b) => {
      if (a.rarePopEvent === null || b.rarePopEvent === null) {
        return -1;
      }
      return (
        a.rarePopEvent.endTimeEt.valueOf() -
        currentEt.valueOf() -
        (b.rarePopEvent.endTimeEt.valueOf() - currentEt.valueOf())
      );
    });
  const sortedPreparingGatheringPoints = parsedGatheringPoints
    .filter(point => point.state === GatheringRarePopEventState.PREPARING)
    .sort((a, b) => {
      if (a.rarePopEvent === null || b.rarePopEvent === null) {
        return -1;
      }
      return (
        currentEt.valueOf() -
        b.rarePopEvent.startTimeEt.valueOf() -
        (currentEt.valueOf() - a.rarePopEvent.startTimeEt.valueOf())
      );
    });
  return {
    gatheringPoints: parsedGatheringPoints,
    sortedOccurringGatheringPoints,
    sortedPreparingGatheringPoints,
    poppingGatheringPoint:
      sortedOccurringGatheringPoints.length > 0
        ? sortedOccurringGatheringPoints[0]
        : sortedPreparingGatheringPoints[0],
  };
}

export {
  computeEorzeaDate,
  computeLocalDate,
  parseStartTime,
  GatheringRarePopEventState,
  parseGatheringRarePopEvents,
  getPoppingEvent,
  getCountdownValueByParsedEvent,
  getCountdownValueByParsedEvents,
  getPoppingGatheringPointByParsedEvents,
  getTimeTableFromGatheringPoints,
  parseGatheringPoints,
};
