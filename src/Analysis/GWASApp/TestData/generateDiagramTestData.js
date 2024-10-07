export const generateHistogramTestData = () => {
  const minNumberOfBars = 5;
  const maxNumberOfBars = 15;
  const minPersonCount = 100;
  const maxPersonCount = 2000;
  const binSizeOffSet = 10;
  const numberOfBars = Math.floor(Math.random() * maxNumberOfBars) + minNumberOfBars;
  // Create an array of numberOfBars objects
  const objectsArray = Array.from({ length: numberOfBars }, (v, i) => {
    const start = i * binSizeOffSet;
    return {
      start,
      end: start + binSizeOffSet,
      personCount:
        Math.floor(Math.random() * (maxPersonCount - minPersonCount))
        + minPersonCount,
    };
  });
  return objectsArray;
};

export const generateEulerTestData = () => ({
  cohort_overlap: {
    case_control_overlap: Math.floor(Math.random() * 50),
  },
});
