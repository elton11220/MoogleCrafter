const path = require("path");

module.exports = [
  {
    source: path.resolve(__dirname, "../../dist", "gatheringData.json"),
    dest: path.resolve(
      __dirname,
      "../../../app/src/data",
      "gatheringData.json"
    ),
  },
  {
    source: path.resolve(__dirname, "../../dist", "gatheringPointBase.json"),
    dest: path.resolve(
      __dirname,
      "../../../app/src/data",
      "gatheringPointBase.json"
    ),
  },
  {
    source: path.resolve(__dirname, "../../dist", "reductionData.json"),
    dest: path.resolve(
      __dirname,
      "../../../app/src/data",
      "reductionData.json"
    ),
  },
  {
    source: path.resolve(__dirname, "../../dist", "./itemIcons"),
    dest: path.resolve(
      __dirname,
      "../../../app/src/images/gameResource",
      "./itemIcons"
    ),
  },
];
