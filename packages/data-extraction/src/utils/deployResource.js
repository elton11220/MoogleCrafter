const fs = require("fs-extra");
const deploymentStrategy = require("../config/deploymentStrategy");

function deployResource() {
  deploymentStrategy.forEach((resInfo) => {
    fs.removeSync(resInfo.dest);
    fs.copySync(resInfo.source, resInfo.dest, {
      overwrite: true,
    });
  });
}

module.exports = deployResource;
