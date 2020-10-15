import { FeatureLike } from "ol/Feature";
import { Pollutant, PollutantLegend, MapDataType } from "../types";

const breakPointCache: Map<string, number[]> = new Map();

const colorScale: string[] = [
  "#edf8fb",
  "#bfd3e6",
  "#9ebcda",
  "#8c96c6",
  "#8c6bb1",
  "#88419d",
  "#6e016b"
];

const getStyleId = (dataType: MapDataType, valuePropName: string) => dataType + valuePropName;

const getStandardDeviation = (array: number[], mean: number, n: number): number => {
  return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
};

const roundBreakPoint = (n: number): number => {
  // round breakpoint values to at least two significant figures
  for (let i = 1; i < Math.pow(10, 10); i = i * 10) {
    const divider = 10 / i;
    if (n > divider) {
      return Math.round(n * i) / i;
    }
  }
  return n;
};

const calculateAdjustedBreakPoints = (valueList: number[], classCount: number): number[] => {
  const n = valueList.length;
  const mean = valueList.reduce((a, b) => a + b) / n;
  const std = getStandardDeviation(valueList, mean, n);
  const zList = valueList.map((value) => (value - mean) / std);

  // calculate 0-2 adjusted breakpoints for classifying outliers, detect outliers by z-scores (1 & 3)
  let firstOutlierBpIndex = valueList[n - 1];
  const outlierBreakPoints: number[] = [];
  if (valueList.length > 30) {
    for (let i = 0; i < n; i++) {
      if (zList[i] > 1) {
        if (outlierBreakPoints.length === 0) {
          firstOutlierBpIndex = i - 1;
          outlierBreakPoints.push(roundBreakPoint(valueList[i]));
        }
        if (zList[i] > 3) {
          outlierBreakPoints.push(roundBreakPoint(valueList[i]));
          break;
        }
      }
    }
  }

  // calculate normal breakpoints that will be set before the outlier-breakpoints
  const normalClassCount = classCount - outlierBreakPoints.length;
  const normalClassSize = Math.round(firstOutlierBpIndex / normalClassCount);
  const breakPoints: number[] = [];
  for (let i = 0; i < normalClassCount - 1; i++) {
    const bp = valueList[normalClassSize + normalClassSize * i];
    breakPoints[i] = roundBreakPoint(bp);
  }

  // combine final breakpoints from normal breakpoints, outlier-adjusted breakpoints and highest value
  const combinedBreakPoints = breakPoints.concat(outlierBreakPoints, [valueList[n - 1]]);
  // filter out duplicate breakpoints
  return combinedBreakPoints.filter((value, index, self) => self.indexOf(value) === index);
};

export const getBreakPoints = (
  dataType: MapDataType,
  valuePropName: string
): number[] | undefined => {
  const styleId = getStyleId(dataType, valuePropName);
  if (breakPointCache.has(styleId)) {
    return [...breakPointCache.get(styleId)!];
  }
  return undefined;
};

export const hasBreakPoints = (dataType: MapDataType, valuePropName: string): boolean => {
  return breakPointCache.has(getStyleId(dataType, valuePropName));
};

export const getPollutantBreakPoints = (
  dataType: MapDataType,
  valuePropName: string,
  valueList: number[],
  classCount: number
): number[] => {
  const validSortedValues = valueList
    .filter((number) => number !== undefined && number !== null)
    .sort((a, b) => a - b);
  if (dataType === MapDataType.GRID && validSortedValues.length < 2000) {
    console.log(`Found only ${validSortedValues.length} valid values for pollutant`);
    console.log(validSortedValues);
  }

  const breakPoints = calculateAdjustedBreakPoints(validSortedValues, classCount);
  breakPointCache.set(getStyleId(dataType, valuePropName), breakPoints);
  return breakPoints;
};

const getFeatureColor = (
  breakPoints: number[],
  colors: string[],
  pollutant: string,
  feature: FeatureLike
): string => {
  const value = feature.get(pollutant);
  if (!value) {
    return "transparent"; // if value is null or undefined
  } else {
    for (let i = 0; i < breakPoints.length; i++) {
      if (value < breakPoints[i]) {
        return colors[i];
      }
    }
    console.error("Feature value is outside breakpoint ranges");
    return "gray"; // if value is outside breakpoint ranges
  }
};

export const getColorFunction = (
  valuePropName: string,
  breakPoints: number[],
  maxValue: number
): Function | undefined => {
  // replace last breakpoint with given maxValue if it is higher
  const secondLastBreakPoint = breakPoints[breakPoints.length - 2];
  if (maxValue > secondLastBreakPoint) {
    breakPoints[breakPoints.length - 1] = maxValue;
  }
  // get color scale by number of breakpoints
  const colors = colorScale.slice(0, breakPoints.length);
  return (feature: FeatureLike) =>
    getFeatureColor(breakPoints, colors, valuePropName, feature);
};

export const getPollutantLegend = (
  pollutant: Pollutant,
  breakPoints: number[],
  maxValue: number
): PollutantLegend | undefined => {
  const colors = colorScale.slice(0, breakPoints.length);
  // replace last breakpoint with given maxValue if it is higher
  const secondLastBreakPoint = breakPoints[breakPoints.length - 2];
  if (maxValue > secondLastBreakPoint) {
    breakPoints[breakPoints.length - 1] = maxValue;
  } else {
    // no values belong to the last class -> remove it from legend
    breakPoints.splice(-1, 1);
  }
  // create and return legend object
  return breakPoints.reduce(
    (legend, breakPoint, index) => {
      // set 0 as the min value of the first range
      const min = index > 0 ? breakPoints[index - 1] : 0;
      // set given max value as the max value of the last range
      const max = breakPoint;
      legend[index + 1] = { min, max, color: colors[index] };
      return legend;
    },
    {
      classNames: [...Array(breakPoints.length).keys()].map((i) => i + 1),
      unit: pollutant.unit
    }
  );
};
