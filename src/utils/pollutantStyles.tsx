import { FeatureLike } from "ol/Feature";
import { Pollutant, PollutantLegend } from "../types";

const pollutantBreakPointValues: { [key: string]: number[] } = {}; // TODO this is deprecated -> remove?

const calculatedBreakPointValues: { [key: string]: number[] } = {};

const colorScale: string[] = [
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

const roundBreakPoint = (n: number) => {
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

const getBreakPoints = (pollutant: Pollutant): number[] | undefined => {
  let breakPoints: number[] | undefined = undefined;
  if (pollutant.dbCol in pollutantBreakPointValues) {
    breakPoints = pollutantBreakPointValues[pollutant.dbCol];
  } else if (pollutant.dbCol in calculatedBreakPointValues) {
    breakPoints = calculatedBreakPointValues[pollutant.dbCol];
  }
  return breakPoints ? [...breakPoints] : breakPoints;
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
    console.log(validSortedValues);
  }

  calculatedBreakPointValues[pollutant.dbCol] = calculateAdjustedBreakPoints(
    validSortedValues,
    classCount
  );
};

const getColorArray = (colorScale: string[], breakPoints: number[]): string[] => {
  // return default color scale if number of breakpoints (classes) and color match
  if (breakPoints.length === colorScale.length) {
    return colorScale;
  } else if (breakPoints.length < colorScale.length) {
    // else create subset of the color scale by the number of breakpoints (classes)
    const colors: string[] = [];
    for (let i = 1; i <= breakPoints.length; i++) {
      const relativeColorPosition =
        i === 1 ? 1 : Math.round((i / breakPoints.length) * colorScale.length);
      colors[i - 1] = colorScale[relativeColorPosition - 1];
    }
    return colors;
  } else {
    console.error("Could not get color array (got more breakpoints than colours)");
    return [];
  }
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
  // replace last breakpoint with given maxValue if it is higher
  const secondLastBreakPoint = breakPoints[breakPoints.length - 2];
  if (maxValue > secondLastBreakPoint) {
    breakPoints[breakPoints.length - 1] = maxValue;
  }
  // get color scale by number of breakpoints
  const colors = getColorArray(colorScale, breakPoints);
  return (feature: FeatureLike) =>
    getFeatureColor(breakPoints, colors, pollutant.dbCol, feature);
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
  const colors = getColorArray(colorScale, breakPoints);
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
      unit: pollutant.yksikko
    }
  );
};
