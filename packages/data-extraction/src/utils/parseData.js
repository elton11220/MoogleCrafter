function isArrLastItem(arr, currentIdx) {
  return currentIdx === arr.length - 1;
}

function parseGatheringPointBonusXml(item, from, to) {
  if (!item) {
    return "";
  }
  let result = item.replace(/<Gui\([0-9]+\)\/>/g, "");
  if (/<Sheet\(/g.test(result) || /<38>E80265FF022E<\/38>/g.test(result)) {
    return "偷个懒，此项请查看WiKi";
  }
  result = result.replace(/<Value>IntegerParameter\(1\)<\/Value>/, from);
  result = result.replace(/<Value>IntegerParameter\(2\)<\/Value>/, to);
  if (
    /<If\(IntegerParameter\(2\)\)>/g.test(result) &&
    /<\/If>$/g.test(result) &&
    /<Else\/>/g.test(result)
  ) {
    result = result.replace(/<If\(IntegerParameter\(2\)\)>/, "");
    result = result.replace(/<\/If>/, "");
    const branches = result.split(/<Else\/>/);
    if (to) {
      return branches[0];
    } else {
      return branches[1];
    }
  }
  return result;
}

function parseGatheringPointBonus(itemBuffer) {
  const bonuses = [];
  itemBuffer.forEach((item) => {
    if (
      item.gatheringPointBonusCondition0 !== "" &&
      item.gatheringPointBonusType0 !== ""
    ) {
      const condition = item.gatheringPointBonusCondition0;
      const conditionValueFrom = item.gatheringPointBonusConditionValueFrom0;
      const conditionValueTo = item.gatheringPointBonusConditionValueTo0;
      const bonusType = item.gatheringPointBonusType0;
      const bonusValueFrom = item.gatheringPointBonusValueFrom0;
      const bonusValueTo = item.gatheringPointBonusValueTo0;
      bonuses.push({
        condition: parseGatheringPointBonusXml(
          condition,
          conditionValueFrom,
          conditionValueTo
        ),
        bonusType: parseGatheringPointBonusXml(
          bonusType,
          bonusValueFrom,
          bonusValueTo
        ),
      });
    }
    if (
      item.gatheringPointBonusCondition1 !== "" &&
      item.gatheringPointBonusType1 !== ""
    ) {
      const condition = item.gatheringPointBonusCondition1;
      const conditionValueFrom = item.gatheringPointBonusConditionValueFrom1;
      const conditionValueTo = item.gatheringPointBonusConditionValueTo1;
      const bonusType = item.gatheringPointBonusType1;
      const bonusValueFrom = item.gatheringPointBonusValueFrom1;
      const bonusValueTo = item.gatheringPointBonusValueTo1;
      bonuses.push({
        condition: parseGatheringPointBonusXml(
          condition,
          conditionValueFrom,
          conditionValueTo
        ),
        bonusType: parseGatheringPointBonusXml(
          bonusType,
          bonusValueFrom,
          bonusValueTo
        ),
      });
    }
  });
  return bonuses;
}

function parseGatheringPointsInBuffer(itemBuffer) {
  // copy common properties
  const gatheringPoint = {
    gatheringPointBaseId: itemBuffer[0].gatheringPointBaseId,
    mapId: itemBuffer[0].mapId,
    mapSymbol: itemBuffer[0].mapSymbol,
    placeName: itemBuffer[0].placeName,
    placeNameForAetheryte: itemBuffer[0].placeNameForAetheryte,
    gatheringType: itemBuffer[0].gatheringType,
    classJob:
      itemBuffer[0].gatheringType === 0 || itemBuffer[0].gatheringType === 1
        ? "采矿工"
        : "园艺工",
    x: itemBuffer[0].x,
    y: itemBuffer[0].y,
    timeTable: [],
    gatheringPointBonus: parseGatheringPointBonus(itemBuffer),
  };
  const isEphemeral = itemBuffer[0].ephemeralStartTime < 65535;
  if (isEphemeral) {
    const endTime = itemBuffer[0].ephemeralEndTime || 2400;
    let duration =
      (60 * Math.abs(endTime - itemBuffer[0].ephemeralStartTime)) / 100;
    if (endTime < itemBuffer[0].ephemeralStartTime) {
      duration =
        (60 * Math.abs(2400 - itemBuffer[0].ephemeralStartTime + endTime)) /
        100;
    }
    gatheringPoint.timeTable.push({
      startTime: itemBuffer[0].ephemeralStartTime,
      duration,
    });
  } else {
    if (itemBuffer[0].startTime0 === 65535) {
      return gatheringPoint;
    }
    gatheringPoint.timeTable.push({
      startTime: itemBuffer[0].startTime0,
      duration: itemBuffer[0].duration0,
    });
    if (itemBuffer[0].startTime1 === 65535) {
      return gatheringPoint;
    }
    gatheringPoint.timeTable.push({
      startTime: itemBuffer[0].startTime1,
      duration: itemBuffer[0].duration1,
    });
    if (itemBuffer[0].startTime2 === 65535) {
      return gatheringPoint;
    }
    gatheringPoint.timeTable.push({
      startTime: itemBuffer[0].startTime2,
      duration: itemBuffer[0].duration2,
    });
  }
  return gatheringPoint;
}

function parseItemsInBuffer(itemBuffer) {
  // copy common properties
  const {
    id,
    name,
    icon,
    gatheringItemLevel,
    gatheringItemStars,
    itemCategory,
    exVersion,
    folkloreBook,
    isHidden,
  } = itemBuffer[0];
  const result = {
    id,
    name,
    icon,
    gatheringItemLevel,
    gatheringItemStars,
    itemCategory,
    exVersion,
    folkloreBook,
    gatheringPoints: [],
    isHidden: isHidden === 1,
  };
  const bonusBuffer = [];
  itemBuffer.forEach((item, index, arr) => {
    if (bonusBuffer.length === 0) {
      bonusBuffer.push(item);
    } else {
      if (item.gatheringPointBaseId === bonusBuffer[0].gatheringPointBaseId) {
        bonusBuffer.push(item);
      } else {
        result.gatheringPoints.push(parseGatheringPointsInBuffer(bonusBuffer));
        bonusBuffer.length = 0;
        bonusBuffer.push(item);
      }
    }
    if (isArrLastItem(arr, index)) {
      result.gatheringPoints.push(parseGatheringPointsInBuffer(bonusBuffer));
    }
  });
  return result;
}

function parseGatheringData(rawPreProcessedData) {
  const result = [];
  const itemBuffer = [];
  rawPreProcessedData.forEach((item, index, arr) => {
    if (itemBuffer.length === 0) {
      // buffer is empty
      itemBuffer.push(item);
    } else {
      // buffer is not empty, check if the gathering item is same to the previous one
      if (item.id === itemBuffer[0].id) {
        // same item
        itemBuffer.push(item);
      } else {
        // process the items in the buffer immediately, then clear the buffer and push current item into the buffer
        result.push(parseItemsInBuffer(itemBuffer));
        itemBuffer.length = 0;
        itemBuffer.push(item);
      }
    }
    if (isArrLastItem(arr, index)) {
      result.push(parseItemsInBuffer(itemBuffer));
    }
  });
  return result;
}

function mapGatheringPointBase(bufItem) {
  return {
    id: bufItem.gatheringItemId,
    name: bufItem.name || null,
    icon: bufItem.icon,
    gatheringItemLevel: bufItem.gatheringLevel,
    gatheringItemStars: bufItem.gatheringItemStars,
    isHidden: !!bufItem.isHidden,
  };
}

function parseGatheringPointBaseData(rawPreProcessedData) {
  const result = [];
  let itemBuffer = [];
  rawPreProcessedData.forEach((item, index, arr) => {
    if (itemBuffer.length === 0) {
      itemBuffer.push(item);
    } else {
      if (item.id === itemBuffer[0].id) {
        itemBuffer.push(item);
      } else {
        result.push(
          itemBuffer
            .filter((filteringItem) => filteringItem.gatheringItemId !== 0)
            .map(mapGatheringPointBase)
        );
        itemBuffer.length = 0;
        itemBuffer.push(item);
      }
    }
    if (isArrLastItem(arr, index)) {
      result.push(
        itemBuffer
          .filter((filteringItem) => filteringItem.gatheringItemId !== 0)
          .map(mapGatheringPointBase)
      );
    }
    // 将隐藏的素材放到最后
    itemBuffer = itemBuffer.sort((a, b) => (a.isHidden ? 1 : -1));
  });
  return result;
}

module.exports = { parseGatheringData, parseGatheringPointBaseData };
