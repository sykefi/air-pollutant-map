import { FeatureLike } from "ol/Feature";
import { Pollutant } from "./../types";

const pollutantBreakPointValues: { [key: string]: number[] } = {
  s16: [0.01, 0.03, 0.07, 5, 2576],
  s17: [0.01, 0.03, 0.07, 5, 2576]
};

const colors: string[] = ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"];

const getFeatureColor = (
  breakPoints: number[],
  pollutant: string,
  feature: FeatureLike
): string => {
  const value = feature.get(pollutant);
  for (let i = 0; i <= 4; i++) {
    if (value < breakPoints[i]) {
      return colors[i];
    }
  }
  return "grey"; //return default color "grey" if value is outside the breakpoint ranges
};

export const getColorFunction = (pollutant: Pollutant): Function | undefined => {
  // e.g. getColorFunction("s16")
  const breakPoints = pollutantBreakPointValues[pollutant.dbCol];
  if (!breakPoints) {
    console.log(
      "Could not find style function for pollutant",
      pollutant.parlocRyhmaSelite,
      pollutant.dbCol
    );
    return undefined;
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
  const breakPoints = pollutantBreakPointValues[pollutant.dbCol];
  if (!breakPoints) {
    console.log("Failed to load legend for pollutant", pollutant.parlocRyhmaSelite);
    return undefined;
  }
  const pollutantLegend: PollutantLegend = breakPoints.reduce(
    (legend, breakPoint, index) => {
      const prevBreakPoint = index > 0 ? breakPoints[index - 1] : 0;
      legend[index + 1] = { min: prevBreakPoint, max: breakPoint, color: colors[index] };
      return legend;
    },
    {
      classNames: [...Array(breakPoints.length).keys()].map((name) => name + 1),
      unit: pollutant.yksikko
    }
  );
  return pollutantLegend;
};
