const { extractDataFromCsv, convertDbToJson } = require("./src/data-exporter");
const { extractRequiredIcons } = require("./src/icon-exporter");
const deployResources = require("./src/utils/deployResource.js");

(async () => {
  await extractDataFromCsv();
  await extractRequiredIcons();
  await convertDbToJson();
  if (process.env.LERNA_PACKAGE_NAME) {
    // 如果在 lerna 环境中运行，则说明目前存在 monorepo 策略。将资源部署到 app 对应目录，否则只在 /dist 中输出资源文件
    deployResources();
  }
})();
