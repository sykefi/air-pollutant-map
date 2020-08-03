import { FeatureLike } from "ol/Feature";
import { Pollutant } from "../types";

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

export const getColorFunction = (
  pollutant: Pollutant,
  valueList: number[]
): Function | undefined => {
  // e.g. getColorFunction("s16")
  let breakPoints;
  if (pollutantBreakPointValues[pollutant.dbCol]) {
    breakPoints = pollutantBreakPointValues[pollutant.dbCol];
    console.log("Found previously defined breakpoints for", pollutant.dbCol);
  } else if (calculatedBreakPointValues[pollutant.dbCol]) {
    breakPoints = calculatedBreakPointValues[pollutant.dbCol];
    console.log("Found previously calculated breakpoints for", pollutant.dbCol);
  } else {
    console.log("Could not find breakpoints for pollutant, calculating new...");
    calculatedBreakPointValues[pollutant.dbCol] = calculateBreakPoints(valueList, 5);
    breakPoints = calculatedBreakPointValues[pollutant.dbCol];
  }
  return (feature: FeatureLike) => getFeatureColor(breakPoints, pollutant.dbCol, feature);
};

interface ValueRange {
  min: number;
  max: number;
  color: string;
}

export interface PollutantLegend {
  classNames: number[];
  [key: number]: ValueRange;
  unit: string;
}

export const getPollutantLegendObject = (
  pollutant: Pollutant
): PollutantLegend | undefined => {
  let breakPoints;
  if (pollutantBreakPointValues[pollutant.dbCol]) {
    breakPoints = pollutantBreakPointValues[pollutant.dbCol];
  } else if (calculatedBreakPointValues[pollutant.dbCol]) {
    breakPoints = calculatedBreakPointValues[pollutant.dbCol];
  } else {
    console.log("Failed to load legend for pollutant", pollutant.parlocRyhmaSelite);
    return undefined;
  }
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
