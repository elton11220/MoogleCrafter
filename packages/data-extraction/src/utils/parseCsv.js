const lineReader = require("line-reader");
const path = require("path");

module.exports = function parseCsv(fileName, options) {
  return new Promise((resolve) => {
    const defaultOptions = {
      beginRowIndex: 3,
      columns: [
        {
          index: 0,
          name: "id",
          type: "integer", // "integer" "float" "string" "boolean"
        },
      ],
    };
    const opts = {
      ...defaultOptions,
      ...options,
    };
    const results = [];
    let currentLine = 0; // 当前操作的项序号
    let errLinesCount = 0; // 错误行统计
    const unhandledLines = []; // 未处理的多行文本

    const handleItem = (currentWorkingLine) => {
      const columns = currentWorkingLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const item = {};
      opts.columns.forEach((columnOption) => {
        const pureValue = columns[columnOption.index].replaceAll('"', "");
        try {
          if (columnOption.type === "string") {
            item[columnOption.name] = pureValue;
          } else if (columnOption.type === "integer") {
            item[columnOption.name] = Number.parseInt(pureValue);
          } else if (columnOption.type === "float") {
            item[columnOption.name] = Number.parseFloat(pureValue);
          } else if (columnOption.type === "boolean") {
            if (Number(pureValue).toString() === "NaN") {
              const val = pureValue.toString().toLowerCase();
              if (val === "false") {
                item[columnOption.name] = false;
              } else if (val === "true") {
                item[columnOption.name] = true;
              } else {
                errLinesCount++;
              }
            } else {
              item[columnOption.name] = !!pureValue;
            }
          } else {
            item[columnOption.name] = null;
            errLinesCount++;
          }
        } catch {
          item[columnOption.name] = null;
          errLinesCount++;
        }
      });
      results.push(item);
    };

    lineReader.eachLine(
      path.resolve(__dirname, "../data/csv", fileName),
      {
        encoding: "utf-8",
      },
      function (line, last) {
        if (currentLine >= opts.beginRowIndex) {
          if (unhandledLines.length === 0) {
            unhandledLines.push(line);
            currentLine++;
          } else {
            if (/^(\d+|\d+\.\d+),/.test(line) === false) {
              unhandledLines.push(line);
            } else {
              handleItem(unhandledLines.join(""));
              unhandledLines.length = 0;
              unhandledLines.push(line);
              if (!last) {
                currentLine++;
              }
            }
            if (last) {
              currentLine++;
            }
          }
          if (last) {
            handleItem(unhandledLines.join(""));
            resolve({
              results,
              totalLines: currentLine - opts.beginRowIndex,
              errLines: errLinesCount,
            });
          }
        } else {
          currentLine++;
        }
      },
      function () {
        errLinesCount++;
      }
    );
  });
};
