const { createProgressBar } = require("../utils/terminalProgressBar");
const fs = require("fs");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { default: SQL } = require("sql-template-strings");

/**
 * 初始化进度条
 */
const progressBarInstance = createProgressBar(
  "zh_cn",
  path.resolve(__dirname, "../config/iconExporterSteps.json")
);

/**
 * 检查数据库是否存在
 */
progressBarInstance.next();
if (
  !fs.statSync(path.resolve(__dirname, "../../dist/database.db"), {
    throwIfNoEntry: false,
  })
) {
  console.error("[ERROR]: 数据库文件不存在");
  console.error(` - ${path.resolve(__dirname, "../../dist/database.db")}`);
  return;
}

async function extractRequiredIcons() {
  /**
   * 初始化数据库连接
   */
  progressBarInstance.next();
  const db = await open({
    driver: sqlite3.Database,
    filename: path.resolve(__dirname, "../../dist/database.db"),
  });

  /**
   * 获取所有采集项目的图标ID
   */
  progressBarInstance.next();
  const iconIds = await db.all(SQL`
    SELECT i.icon AS iconId, i.name AS itemName
    FROM Item i
    INNER JOIN GatheringItem gi ON i.id = gi.item
    WHERE iconId != 0
    GROUP BY iconId
    UNION
    SELECT i.icon AS iconId, i.name AS itemName
    FROM Item i
    INNER JOIN Reduction redu ON redu.targetItem = i.id
    WHERE i.name != ''
    GROUP BY iconId
    UNION
    SELECT i.icon AS iconId, i.name AS itemName
    FROM Item i
    INNER JOIN Reduction redu ON redu.rawItem = i.id
    WHERE i.name != ''
    GROUP BY iconId
    ORDER BY iconId ASC
  `);

  /**
   * 生成图标资源的相对路径
   */
  progressBarInstance.next();
  const iconFilePath = iconIds.map((item) => {
    const categoryId = Math.floor(item.iconId / 1000) * 1000;
    const tempStrArr = item.iconId.toString().match(/[0-9]/g);
    const tempCatArr = categoryId.toString().match(/[0-9]/g);
    const requiredLength = 6;
    const currentLength = tempStrArr.length;
    for (let i = 0; i < requiredLength - currentLength; i += 1) {
      tempStrArr.unshift("0");
      tempCatArr.unshift("0");
    }
    return {
      relativePath: `./${tempCatArr.join("")}/${tempStrArr.join("")}.png`,
      fileName: `${item.iconId}.png`,
    };
  });

  /**
   * 准备output目录
   */
  progressBarInstance.next();
  fs.rmSync(path.resolve(__dirname, "../../dist/itemIcons"), {
    force: true,
    recursive: true,
    maxRetries: 1,
  });
  fs.mkdirSync(path.resolve(__dirname, "../../dist/itemIcons"));

  /**
   * 从资源库中提取需要的文件资源
   */
  progressBarInstance.next();
  let successCount = 0;
  const failIds = [];
  iconIds.forEach((item, index) => {
    try {
      fs.copyFileSync(
        path.resolve(
          __dirname,
          "../data/icon",
          iconFilePath[index].relativePath
        ),
        path.resolve(
          __dirname,
          "../../dist/itemIcons",
          iconFilePath[index].fileName
        )
      );
      successCount += 1;
    } catch {
      failIds.push(iconIds[index]);
    }
  });

  progressBarInstance.next();
  if (failIds.length > 0) {
    console.error("[ERROR]: 以下资源提取失败");
    failIds.forEach((item) => {
      console.error(` - ${item.iconId} | ${item.itemName}`);
    });
  } else {
    console.log(`成功处理 ${successCount} 个图标资源 -> /dist/itemIcons`);
  }
}

module.exports = {
  extractRequiredIcons,
};
