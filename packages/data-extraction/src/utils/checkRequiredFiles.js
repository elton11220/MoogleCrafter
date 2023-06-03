const fs = require("fs");
const path = require("path");
const requiredFiles = require(path.resolve(
  __dirname,
  "../config/requiredFiles.json"
));

module.exports = function checkRequiredFiles() {
  const fileTypes = Object.keys(requiredFiles);
  const missingFiles = [];
  fileTypes.forEach((fileType) => {
    const fileNames = requiredFiles[fileType];
    fileNames.forEach((fileName) => {
      const currentPath = path.resolve(
        __dirname,
        "../data",
        `./${fileType}`,
        `${fileName}.${fileType}`
      );
      const currentFullAbsolutePath = path.resolve(currentPath);
      if (!fs.statSync(currentFullAbsolutePath, { throwIfNoEntry: false })) {
        missingFiles.push(currentPath);
      }
    });
  });
  return missingFiles;
};
