import { FeatureLike } from "ol/Feature";
import { Pollutant, PollutantLegend } from "../types";

const pollutantBreakPointValues: { [key: string]: number[] } = {};

const calculatedBreakPointValues: { [key: string]: number[] } = {};

const colors: string[] = [
  "#1a9850",
  "#91cf60",
  "#d9ef8b",
  "#ffffbf",
  "#fee08b",
  "#fc8d59",
  "#d73027"
];

const getStandardDeviation = (array: number[], mean: number, n: number) => {
  return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
};

const calculateBreakPoints = (valueList: number[], classCount: number): number[] => {
  const classSize = Math.round(valueList.length / classCount);
  const breakPoints: number[] = [];
  for (let i = 0; i < classCount; i++) {
    const bp =
      i !== classCount - 1
        ? valueList[classSize + classSize * i]
        : valueList[valueList.length - 1] + 1;
    breakPoints.push(bp > 10 ? Math.round(bp) : bp);
  }
  console.log("Calculated breakPoints:", breakPoints);
  return breakPoints;
};

const calculateAdjustedBreakPoints = (valueList: number[], classCount: number): number[] => {
  const n = valueList.length;
  const mean = valueList.reduce((a, b) => a + b) / n;
  const std = getStandardDeviation(valueList, mean, n);
  const zList = valueList.map((value) => (value - mean) / std);

  console.log("mean", mean);
  console.log("std", std);
  console.log("valueList", valueList);
  console.log("zList", zList);

  let normalValueCount = valueList[n - 1];
  const outlierBreakPoints: number[] = [];
  for (let i = 0; i < n; i++) {
    if (zList[i] > 0.5) {
      if (outlierBreakPoints.length === 0) {
        normalValueCount = i - 1;
        outlierBreakPoints.push(valueList[i]);
      }
      if (zList[i] > 5) {
        outlierBreakPoints.push(valueList[i]);
        break;
      }
    }
  }
  const remainingClassCount = classCount - outlierBreakPoints.length;
  const classSize = Math.round(normalValueCount / remainingClassCount);

  const breakPoints: number[] = [];
  for (let i = 0; i < remainingClassCount - 1; i++) {
    const bp = valueList[classSize + classSize * i];
    breakPoints[i] = bp > 10 ? Math.round(bp) : bp;
  }

  const combinedBreakPoints = breakPoints.concat(outlierBreakPoints, [valueList[n - 1]]);
  console.log("breakPoints", breakPoints);
  console.log("outlierBreakPoints", outlierBreakPoints);
  console.log("combinedBreakPoints", combinedBreakPoints);

  return combinedBreakPoints;
};

const getFeatureColor = (
  breakPoints: number[],
  pollutant: string,
  feature: FeatureLike
): string => {
  const value = feature.get(pollutant);
  if (!value) {
    return "grey"; // if value is null or undefined
  } else {
    for (let i = 0; i < breakPoints.length; i++) {
      if (value < breakPoints[i]) {
        return colors[i];
      }
    }
    return "gray"; // if value is outside breakpoint ranges
  }
};

const getBreakPoints = (pollutant: Pollutant): number[] | undefined => {
  if (pollutant.dbCol in pollutantBreakPointValues) {
    return pollutantBreakPointValues[pollutant.dbCol];
  } else if (pollutant.dbCol in calculatedBreakPointValues) {
    return calculatedBreakPointValues[pollutant.dbCol];
  } else {
    return undefined;
  }
};

export const hasBreakPoints = (pollutant: Pollutant): boolean => {
  return (
    pollutant.dbCol in pollutantBreakPointValues ||
    pollutant.dbCol in calculatedBreakPointValues
  );
};

export const setPollutantBreakPoints = (
  pollutant: Pollutant,
  valueList: number[],
  classCount: number
): void => {
  const validSortedValues = valueList
    .filter((number) => number !== undefined && number !== null)
    .sort((a, b) => a - b);
  if (validSortedValues.length < 2000) {
    console.log(`Found only ${validSortedValues.length} valid values for pollutant`);
  }

  calculatedBreakPointValues[pollutant.dbCol] = calculateAdjustedBreakPoints(
    validSortedValues,
    classCount
  );

  // calculatedBreakPointValues[pollutant.dbCol] = calculateBreakPoints(
  //   validSortedValues,
  //   classCount
  // );
};

export const getColorFunction = (
  pollutant: Pollutant,
  maxValue: number
): Function | undefined => {
  const breakPoints = getBreakPoints(pollutant);
  if (!breakPoints) {
    console.log(
      "Failed to load style function for pollutant (no breakpoints found)",
      pollutant.dbCol,
      pollutant.parlocRyhmaSelite
    );
    return undefined;
  }
  // replace last breakpoint with given maxValue
  breakPoints[breakPoints.length - 1] = maxValue;
  return (feature: FeatureLike) => getFeatureColor(breakPoints, pollutant.dbCol, feature);
};

export const getPollutantLegendObject = (
  pollutant: Pollutant,
  maxValue: number
): PollutantLegend | undefined => {
  const breakPoints = getBreakPoints(pollutant);
  if (!breakPoints) {
    console.log(
      "Failed to load legend for pollutant (no breakpoints found)",
      pollutant.dbCol,
      pollutant.parlocRyhmaSelite
    );
    return undefined;
  }
  // create and return legend object
  return breakPoints.reduce(
    (legend, breakPoint, index) => {
      // set 0 as the min value of the first range
      const min = index > 0 ? breakPoints[index - 1] : 0;
      // set given max value as the max value of the last range
      const max = index < breakPoints.length - 1 ? breakPoint : maxValue;
      legend[index + 1] = { min, max, color: colors[index] };
      return legend;
    },
    {
      classNames: [...Array(breakPoints.length).keys()].map((i) => i + 1),
      unit: pollutant.yksikko
    }
  );
};
