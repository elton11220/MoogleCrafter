const { extractDataFromCsv, convertDbToJson } = require("./src/data-exporter");
const { extractRequiredIcons } = require("./src/icon-exporter");

(async () => {
  await extractDataFromCsv();
  await extractRequiredIcons();
  await convertDbToJson();
})();
