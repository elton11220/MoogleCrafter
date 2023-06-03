const fs = require("fs");
const path = require("path");
const {
  parseGatheringData,
  parseGatheringPointBaseData,
} = require("../utils/parseData");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { getNearestAetheryte } = require("../utils/mapCoordinate");

async function convertDbToJson() {
  const db = await open({
    filename: path.join(__dirname, "../../dist/database.db"),
    driver: sqlite3.Database,
  });
  // 生成 Aetherytes 映射
  const aetherytesResult = await db.all(`
    SELECT
      aeth.id AS id,
      pn.name AS 'placeName',
      aeth.mapId AS mapId,
      aeth.x AS x,
      aeth.y AS y,
      aeth.z AS z,
      aeth.'type' AS 'type'
    FROM Aetheryte aeth
    INNER JOIN PlaceName pn ON aeth.placeName = pn.id
  `);
  const aetheryteMap = new Map();
  aetherytesResult
    .filter((item) => item.type === 0)
    .forEach((item) => {
      if (aetheryteMap.has(item.mapId)) {
        aetheryteMap.get(item.mapId).push(item);
      } else {
        aetheryteMap.set(item.mapId, [item]);
      }
    });

  // 预处理 GatheringData
  const rawPreProcessedGatheringData = await db.all(`
    SELECT
      gi.id AS id,
      i.name AS name,
      i.icon AS icon,
      gi.isHidden AS isHidden,
      gilct.gatheringItemLevel AS gatheringItemLevel,
      gilct.stars AS gatheringItemStars,
      iuc.name AS itemCategory,
      ev.id AS 'exVersion',
      gsc.folkloreBook AS folkloreBook,
      gpb.id AS gatheringPointBaseId,
      m.id AS mapId,
      m.mapId AS mapSymbol,
      pn.name AS 'placeName',
      gt.id AS 'gatheringType',
      egp.x AS x,
      egp.y AS y,
      grptt.startTime0 AS startTime0,
      grptt.duration0 AS duration0,
      grptt.startTime1 AS startTime1,
      grptt.duration1 AS duration1,
      grptt.startTime2 AS startTime2,
      grptt.duration2 AS duration2,
      gpt.ephemeralStartTime AS ephemeralStartTime,
      gpt.ephemeralEndTime AS ephemeralEndTime,
      gc0.text AS gatheringPointBonusCondition0,
      gpbonus0.conditionValueFrom AS gatheringPointBonusConditionValueFrom0,
      gpbonus0.conditionValueTo AS gatheringPointBonusConditionValueTo0,
      gpbt0.text AS gatheringPointBonusType0,
      gpbonus0.bonusValueFrom AS gatheringPointBonusValueFrom0,
      gpbonus0.bonusValueTo AS gatheringPointBonusValueTo0,
      gc1.text AS gatheringPointBonusCondition1,
      gpbonus1.conditionValueFrom AS gatheringPointBonusConditionValueFrom1,
      gpbonus1.conditionValueTo AS gatheringPointBonusConditionValueTo1,
      gpbt1.text AS gatheringPointBonusType1,
      gpbonus1.bonusValueFrom AS gatheringPointBonusValueFrom1,
      gpbonus1.bonusValueTo AS gatheringPointBonusValueTo1
    FROM GatheringItem gi
    INNER JOIN GatheringItemLevelConvertTable gilct ON gi.gatheringItemLevel = gilct.id
    INNER JOIN Item i ON gi.item = i.id
    INNER JOIN GatheringItemPoint gip ON gi.id = gip.'gatheringItem'
    INNER JOIN GatheringPoint gp ON gp.id = gip.'gatheringPoint'
    INNER JOIN GatheringPointBase gpb ON gp.'gatheringPointBase' = gpb.id
    INNER JOIN GatheringType gt ON gpb.gatheringType = gt.id
    INNER JOIN ExportedGatheringPoint egp ON egp.id = gpb.id
    INNER JOIN TerritoryType tt ON gp.territoryType = tt.id
    INNER JOIN ExVersion ev ON tt.exVersion = ev.id
    INNER JOIN Map m ON tt.map = m.id
    INNER JOIN PlaceName pn ON tt.placeName = pn.id
    LEFT JOIN GatheringSubCategory gsc ON gp.gatheringSubCategory = gsc.id
    INNER JOIN GatheringPointTransient gpt ON gp.id = gpt.id
    INNER JOIN GatheringRarePopTimeTable grptt ON gpt.gatheringRarePopTimeTable = grptt.id
    LEFT JOIN GatheringPointBonus gpbonus0 ON gpbonus0.id = gp.gatheringPointBonus0
    INNER JOIN GatheringCondition gc0 ON gpbonus0.'condition' = gc0.id
    INNER JOIN GatheringPointBonusType gpbt0 ON gpbonus0.bonusType = gpbt0.id
    LEFT JOIN GatheringPointBonus gpbonus1 ON gpbonus1.id = gp.gatheringPointBonus1
    INNER JOIN GatheringCondition gc1 ON gpbonus1.'condition' = gc1.id
    INNER JOIN GatheringPointBonusType gpbt1 ON gpbonus1.bonusType = gpbt1.id
    INNER JOIN ItemUICategory iuc ON i.itemUICategory = iuc.id
    ORDER BY gi.id
  `);

  // 处理不在采集笔记中显示的个别素材
  const rawPreProcessedNoteHiddenGatheringData = await db.all(`
    SELECT
      gi.id AS id,
      i.id AS itemId,
      i.name AS name,
      i.icon AS icon,
      gi.isHidden AS isHidden,
      gilct.gatheringItemLevel AS gatheringItemLevel,
      gilct.stars AS gatheringItemStars,
      iuc.name AS itemCategory,
      ev.id AS 'exVersion',
      gsc.folkloreBook AS folkloreBook,
      gp.id AS gatheringPointId,
      gpb.id AS gatheringPointBaseId,
      m.id AS mapId,
      m.mapId AS mapSymbol,
      pn.name AS 'placeName',
      gt.id AS 'gatheringType',
      egp.x AS x,
      egp.y AS y,
      grptt.startTime0 AS startTime0,
      grptt.duration0 AS duration0,
      grptt.startTime1 AS startTime1,
      grptt.duration1 AS duration1,
      grptt.startTime2 AS startTime2,
      grptt.duration2 AS duration2,
      gpt.ephemeralStartTime AS ephemeralStartTime,
      gpt.ephemeralEndTime AS ephemeralEndTime,
      gc0.text AS gatheringPointBonusCondition0,
      gpbonus0.conditionValueFrom AS gatheringPointBonusConditionValueFrom0,
      gpbonus0.conditionValueTo AS gatheringPointBonusConditionValueTo0,
      gpbt0.text AS gatheringPointBonusType0,
      gpbonus0.bonusValueFrom AS gatheringPointBonusValueFrom0,
      gpbonus0.bonusValueTo AS gatheringPointBonusValueTo0,
      gc1.text AS gatheringPointBonusCondition1,
      gpbonus1.conditionValueFrom AS gatheringPointBonusConditionValueFrom1,
      gpbonus1.conditionValueTo AS gatheringPointBonusConditionValueTo1,
      gpbt1.text AS gatheringPointBonusType1,
      gpbonus1.bonusValueFrom AS gatheringPointBonusValueFrom1,
      gpbonus1.bonusValueTo AS gatheringPointBonusValueTo1
    FROM GatheringItem gi
    INNER JOIN GatheringItemLevelConvertTable gilct ON gi.gatheringItemLevel = gilct.id
    INNER JOIN Item i ON gi.item = i.id
    INNER JOIN GatheringPointBase gpb ON (
      gpb.item0 = gi.id OR
      gpb.item1 = gi.id OR
      gpb.item2 = gi.id OR
      gpb.item3 = gi.id OR
      gpb.item4 = gi.id OR
      gpb.item5 = gi.id OR
      gpb.item6 = gi.id OR
      gpb.item7 = gi.id
    )
    INNER JOIN GatheringType gt ON gpb.gatheringType = gt.id
    INNER JOIN ExportedGatheringPoint egp ON egp.id = gpb.id
    INNER JOIN GatheringPoint gp ON gp.gatheringPointBase = gpb.id
    INNER JOIN TerritoryType tt ON gp.territoryType = tt.id
    INNER JOIN ExVersion ev ON tt.exVersion = ev.id
    INNER JOIN Map m ON tt.map = m.id
    INNER JOIN PlaceName pn ON tt.placeName = pn.id
    LEFT JOIN GatheringSubCategory gsc ON gp.gatheringSubCategory = gsc.id
    INNER JOIN GatheringPointTransient gpt ON gp.id = gpt.id
    INNER JOIN GatheringRarePopTimeTable grptt ON gpt.gatheringRarePopTimeTable = grptt.id
    LEFT JOIN GatheringPointBonus gpbonus0 ON gpbonus0.id = gp.gatheringPointBonus0
    INNER JOIN GatheringCondition gc0 ON gpbonus0.'condition' = gc0.id
    INNER JOIN GatheringPointBonusType gpbt0 ON gpbonus0.bonusType = gpbt0.id
    LEFT JOIN GatheringPointBonus gpbonus1 ON gpbonus1.id = gp.gatheringPointBonus1
    INNER JOIN GatheringCondition gc1 ON gpbonus1.'condition' = gc1.id
    INNER JOIN GatheringPointBonusType gpbt1 ON gpbonus1.bonusType = gpbt1.id
    INNER JOIN ItemUICategory iuc ON i.itemUICategory = iuc.id
    WHERE gi.item < 40000 AND gi.id != 0 AND pn.name != '' AND gi.enabled = 0
    ORDER BY gi.id
  `);
  let preProcessedGatheringData = parseGatheringData([
    ...rawPreProcessedGatheringData,
    ...rawPreProcessedNoteHiddenGatheringData,
  ]);

  // 为素材添加距离最近的传送点信息
  preProcessedGatheringData = preProcessedGatheringData.map((item) => ({
    ...item,
    gatheringPoints: item.gatheringPoints.map((gatheringPoint) => {
      const aetherytesForMap = aetheryteMap.get(gatheringPoint.mapId);
      let placeNameForAetheryte = gatheringPoint.placeName;
      if (aetherytesForMap && aetherytesForMap.length > 0) {
        const nearestAetheryte = getNearestAetheryte(aetherytesForMap, {
          x: gatheringPoint.x,
          y: gatheringPoint.y,
        });
        placeNameForAetheryte = nearestAetheryte.placeName;
      }
      return {
        ...gatheringPoint,
        placeNameForAetheryte,
      };
    }),
  }));

  // 判断素材项是否为限时出现的素材并添加相关标记
  preProcessedGatheringData = preProcessedGatheringData.map((item) => {
    let isRare = false;
    item.gatheringPoints.forEach((gatheringPoint) => {
      if (gatheringPoint.timeTable.length > 0) {
        isRare = true;
      }
    });
    return {
      ...item,
      isRare,
    };
  });

  // 读取精选素材数据
  const reduction = await db.all(`
    SELECT
      gi.id AS gatheringItem,
      targetItem.id AS targetItem,
      targetItem.name AS targetItemName,
      targetItem.icon AS targetItemIcon
    FROM Reduction redu
    INNER JOIN Item targetItem ON redu.targetItem = targetItem.id
    INNER JOIN Item rawItem ON redu.rawItem = rawItem.id
    INNER JOIN GatheringItem gi ON gi.item = rawItem.id
    ORDER BY GatheringItem, targetItem desc
  `);

  // 添加素材可精选出的道具信息
  preProcessedGatheringData = preProcessedGatheringData.map((item) => {
    const reduceResult = reduction
      .filter((_item) => _item.gatheringItem === item.id)
      .map((_item) => ({
        id: _item.targetItem,
        name: _item.targetItemName,
        icon: _item.targetItemIcon,
      }));
    return {
      ...item,
      isReducible: reduceResult.length > 0,
      reduceResult,
    };
  });

  // 处理素材精选关系信息
  const targetReductionItems = await db.all(`
    SELECT
      i.id AS id,
      i.name AS name,
      i.icon AS icon,
      i.description AS desc,
      iuc.name AS itemCategory
    FROM Item i
    INNER JOIN ItemUICategory iuc ON i.itemUICategory = iuc.id
    INNER JOIN Reduction redu ON redu.targetItem = i.id
    WHERE i.name != ''
    GROUP BY i.id
  `);
  const rawReductionItems = await db.all(`
    SELECT
      i.id AS id,
      i.name AS name,
      i.icon AS icon,
      gt.id AS gatheringType
    FROM Item i
    INNER JOIN Reduction redu ON redu.rawItem = i.id
    LEFT JOIN GatheringItem gi ON gi.item = i.id
    LEFT JOIN GatheringItemPoint gip ON gip.gatheringItem = gi.id
    LEFT JOIN GatheringPoint gp ON gip.gatheringPoint = gp.id
    LEFT JOIN GatheringPointBase gpb ON gpb.id = gp.gatheringPointBase
    LEFT JOIN GatheringType gt ON gpb.gatheringType = gt.id
    WHERE i.name != ''
    GROUP BY i.id
  `);
  const rawReduction = require(path.resolve(
    __dirname,
    "../data/json/reduction.json"
  ));
  const preProcessedReductionData = {};
  Object.entries(rawReduction).forEach(([targetItem, rawItems]) => {
    const currentReduction = {
      targetItem: targetReductionItems.find((item) => item.id == targetItem),
      rawItems: rawItems
        .map((id) => rawReductionItems.find((_item) => _item.id == id))
        .filter((item) => !!item),
    };
    if (currentReduction.targetItem) {
      preProcessedReductionData[targetItem] = currentReduction;
    }
  });
  // 将预处理的精选数据写入到 reductionData.json
  fs.rmSync(path.resolve(__dirname, "../../dist", "reductionData.json"), {
    force: true,
  });
  fs.writeFileSync(
    path.resolve(__dirname, "../../dist", "reductionData.json"),
    JSON.stringify(preProcessedReductionData)
  );
  console.log(
    `成功处理 ${
      Object.keys(preProcessedReductionData).length
    } 条数据 -> reductionData.json`
  );

  // 将预处理的采集项数据写入到 gatheringData.json
  fs.rmSync(path.resolve(__dirname, "../../dist", "gatheringData.json"), {
    force: true,
  });
  fs.writeFileSync(
    path.resolve(__dirname, "../../dist", "gatheringData.json"),
    JSON.stringify(preProcessedGatheringData)
  );
  console.log(
    `成功处理 ${preProcessedGatheringData.length} 条数据 -> gatheringData.json`
  );

  // 预处理 GatheringPointBase
  const rawGatheringPointBaseData = await db.all(`
    SELECT
      gpb.id AS id,
      gi.id AS gatheringItemId,
      gi.isHidden AS isHidden,
      i.name AS name,
      i.icon AS icon,
      gilct.gatheringItemLevel AS gatheringLevel,
      gilct.stars AS gatheringItemStars
    FROM GatheringPointBase gpb
    INNER JOIN GatheringPoint gp ON gpb.id = gp.gatheringPointBase
    INNER JOIN GatheringItemPoint gip ON gp.id = gip.gatheringPoint
    INNER JOIN GatheringItem gi ON gi.id = gip.gatheringItem
    INNER JOIN Item i ON gi.item = i.id
    INNER JOIN GatheringItemLevelConvertTable gilct ON gi.gatheringItemLevel = gilct.id
    UNION
    SELECT
      gpb.id AS id,
      gi.id AS gatheringItemId,
      gi.isHidden AS isHidden,
      i.name AS name,
      i.icon AS icon,
      gilct.gatheringItemLevel AS gatheringLevel,
      gilct.stars AS gatheringItemStars
    FROM GatheringPointBase gpb
    INNER JOIN GatheringItem gi ON (
      gpb.item0 = gi.id OR
      gpb.item1 = gi.id OR
      gpb.item2 = gi.id OR
      gpb.item3 = gi.id OR
      gpb.item4 = gi.id OR
      gpb.item5 = gi.id OR
      gpb.item6 = gi.id OR
      gpb.item7 = gi.id
    )
    INNER JOIN Item i ON gi.item = i.id
    INNER JOIN GatheringItemLevelConvertTable gilct ON gi.gatheringItemLevel = gilct.id
    WHERE gi.item < 40000 AND gi.enabled = 0
    ORDER BY gpb.id
  `);
  let preProcessedGatheringPointBaseData = parseGatheringPointBaseData(
    rawGatheringPointBaseData
  );

  // 将预处理的采集项数据写入到 gatheringPointBase.json
  fs.rmSync(path.resolve(__dirname, "../../dist", "gatheringPointBase.json"), {
    force: true,
  });
  fs.writeFileSync(
    path.resolve(__dirname, "../../dist", "gatheringPointBase.json"),
    JSON.stringify(preProcessedGatheringPointBaseData)
  );
  console.log(
    `成功处理 ${preProcessedGatheringPointBaseData.length} 条数据 -> gatheringPointBase.json`
  );
}

module.exports = { convertDbToJson };
