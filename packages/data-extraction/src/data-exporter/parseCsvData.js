const checkRequiredFiles = require("../utils/checkRequiredFiles");
const parseCsv = require("../utils/parseCsv");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { createProgressBar } = require("../utils/terminalProgressBar");
const { getCoords } = require("../utils/mapCoordinate");
const { parseArray } = require("../utils/csvUtils");

/**
 * 处理CSV数据
 */
async function extractDataFromCsv() {
  /**
   * 控制台进度条
   */
  const progressBarInstance = createProgressBar(
    "zh_cn",
    path.resolve(__dirname, "../config/dataExporterSteps.json")
  );

  /**
   * 检查数据文件是否存在
   */
  progressBarInstance.next();
  const missingFiles = checkRequiredFiles();

  if (missingFiles.length > 0) {
    console.error("\n[ERROR]: 缺少必要的数据。请将以下文件放到 /data 中");
    missingFiles.forEach((item) => {
      console.error(` - ${item}`);
    });
    throw new Error();
  }

  progressBarInstance.next();
  // 删除旧版本数据库文件
  fs.rmSync(path.join(__dirname, "../../dist/database.db"), {
    force: true,
  });
  if (!fs.statSync(path.resolve(__dirname, "../../dist"))) {
    fs.mkdirSync(path.resolve(__dirname, "../../dist"));
  }

  // 连接数据库
  const db = await open({
    filename: path.join(__dirname, "../../dist/database.db"),
    driver: sqlite3.Database,
  });

  // 读取 ItemUICategory.csv
  progressBarInstance.next();
  const itemUICategory = await parseCsv("ItemUICategory.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 1,
        name: "name",
        type: "string",
      },
    ],
  });

  // 将 ItemUICategory 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE ItemUICategory (
      id INTEGER NOT NULL PRIMARY KEY,
      name TEXT
    )
  `);
  await db.run(`
    INSERT INTO ItemUICategory (id, name)
    VALUES ${itemUICategory.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, "${item.name}")`;
      } else {
        return `${prev}, (${item.id}, "${item.name}")`;
      }
    }, "")}
  `);

  // 读取 Item.csv
  progressBarInstance.next();
  const item = await parseCsv("Item.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 10,
        name: "name",
        type: "string",
      },
      {
        index: 9,
        name: "description",
        type: "string",
      },
      {
        index: 11,
        name: "icon",
        type: "integer",
      },
      {
        index: 16,
        name: "itemUICategory",
        type: "integer",
      },
    ],
  });

  // 将 Item 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE Item (
      id INTEGER NOT NULL PRIMARY KEY,
      name TEXT,
      description TEXT,
      icon INTEGER,
      itemUICategory INTEGER,
      FOREIGN KEY(itemUICategory) references ItemUICategory(id)
    )
  `);
  await db.run(`
    INSERT INTO Item (id, name, description, icon, itemUICategory)
    VALUES ${item.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, "${item.name}", "${item.description}", ${item.icon}, ${item.itemUICategory})`;
      } else {
        return `${prev}, (${item.id}, "${item.name}", "${item.description}", ${item.icon}, ${item.itemUICategory})`;
      }
    }, "")}
  `);

  // 读取 reduction.json
  // https://github.com/ffxiv-teamcraft/ffxiv-teamcraft/blob/staging/libs/data/src/lib/json/reduction.json
  progressBarInstance.next();
  const reduction = require(path.resolve(
    __dirname,
    "../data/json/reduction.json"
  ));

  // 将 Reduction 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE Reduction (
      key TEXT NOT NULL PRIMARY KEY,
      targetItem INTEGER NOT NULL,
      rawItem INTEGER NOT NULL,
      FOREIGN KEY (targetItem) REFERENCES Item(id),
      FOREIGN KEY (rawItem) REFERENCES Item(id)
    )
  `);
  await db.run(`
    INSERT INTO Reduction (key, targetItem, rawItem)
    VALUES ${Object.entries(reduction).reduce(
      (prev, [targetItem, rawItems], idx) => {
        if (idx === 0) {
          return rawItems.reduce((_prev, rawItem, _idx) => {
            if (_idx === 0) {
              return `('${targetItem}.${_idx}', ${targetItem}, ${rawItem})`;
            } else {
              return `${_prev}, ('${targetItem}.${_idx}', ${targetItem}, ${rawItem})`;
            }
          }, "");
        } else {
          return `${prev}, ${rawItems.reduce((_prev, rawItem, _idx) => {
            if (_idx === 0) {
              return `('${targetItem}.${_idx}', ${targetItem}, ${rawItem})`;
            } else {
              return `${_prev}, ('${targetItem}.${_idx}', ${targetItem}, ${rawItem})`;
            }
          }, "")}`;
        }
      },
      ""
    )}
  `);

  // 读取 GatheringItemLevelConvertTable.csv
  progressBarInstance.next();
  const gatheringItemLevelConvertTable = await parseCsv(
    "GatheringItemLevelConvertTable.csv",
    {
      columns: [
        {
          index: 0,
          name: "id",
          type: "integer",
        },
        {
          index: 1,
          name: "gatheringItemLevel",
          type: "integer",
        },
        {
          index: 2,
          name: "stars",
          type: "integer",
        },
      ],
    }
  );

  // 将 GatheringItemLevelConvertTable 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE GatheringItemLevelConvertTable (
      id INTEGER NOT NULL PRIMARY KEY,
      gatheringItemLevel INTEGER NOT NULL,
      stars INTEGER NOT NULL
    )
  `);
  await db.run(`
      INSERT INTO GatheringItemLevelConvertTable (id, gatheringItemLevel, stars)
      VALUES ${gatheringItemLevelConvertTable.results.reduce(
        (prev, item, idx) => {
          if (idx === 0) {
            return `(${item.id}, ${item.gatheringItemLevel}, ${item.stars})`;
          } else {
            return `${prev}, (${item.id}, ${item.gatheringItemLevel}, ${item.stars})`;
          }
        },
        ""
      )}
  `);

  // 读取 GatheringType.csv
  progressBarInstance.next();
  const gatheringType = await parseCsv("GatheringType.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 1,
        name: "name",
        type: "string",
      },
    ],
  });

  // 将 GatheringType 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE GatheringType (
      id INTEGER NOT NULL PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);
  await db.run(`
      INSERT INTO GatheringType (id, name)
      VALUES ${gatheringType.results.reduce((prev, item, idx) => {
        if (idx === 0) {
          return `(${item.id}, "${item.name}")`;
        } else {
          return `${prev}, (${item.id}, "${item.name}")`;
        }
      }, "")}
  `);

  // 读取 GatheringCondition.csv
  progressBarInstance.next();
  const gatheringCondition = await parseCsv("GatheringCondition.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 1,
        name: "text",
        type: "string",
      },
    ],
  });

  // 将 GatheringCondition 写入到数据库
  progressBarInstance.next();
  await db.run(`
      CREATE TABLE GatheringCondition (
        id INTEGER NOT NULL PRIMARY KEY,
        text TEXT
      )
    `);
  await db.run(`
        INSERT INTO GatheringCondition (id, text)
        VALUES ${gatheringCondition.results.reduce((prev, item, idx) => {
          if (idx === 0) {
            return `(${item.id}, "${item.text}")`;
          } else {
            return `${prev}, (${item.id}, "${item.text}")`;
          }
        }, "")}
    `);

  // 读取 GatheringPointBonusType.csv
  progressBarInstance.next();
  const gatheringPointBonusType = await parseCsv(
    "GatheringPointBonusType.csv",
    {
      columns: [
        {
          index: 0,
          name: "id",
          type: "integer",
        },
        {
          index: 1,
          name: "text",
          type: "string",
        },
      ],
    }
  );

  // 将 GatheringPointBonusType 写入到数据库
  progressBarInstance.next();
  await db.run(`
      CREATE TABLE GatheringPointBonusType (
        id INTEGER NOT NULL PRIMARY KEY,
        text TEXT
      )
    `);
  await db.run(`
        INSERT INTO GatheringPointBonusType (id, text)
        VALUES ${gatheringPointBonusType.results.reduce((prev, item, idx) => {
          if (idx === 0) {
            return `(${item.id}, "${item.text}")`;
          } else {
            return `${prev}, (${item.id}, "${item.text}")`;
          }
        }, "")}
    `);

  // 读取 GatheringRarePopTimeTable.csv
  progressBarInstance.next();
  const gatheringRarePopTimeTable = await parseCsv(
    "GatheringRarePopTimeTable.csv",
    {
      columns: [
        {
          index: 0,
          name: "id",
          type: "integer",
        },
        {
          index: 1,
          name: "startTime0",
          type: "integer",
        },
        {
          index: 2,
          name: "duration0",
          type: "integer",
        },
        {
          index: 3,
          name: "startTime1",
          type: "integer",
        },
        {
          index: 4,
          name: "duration1",
          type: "integer",
        },
        {
          index: 5,
          name: "startTime2",
          type: "integer",
        },
        {
          index: 6,
          name: "duration2",
          type: "integer",
        },
      ],
    }
  );

  // 将 GatheringRarePopTimeTable 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE GatheringRarePopTimeTable (
      id INTEGER NOT NULL PRIMARY KEY,
      startTime0 INTEGER NOT NULL,
      duration0 INTEGER NOT NULL,
      startTime1 INTEGER NOT NULL,
      duration1 INTEGER NOT NULL,
      startTime2 INTEGER NOT NULL,
      duration2 INTEGER NOT NULL
    )
  `);
  await db.run(`
    INSERT INTO GatheringRarePopTimeTable (id, startTime0, duration0, startTime1, duration1, startTime2, duration2)
    VALUES ${gatheringRarePopTimeTable.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, ${item.startTime0}, ${item.duration0}, ${item.startTime1}, ${item.duration1},${item.startTime2}, ${item.duration2})`;
      } else {
        return `${prev}, (${item.id}, ${item.startTime0}, ${item.duration0}, ${item.startTime1}, ${item.duration1},${item.startTime2}, ${item.duration2})`;
      }
    }, "")}
  `);

  // 读取 ClassJob.csv
  progressBarInstance.next();
  const classJob = await parseCsv("ClassJob.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 1,
        name: "name",
        type: "string",
      },
      {
        index: 3,
        name: "abbreviation",
        type: "string",
      },
    ],
  });

  // 将 ClassJob 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE ClassJob (
      id INTEGER NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      abbreviation TEXT
    )
  `);
  await db.run(`
    INSERT INTO ClassJob (id, name, abbreviation)
    VALUES ${classJob.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, "${item.name}", "${item.abbreviation}")`;
      } else {
        return `${prev}, (${item.id}, "${item.name}", "${item.abbreviation}")`;
      }
    }, "")}
  `);

  // 读取 PlaceName.csv
  progressBarInstance.next();
  const placeName = await parseCsv("PlaceName.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 1,
        name: "name",
        type: "string",
      },
    ],
  });

  // 将 PlaceName 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE PlaceName (
      id INTEGER NOT NULL PRIMARY KEY,
      name TEXT
    )
  `);
  await db.run(`
    INSERT INTO PlaceName (id, name)
    VALUES ${placeName.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, "${item.name}")`;
      } else {
        return `${prev}, (${item.id}, "${item.name}")`;
      }
    }, "")}
  `);

  // 读取 Map.csv
  progressBarInstance.next();
  const map = await parseCsv("Map.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 7,
        name: "mapId",
        type: "string",
      },
      {
        index: 8,
        name: "sizeFactor",
        type: "integer",
      },
      {
        index: 9,
        name: "offsetX",
        type: "integer",
      },
      {
        index: 10,
        name: "offsetY",
        type: "integer",
      },
      {
        index: 11,
        name: "placeNameForRegion",
        type: "integer",
      },
      {
        index: 12,
        name: "placeName",
        type: "integer",
      },
    ],
  });

  // 将 Map 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE Map (
      id INTEGER NOT NULL PRIMARY KEY,
      mapId TEXT,
      placeNameForRegion INTEGER NOT NULL,
      placeName INTEGER NOT NULL,
      sizeFactor INTEGER NOT NULL,
      offsetX INTEGER NOT NULL,
      offsetY INTEGER NOT NULL,
      FOREIGN KEY(placeNameForRegion) REFERENCES PlaceName(id),
      FOREIGN KEY(placeName) REFERENCES PlaceName(id)
    )
  `);
  await db.run(`
    INSERT INTO Map (id, mapId, placeNameForRegion, placeName, sizeFactor, offsetX, offsetY)
    VALUES ${map.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, "${item.mapId}", ${item.placeNameForRegion}, ${item.placeName}, ${item.sizeFactor}, ${item.offsetX}, ${item.offsetY})`;
      } else {
        return `${prev}, (${item.id}, "${item.mapId}", ${item.placeNameForRegion}, ${item.placeName}, ${item.sizeFactor}, ${item.offsetX}, ${item.offsetY})`;
      }
    }, "")}
  `);

  // 读取 ExportedGatheringPoint.csv
  progressBarInstance.next();
  const exportedGatheringPoint = await parseCsv("ExportedGatheringPoint.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 1,
        name: "x",
        type: "float",
      },
      {
        index: 2,
        name: "y",
        type: "float",
      },
      {
        index: 3,
        name: "gatheringType",
        type: "integer",
      },
      {
        index: 5,
        name: "radius",
        type: "integer",
      },
    ],
  });

  // 将 ExportedGatheringPoint 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE ExportedGatheringPoint (
      id INTEGER NOT NULL PRIMARY KEY,
      x REAL NOT NULL,
      y REAL NOT NULL,
      gatheringType INTEGER NOT NULL,
      radius INTEGER NOT NULL,
      coordConverted INTEGER NOT NULL default '0',
      FOREIGN KEY (gatheringType) REFERENCES GatheringType(id)
    )
  `);
  await db.run(`
    INSERT INTO ExportedGatheringPoint (id, x, y, gatheringType, radius)
    VALUES ${exportedGatheringPoint.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, ${item.x}, ${item.y}, ${item.gatheringType}, ${item.radius})`;
      } else {
        return `${prev}, (${item.id}, ${item.x}, ${item.y}, ${item.gatheringType}, ${item.radius})`;
      }
    }, "")}
  `);

  // 读取 GatheringItem.csv
  progressBarInstance.next();
  const gatheringItem = await parseCsv("GatheringItem.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 1,
        name: "item",
        type: "integer",
      },
      {
        index: 2,
        name: "gatheringItemLevel",
        type: "integer",
      },
      {
        index: 3,
        name: "enabled",
        type: "boolean",
      },
      {
        index: 6,
        name: "isHidden",
        type: "boolean",
      },
    ],
  });

  // 将 GatheringItem 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE GatheringItem (
      id INTEGER NOT NULL PRIMARY KEY,
      item INTEGER NOT NULL,
      gatheringItemLevel INTEGER NOT NULL,
      enabled INTEGER NOT NULL,
      isHidden INTEGER NOT NULL,
      FOREIGN KEY (item) REFERENCES Item(id),
      FOREIGN KEY (gatheringItemLevel) REFERENCES GatheringItemLevelConvertTable(id)
    )
  `);
  await db.run(`
    INSERT INTO GatheringItem (id, item, gatheringItemLevel, enabled, isHidden)
    VALUES ${gatheringItem.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, ${item.item}, ${item.gatheringItemLevel}, ${
          item.enabled ? 1 : 0
        }, ${item.isHidden ? 1 : 0})`;
      } else {
        return `${prev}, (${item.id}, ${item.item}, ${
          item.gatheringItemLevel
        }, ${item.enabled ? 1 : 0}, ${item.isHidden ? 1 : 0})`;
      }
    }, "")}
  `);

  // 读取 GatheringSubCategory.csv
  progressBarInstance.next();
  const gatheringSubCategory = await parseCsv("gatheringSubCategory.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 1,
        name: "gatheringType",
        type: "integer",
      },
      {
        index: 2,
        name: "classJob",
        type: "integer",
      },
      {
        index: 6,
        name: "folkloreBook",
        type: "string",
      },
    ],
  });

  // 将 GatheringSubCategory 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE GatheringSubCategory (
      id INTEGER NOT NULL PRIMARY KEY,
      gatheringType INTEGER NOT NULL,
      classJob INTEGER NOT NULL,
      folkloreBook TEXT,
      FOREIGN KEY (gatheringType) REFERENCES GatheringType(id),
      FOREIGN KEY (classJob) REFERENCES ClassJob(id)
    )
  `);
  await db.run(`
    INSERT INTO GatheringSubCategory (id, gatheringType, classJob, folkloreBook)
    VALUES ${gatheringSubCategory.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, ${item.gatheringType}, ${item.classJob}, "${item.folkloreBook}")`;
      } else {
        return `${prev}, (${item.id}, ${item.gatheringType}, ${item.classJob}, "${item.folkloreBook}")`;
      }
    }, "")}
  `);

  // 读取 GatheringPointBonus.csv
  progressBarInstance.next();
  const gatheringPointBonus = await parseCsv("GatheringPointBonus.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 1,
        name: "condition",
        type: "integer",
      },
      {
        index: 2,
        name: "conditionValueFrom",
        type: "integer",
      },
      {
        index: 3,
        name: "conditionValueTo",
        type: "integer",
      },
      {
        index: 4,
        name: "bonusType",
        type: "integer",
      },
      {
        index: 5,
        name: "bonusValueFrom",
        type: "integer",
      },
      {
        index: 6,
        name: "bonusValueTo",
        type: "integer",
      },
    ],
  });

  // 将 GatheringPointBonus 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE GatheringPointBonus(
      id INTEGER NOT NULL PRIMARY KEY,
      condition INTEGER NOT NULL,
      conditionValueFrom INTEGER NOT NULL,
      conditionValueTo INTEGER NOT NULL,
      bonusType INTEGER NOT NULL,
      bonusValueFrom INTEGER NOT NULL,
      bonusValueTo INTEGER NOT NULL,
      FOREIGN KEY (condition) REFERENCES GatheringCondition(id),
      FOREIGN KEY (bonusType) REFERENCES GatheringPointBonusType(id)
    )
  `);
  await db.run(`
    INSERT INTO GatheringPointBonus(id, condition, conditionValueFrom, conditionValueTo, bonusType, bonusValueFrom, bonusValueTo)
    VALUES ${gatheringPointBonus.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, ${item.condition}, ${item.conditionValueFrom}, ${item.conditionValueTo}, ${item.bonusType}, ${item.bonusValueFrom}, ${item.bonusValueTo})`;
      } else {
        return `${prev}, (${item.id}, ${item.condition}, ${item.conditionValueFrom}, ${item.conditionValueTo}, ${item.bonusType}, ${item.bonusValueFrom}, ${item.bonusValueTo})`;
      }
    }, "")}
  `);

  // 读取 GatheringPointTransient.csv
  progressBarInstance.next();
  const gatheringPointTransient = await parseCsv(
    "GatheringPointTransient.csv",
    {
      columns: [
        {
          index: 0,
          name: "id",
          type: "integer",
        },
        {
          index: 1,
          name: "ephemeralStartTime",
          type: "integer",
        },
        {
          index: 2,
          name: "ephemeralEndTime",
          type: "integer",
        },
        {
          index: 3,
          name: "gatheringRarePopTimeTable",
          type: "integer",
        },
      ],
    }
  );

  // 将 GatheringPointTransient 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE GatheringPointTransient (
      id INTEGER NOT NULL PRIMARY KEY,
      ephemeralStartTime INTEGER NOT NULL,
      ephemeralEndTime INTEGER NOT NULL,
      gatheringRarePopTimeTable INTEGER NOT NULL,
      FOREIGN KEY (gatheringRarePopTimeTable) REFERENCES GatheringRarePopTimeTable(id)
    )
  `);
  await db.run(`
    INSERT INTO GatheringPointTransient(id, ephemeralStartTime, ephemeralEndTime, gatheringRarePopTimeTable)
    VALUES ${gatheringPointTransient.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, ${item.ephemeralStartTime}, ${item.ephemeralEndTime}, ${item.gatheringRarePopTimeTable})`;
      } else {
        return `${prev}, (${item.id}, ${item.ephemeralStartTime}, ${item.ephemeralEndTime}, ${item.gatheringRarePopTimeTable})`;
      }
    }, "")}
  `);

  // 读取 ExVersion.csv
  progressBarInstance.next();
  const exVersion = await parseCsv("ExVersion.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 1,
        name: "name",
        type: "string",
      },
    ],
  });

  // 将 ExVersion 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE ExVersion (
      id INTEGER NOT NULL PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);
  await db.run(`
    INSERT INTO ExVersion (id, name)
    VALUES ${exVersion.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, "${item.name}")`;
      } else {
        return `${prev}, (${item.id}, "${item.name}")`;
      }
    }, "")}
  `);

  // 读取 aetherytes.json
  // https://github.com/ffxiv-teamcraft/ffxiv-teamcraft/blob/staging/libs/data/src/lib/json/aetherytes.json
  progressBarInstance.next();
  const aetheryte = require(path.resolve(
    __dirname,
    "../data/json/aetherytes.json"
  ));

  // 将 Aetheryte 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE Aetheryte (
      id INTEGER NOT NULL PRIMARY KEY,
      placeName INTEGER NOT NULL,
      mapId INTEGER NOT NULL,
      x REAL NOT NULL,
      y REAL NOT NULL,
      z REAL NOT NULL,
      type INTEGER NOT NULL,
      FOREIGN KEY (placeName) REFERENCES PlaceName(id),
      FOREIGN KEY (mapId) REFERENCES Map(id)
    )
  `);
  await db.run(`
    INSERT INTO Aetheryte (id, placeName, mapId, x, y, z, type)
    VALUES ${aetheryte.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, ${item.nameid}, ${item.map}, ${item.x}, ${item.y}, ${item.z}, ${item.type})`;
      } else {
        return `${prev}, (${item.id}, ${item.nameid}, ${item.map}, ${item.x}, ${item.y}, ${item.z}, ${item.type})`;
      }
    }, "")}
  `);

  // 读取 TerritoryType.csv
  progressBarInstance.next();
  const territoryType = await parseCsv("TerritoryType.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 1,
        name: "name",
        type: "string",
      },
      {
        index: 4,
        name: "placeNameForRegion",
        type: "integer",
      },
      {
        index: 5,
        name: "placeNameForZone",
        type: "integer",
      },
      {
        index: 6,
        name: "placeName",
        type: "integer",
      },
      {
        index: 7,
        name: "map",
        type: "integer",
      },
      {
        index: 25,
        name: "aetheryte",
        type: "integer",
      },
      {
        index: 30,
        name: "exVersion",
        type: "integer",
      },
    ],
  });

  // 将 TerritoryType.csv 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE TerritoryType (
      id INTEGER NOT NULL PRIMARY KEY,
      name TEXT,
      placeNameForRegion INTEGER NOT NULL,
      placeNameForZone INTEGER NOT NULL,
      placeName INTEGER NOT NULL,
      map INTEGER NOT NULL,
      aetheryte INTEGER NOT NULL,
      exVersion INTEGER NOT NULL,
      FOREIGN KEY (placeNameForRegion) REFERENCES PlaceName(id),
      FOREIGN KEY (placeNameForZone) REFERENCES PlaceName(id),
      FOREIGN KEY (placeName) REFERENCES PlaceName(id),
      FOREIGN KEY (map) REFERENCES Map(id),
      FOREIGN KEY (aetheryte) REFERENCES Aetheryte (id),
      FOREIGN KEY (exVersion) REFERENCES ExVersion(id)
    )
  `);
  await db.run(`
    INSERT INTO TerritoryType (id, name, placeNameForRegion, placeNameForZone, placeName, map, aetheryte, exVersion)
    VALUES ${territoryType.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, "${item.name}", ${item.placeNameForRegion}, ${item.placeNameForZone}, ${item.placeName}, ${item.map}, ${item.aetheryte}, ${item.exVersion})`;
      } else {
        return `${prev}, (${item.id}, "${item.name}", ${item.placeNameForRegion}, ${item.placeNameForZone}, ${item.placeName}, ${item.map}, ${item.aetheryte}, ${item.exVersion})`;
      }
    }, "")}
  `);

  // 读取 GatheringPointBase.csv
  progressBarInstance.next();
  const gatheringPointBase = await parseCsv("GatheringPointBase.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 1,
        name: "gatheringType",
        type: "integer",
      },
      {
        index: 2,
        name: "gatheringLevel",
        type: "integer",
      },
      {
        index: 3,
        name: "item0",
        type: "integer",
      },
      {
        index: 4,
        name: "item1",
        type: "integer",
      },
      {
        index: 5,
        name: "item2",
        type: "integer",
      },
      {
        index: 6,
        name: "item3",
        type: "integer",
      },
      {
        index: 7,
        name: "item4",
        type: "integer",
      },
      {
        index: 8,
        name: "item5",
        type: "integer",
      },
      {
        index: 9,
        name: "item6",
        type: "integer",
      },
      {
        index: 10,
        name: "item7",
        type: "integer",
      },
    ],
  });

  // 将 GatheringPointBase 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE GatheringPointBase (
      id INTEGER NOT NULL PRIMARY KEY,
      gatheringType INTEGER NOT NULL,
      gatheringLevel INTEGER NOT NULL,
      item0 INTEGER NOT NULL,
      item1 INTEGER NOT NULL,
      item2 INTEGER NOT NULL,
      item3 INTEGER NOT NULL,
      item4 INTEGER NOT NULL,
      item5 INTEGER NOT NULL,
      item6 INTEGER NOT NULL,
      item7 INTEGER NOT NULL,
      FOREIGN KEY (gatheringType) REFERENCES GatheringType(id),
      FOREIGN KEY (item0) REFERENCES GatheringItem(id),
      FOREIGN KEY (item1) REFERENCES GatheringItem(id),
      FOREIGN KEY (item2) REFERENCES GatheringItem(id),
      FOREIGN KEY (item3) REFERENCES GatheringItem(id),
      FOREIGN KEY (item4) REFERENCES GatheringItem(id),
      FOREIGN KEY (item5) REFERENCES GatheringItem(id),
      FOREIGN KEY (item6) REFERENCES GatheringItem(id),
      FOREIGN KEY (item7) REFERENCES GatheringItem(id)
    )
  `);
  await db.run(`
    INSERT INTO GatheringPointBase (id, gatheringType, gatheringLevel, item0, item1, item2, item3, item4, item5, item6, item7)
    VALUES ${gatheringPointBase.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, ${item.gatheringType}, ${item.gatheringLevel}, ${item.item0}, ${item.item1}, ${item.item2}, ${item.item3}, ${item.item4}, ${item.item5}, ${item.item6}, ${item.item7})`;
      } else {
        return `${prev}, (${item.id}, ${item.gatheringType}, ${item.gatheringLevel}, ${item.item0}, ${item.item1}, ${item.item2}, ${item.item3}, ${item.item4}, ${item.item5}, ${item.item6}, ${item.item7})`;
      }
    }, "")}
  `);

  // 读取 GatheringPoint.csv
  progressBarInstance.next();
  const gatheringPoint = await parseCsv("GatheringPoint.csv", {
    columns: [
      {
        index: 0,
        name: "id",
        type: "integer",
      },
      {
        index: 3,
        name: "gatheringPointBase",
        type: "integer",
      },
      {
        index: 5,
        name: "gatheringPointBonus0",
        type: "integer",
      },
      {
        index: 6,
        name: "gatheringPointBonus1",
        type: "integer",
      },
      {
        index: 7,
        name: "territoryType",
        type: "integer",
      },
      {
        index: 8,
        name: "placeName",
        type: "integer",
      },
      {
        index: 9,
        name: "gatheringSubCategory",
        type: "integer",
      },
    ],
  });

  // 将 GatheringPoint 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE GatheringPoint (
      id INTEGER NOT NULL PRIMARY KEY,
      gatheringPointBase INTEGER NOT NULL,
      gatheringPointBonus0 INTEGER NOT NULL,
      gatheringPointBonus1 INTEGER NOT NULL,
      placeName INTEGER NOT NULL,
      territoryType INTEGER NOT NULL,
      gatheringSubCategory INTEGER NOT NULL,
      FOREIGN KEY (gatheringPointBase) REFERENCES GatheringPointBase(id),
      FOREIGN KEY (gatheringPointBonus0) REFERENCES GatheringPointBonus(id),
      FOREIGN KEY (gatheringPointBonus1) REFERENCES GatheringPointBonus(id),
      FOREIGN KEY (placeName) REFERENCES PlaceName(id),
      FOREIGN KEY (territoryType) REFERENCES TerritoryType(id),
      FOREIGN KEY (gatheringSubCategory) REFERENCES GatheringSubCategory(id)
    )
  `);
  await db.run(`
    INSERT INTO GatheringPoint (id, gatheringPointBase, gatheringPointBonus0, gatheringPointBonus1, placeName, territoryType, gatheringSubCategory)
    VALUES ${gatheringPoint.results.reduce((prev, item, idx) => {
      if (idx === 0) {
        return `(${item.id}, ${item.gatheringPointBase}, ${item.gatheringPointBonus0}, ${item.gatheringPointBonus1}, ${item.placeName}, ${item.territoryType}, ${item.gatheringSubCategory})`;
      } else {
        return `${prev}, (${item.id}, ${item.gatheringPointBase}, ${item.gatheringPointBonus0}, ${item.gatheringPointBonus1}, ${item.placeName}, ${item.territoryType}, ${item.gatheringSubCategory})`;
      }
    }, "")}
  `);

  // 读取 GatheringItemPoint.csv
  progressBarInstance.next();
  const flatGatheringItemPoint = await parseCsv("GatheringItemPoint.csv", {
    columns: [
      {
        index: 0,
        name: "key",
        type: "string",
      },
      {
        index: 1,
        name: "gatheringPointId",
        type: "integer",
      },
    ],
  });

  // 将 GatheringItemPoint 写入到数据库
  progressBarInstance.next();
  await db.run(`
    CREATE TABLE GatheringItemPoint (
      key TEXT NOT NULL PRIMARY KEY,
      gatheringPoint INTEGER NOT NULL,
      gatheringItem INTEGER NOT NULL,
      FOREIGN KEY (gatheringPoint) REFERENCES GatheringPoint(id),
      FOREIGN KEY (gatheringItem) REFERENCES GatheringItem(id)
    )
  `);
  const { map: gatheringItemPointMap } = parseArray(
    flatGatheringItemPoint.results,
    "key"
  );
  await db.run(`
    INSERT INTO GatheringItemPoint (key, gatheringPoint, gatheringItem)
    VALUES ${[...gatheringItemPointMap.entries()].reduce(
      (prev, [_, value], idx) => {
        if (idx === 0) {
          return value.reduce((prevVal, currVal, valIdx) => {
            if (valIdx === 0) {
              return `('${currVal.key.originKey}', ${currVal.data.gatheringPointId} ,${currVal.key.majorKey})`;
            } else {
              return `${prevVal}, ('${currVal.key.originKey}', ${currVal.data.gatheringPointId} ,${currVal.key.majorKey})`;
            }
          }, "");
        } else {
          return value.reduce((prevVal, currVal, valIdx) => {
            if (valIdx === 0) {
              return `${prev}, ('${currVal.key.originKey}', ${currVal.data.gatheringPointId} ,${currVal.key.majorKey})`;
            } else {
              return `${prevVal}, ('${currVal.key.originKey}', ${currVal.data.gatheringPointId} ,${currVal.key.majorKey})`;
            }
          }, "");
        }
      },
      ""
    )}
  `);

  // 计算 Map 表中的坐标
  progressBarInstance.next();
  const coordinateInfo = await db.all(`
    SELECT
      egp.id AS id,
      egp.x AS x,
      egp.y AS y,
      m.sizeFactor AS sizeFactor,
      m.offsetX AS offsetX,
      m.offsetY AS offsetY
    FROM ExportedGatheringPoint egp
    LEFT JOIN GatheringPoint gp ON egp.id = gp.gatheringPointBase
    LEFT JOIN TerritoryType tt ON gp.territoryType = tt.id
    LEFT JOIN Map m ON tt.map = m.id
    GROUP BY egp.id;
  `);
  const convertedCoordinate = coordinateInfo.map((value, index) => {
    if (
      value.sizeFactor === null ||
      value.offsetX == null ||
      value.offsetY == null
    ) {
      return {
        id: value.id,
        x: value.x,
        y: value.y,
        converted: 0,
      };
    }
    const result = getCoords(
      {
        x: value.x,
        y: value.y,
        z: 0,
      },
      {
        size_factor: value.sizeFactor,
        offset_y: value.offsetY,
        offset_x: value.offsetX,
        offset_z: 0,
      }
    );
    return {
      id: value.id,
      x: result.x,
      y: result.y,
      converted: 1,
    };
  });

  // 将转换后的坐标写入到 Map 表
  progressBarInstance.next();
  await new Promise((resolve) => {
    db.getDatabaseInstance().serialize(function () {
      db.run("BEGIN");
      convertedCoordinate.forEach((item) => {
        db.run(`
            UPDATE ExportedGatheringPoint
            SET x = ${item.x}, y = ${item.y}, coordConverted = ${item.converted}
            WHERE id = ${item.id}
          `);
      });
      db.run("COMMIT");
      resolve();
    });
  });

  progressBarInstance.next();
}

module.exports = {
  extractDataFromCsv,
};
