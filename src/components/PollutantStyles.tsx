import { FeatureLike } from "ol/Feature";

const pollutantBreakValues: { [key: string]: number[] } = {
  s16: [0.01, 0.03, 0.07, 5, 2576],
  s17: [0.01, 0.03, 0.07, 5, 2576]
};

const getFeatureColor = (
  breakPoints: number[],
  pollutant: string,
  feature: FeatureLike
) => {
  const value = feature.get(pollutant);
  if (value < breakPoints[0]) return "#fef0d9";
  if (value < breakPoints[1]) return "#fdcc8a";
  if (value < breakPoints[2]) return "#fc8d59";
  if (value < breakPoints[3]) return "#e34a33";
  if (value < breakPoints[4]) return "#b30000";
  return "grey";
};

export const getColorFunction = (pollutant: string): Function | undefined => {
  const breakPoints = pollutantBreakValues[pollutant];
  if (!breakPoints) {
    console.log("could not find color function for pollutant", pollutant);
    return undefined;
  }
  switch (pollutant) {
    case "s16":
      return (feature: FeatureLike) => getFeatureColor(breakPoints, pollutant, feature);
    default:
      undefined;
  }
};
