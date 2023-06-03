const ProgressBar = require("@jyeontu/progress-bar");

const progressBarConfig = {
  duration: 100,
  current: 0,
  block: "█",
  showNumber: true,
  color: "blue",
  tip: {},
};

function* createProgressBar(lang, stepFilePath, color = "blue") {
  const progressBarSteps = require(stepFilePath);
  const availableLanguages = Object.keys(progressBarSteps);
  if (availableLanguages.findIndex((item) => item === lang) === -1) {
    throw new Error("[ERROR]: 无法创建终端进度实例，语言无效");
  }
  const totalStep = progressBarSteps[lang].length;
  const stepLength = Math.floor(100 / totalStep);
  const tips = {};
  for (
    let current = stepLength, index = 0;
    current <= totalStep * stepLength;
    current += stepLength, index += 1
  ) {
    if (current === totalStep * stepLength) {
      tips[100] = progressBarSteps[lang][index];
    } else {
      tips[current] = progressBarSteps[lang][index];
    }
  }
  progressBarConfig.tip = tips;
  progressBarConfig.color = color;
  const progressBar = new ProgressBar(progressBarConfig);
  for (let currentStep = 1; currentStep <= totalStep; currentStep += 1) {
    if (currentStep === totalStep) {
      progressBar.run(100);
    } else {
      progressBar.run(currentStep * stepLength);
    }
    yield {
      currentStep,
      percent: currentStep * stepLength,
    };
  }
  return;
}

module.exports = {
  createProgressBar,
};
