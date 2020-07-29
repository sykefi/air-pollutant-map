import { FeatureLike } from "ol/Feature";

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

export const getColorFunction = (pollutantIdentifier: string): Function | undefined => {
  // e.g. getColorFunction("s16")
  const breakPoints = pollutantBreakPointValues[pollutantIdentifier];
  if (!breakPoints) {
    console.log("could not find color breakpoints for pollutant", pollutantIdentifier);
    return undefined;
  }
  return (feature: FeatureLike) => getFeatureColor(breakPoints, pollutantIdentifier, feature);
};
