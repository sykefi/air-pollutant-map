import { FeatureLike } from "ol/Feature";
import { Pollutant, PollutantLegend } from "../types";

const pollutantBreakPointValues: { [key: string]: number[] } = {
  s16: [0.01, 0.03, 0.07, 5, 2576],
  s17: [0.01, 0.03, 0.07, 5, 2576]
};

const calculatedBreakPointValues: { [key: string]: number[] } = {};

const colors: string[] = ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"];

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

const getFeatureColor = (
  breakPoints: number[],
  pollutant: string,
  feature: FeatureLike
): string => {
  const value = feature.get(pollutant);
  if (!value) {
    return "grey"; // if value is null or undefined
  } else {
    for (let i = 0; i <= 4; i++) {
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

export const setPollutantBreakPoints = (pollutant: Pollutant, valueList: number[]): void => {
  const validSortedValues = valueList
    .filter((number) => number !== undefined && number !== null)
    .sort((a, b) => a - b);
  if (validSortedValues.length < 2000) {
    console.log(`Found only ${validSortedValues.length} valid values for pollutant`);
  }
  calculatedBreakPointValues[pollutant.dbCol] = calculateBreakPoints(validSortedValues, 5);
};

export const getColorFunction = (pollutant: Pollutant): Function | undefined => {
  const breakPoints = getBreakPoints(pollutant);
  if (!breakPoints) {
    console.log(
      "Failed to load style function for pollutant (no breakpoints found)",
      pollutant.dbCol,
      pollutant.parlocRyhmaSelite
    );
    return undefined;
  }
  return (feature: FeatureLike) => getFeatureColor(breakPoints, pollutant.dbCol, feature);
};

export const getPollutantLegendObject = (
  pollutant: Pollutant
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
      const prevBreakPoint = index > 0 ? breakPoints[index - 1] : 0;
      legend[index + 1] = { min: prevBreakPoint, max: breakPoint, color: colors[index] };
      return legend;
    },
    {
      classNames: [...Array(breakPoints.length).keys()].map((i) => i + 1),
      unit: pollutant.yksikko
    }
  );
};
