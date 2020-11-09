import {
  Pollutant,
  MuniFeatureCollection,
  WfsMuniFeatureCollection,
  MuniFeature,
  GridFeatureCollection,
  NodeEnv,
  PollutantValues,
  TotalPollutionStats
} from "@/types";
import * as cache from "./cache";
import { m2tokm2 } from "./../constants";

const gsUri = process.env.VUE_APP_GEOSERVER_URI;

const gridDataGnfrTable =
  process.env.NODE_ENV === NodeEnv.PRODUCTION
    ? "p_grid_data_gnfr_prod"
    : "p_grid_data_gnfr_dev";

const muniDataGnfrTable =
  process.env.NODE_ENV === NodeEnv.PRODUCTION
    ? "p_muni_data_gnfr_prod"
    : "p_muni_data_gnfr_dev";

const gridDataTotalsTable = "p_grid_data_totals";
const muniDataTotalsTable = "p_muni_data_totals";
const outputFormat = "&outputFormat=application/json";

const getWfsGridDataUri = (year: number, gnfrId: string, pollutantId: string): string => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${gridDataGnfrTable}&propertyName=grid_id,${pollutantId}
    ${outputFormat}&viewparams=year:${year};gnfr:${gnfrId}`.replace(/ /g, "");
};

const getWfsTotalGridDataUri = (year: number, pollutantId: string): string => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${gridDataTotalsTable}&propertyName=grid_id,${pollutantId}
    ${outputFormat}&viewparams=year:${year}`.replace(/ /g, "");
};

const getGridDataCacheKey = (
  year: number,
  gnfrId: string,
  pollutantId: string,
  unitCoefficient: number
): string => {
  return `pollutant_map_grid_data_${year}_${gnfrId}_${pollutantId}_${unitCoefficient}`;
};

export const fetchGridData = async (
  year: number,
  gnfrId: string,
  pollutantId: string,
  unitCoefficient = 1
): Promise<Map<number, number> | undefined> => {
  const uri =
    gnfrId === "COMBINED"
      ? getWfsTotalGridDataUri(year, pollutantId)
      : getWfsGridDataUri(year, gnfrId, pollutantId);

  const cacheKey = getGridDataCacheKey(year, gnfrId, pollutantId, unitCoefficient);
  const cached = cache.getFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  const pollutionMap: Map<number, number> = new Map();
  try {
    const response = await fetch(encodeURI(uri));
    const fc = (await response.json()) as GridFeatureCollection;
    fc.features
      .map((feat) => feat.properties)
      .forEach((props) => {
        const pollution = props[pollutantId] * unitCoefficient;
        pollutionMap.set(props.grid_id, pollution);
      });
    cache.setToCache(cacheKey, pollutionMap);
    return pollutionMap;
  } catch (error) {
    console.error(error);
  }
};

const getMuniDataCacheKey = (
  year: number,
  gnfrId: string,
  pollutantId: string,
  unitCoefficient: number
): string => {
  return `pollutant_map_muni_data_${year}_${gnfrId}_${pollutantId}_${unitCoefficient}`;
};

const getWfsMuniDataGnfrUri = (year: number, gnfrId: string, pollutantId: string): string => {
  return `${gsUri}ows?service=WFS&version=1.0.0
  &request=GetFeature&typeName=paastotkartalla:${muniDataGnfrTable}&propertyName=geom,nimi,namn,area,${pollutantId}
  ${outputFormat}&viewparams=year:${year};gnfr:${gnfrId}`.replace(/ /g, "");
};

const getWfsMuniDataTotalsUri = (year: number, pollutantId: string): string => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${muniDataTotalsTable}&propertyName=geom,nimi,namn,area,${pollutantId}
    ${outputFormat}&viewparams=year:${year}`.replace(/ /g, "");
};

export const fetchMuniFeatures = async (
  year: number,
  gnfrId: string,
  pollutantId: string,
  unitCoefficient = 1
): Promise<MuniFeatureCollection | undefined> => {
  const uri =
    gnfrId === "COMBINED"
      ? getWfsMuniDataTotalsUri(year, pollutantId)
      : getWfsMuniDataGnfrUri(year, gnfrId, pollutantId);
  const cacheKey = getMuniDataCacheKey(year, gnfrId, pollutantId, unitCoefficient);
  const cached = cache.getFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(encodeURI(uri));
    const rawFc = (await response.json()) as WfsMuniFeatureCollection;
    // calculate pollutant densities to feature properties
    const features: MuniFeature[] = rawFc.features.map((feat) => {
      const name = {
        fi: feat.properties.nimi,
        sv: feat.properties.namn,
        en: feat.properties.nimi
      };
      const properties = { id: feat.properties.id, name, area: feat.properties.area };
      const pollution = feat.properties[pollutantId] * unitCoefficient;
      properties[pollutantId] = pollution;
      properties[pollutantId + "-density"] = pollution / (feat.properties.area * m2tokm2);
      const feature = { geometry: feat.geometry, type: feat.type, properties };
      return feature;
    });
    const fc = {
      type: "FeatureCollection",
      features: features
    } as MuniFeatureCollection;
    cache.setToCache(cacheKey, fc);
    return fc;
  } catch (error) {
    console.error(error);
  }
};

const calculateTotalPollution = (fc: MuniFeatureCollection, pollutantId: string): number => {
  return fc.features
    .map((feat) => feat.properties)
    .reduce((sum: number, props: PollutantValues) => {
      return props[pollutantId] ? sum + props[pollutantId] : sum;
    }, 0);
};

const getTotalPollution = async (
  year: number,
  gnfrId: string,
  pollutantId: string
): Promise<number | undefined> => {
  const totalPollutionId = `${year}_${gnfrId}_${pollutantId}_total`;

  if (cache.hasKey(totalPollutionId)) {
    return cache.getFromCache(totalPollutionId);
  }
  const fc = await fetchMuniFeatures(year, gnfrId, pollutantId);
  if (fc) {
    const totalPollution = calculateTotalPollution(fc, pollutantId);
    cache.setToCache(totalPollutionId, totalPollution);
    return totalPollution;
  }
};

export const getTotalPollutionStats = async (
  year: number,
  gnfrId: string,
  pollutant: Pollutant
): Promise<TotalPollutionStats | undefined> => {
  const gnfrPollution = await getTotalPollution(year, gnfrId, pollutant.id);
  const totalPollution = await getTotalPollution(year, "COMBINED", pollutant.id);
  if ((gnfrPollution || gnfrPollution === 0) && totalPollution) {
    return { gnfrId, gnfrPollution, totalPollution, unit: pollutant.unit };
  }
  return undefined;
};
