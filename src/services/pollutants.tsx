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

const getWfsGridDataUri = (year: number, gnfrId: string, pollutant: Pollutant): string => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${gridDataGnfrTable}&propertyName=geom,${pollutant.id}
    ${outputFormat}&viewparams=year:${year};gnfr:${gnfrId}`.replace(/ /g, "");
};

const getWfsTotalGridDataUri = (year: number, pollutant: Pollutant): string => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${gridDataTotalsTable}&propertyName=geom,${pollutant.id}
    ${outputFormat}&viewparams=year:${year}`.replace(/ /g, "");
};

const getGridDataCacheKey = (year: number, gnfrId: string, pollutant: Pollutant): string => {
  return `pollutant_map_grid_data_${year}_${gnfrId}_${pollutant.id}`;
};

export const fetchGridFeatures = async (
  year: number,
  gnfrId: string,
  pollutant: Pollutant
): Promise<GridFeatureCollection | undefined> => {
  const uri =
    gnfrId === "COMBINED"
      ? getWfsTotalGridDataUri(year, pollutant)
      : getWfsGridDataUri(year, gnfrId, pollutant);
  const cacheKey = getGridDataCacheKey(year, gnfrId, pollutant);
  const cached = cache.getFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(encodeURI(uri));
    const fc = await response.json();
    cache.setToCache(cacheKey, fc);
    return fc;
  } catch (error) {
    console.error(error);
  }
};

const getMuniDataCacheKey = (year: number, gnfrId: string, pollutant: Pollutant): string => {
  return `pollutant_map_muni_data_${year}_${gnfrId}_${pollutant.id}`;
};

const getWfsMuniDataGnfrUri = (year: number, gnfrId: string, pollutant: Pollutant): string => {
  return `${gsUri}ows?service=WFS&version=1.0.0
  &request=GetFeature&typeName=paastotkartalla:${muniDataGnfrTable}&propertyName=geom,nimi,namn,area,${pollutant.id}
  ${outputFormat}&viewparams=year:${year};gnfr:${gnfrId}`.replace(/ /g, "");
};

const getWfsMuniDataTotalsUri = (year: number, pollutant: Pollutant): string => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${muniDataTotalsTable}&propertyName=geom,nimi,namn,area,${pollutant.id}
    ${outputFormat}&viewparams=year:${year}`.replace(/ /g, "");
};

export const fetchMuniFeatures = async (
  year: number,
  gnfrId: string,
  pollutant: Pollutant
): Promise<MuniFeatureCollection | undefined> => {
  const uri =
    gnfrId === "COMBINED"
      ? getWfsMuniDataTotalsUri(year, pollutant)
      : getWfsMuniDataGnfrUri(year, gnfrId, pollutant);
  const cacheKey = getMuniDataCacheKey(year, gnfrId, pollutant);
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
      const props = { id: feat.properties.id, name, area: feat.properties.area };
      props[pollutant.id] = feat.properties[pollutant.id];
      props[pollutant.id + "-density"] =
        feat.properties[pollutant.id] / (feat.properties.area * m2tokm2);
      const feature = { geometry: feat.geometry, type: feat.type, properties: props };
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

const calculateTotalPollution = (fc: MuniFeatureCollection, pollutant: Pollutant): number => {
  return fc.features
    .map((feat) => feat.properties)
    .reduce((sum: number, props: PollutantValues) => {
      return props[pollutant.id] ? sum + props[pollutant.id] : sum;
    }, 0);
};

const getTotalPollution = async (
  year: number,
  gnfrId: string,
  pollutant: Pollutant
): Promise<number | undefined> => {
  const totalPollutionId = `${year}_${gnfrId}_${pollutant.id}_total`;

  if (cache.hasKey(totalPollutionId)) {
    return cache.getFromCache(totalPollutionId);
  }
  const fc = await fetchMuniFeatures(year, gnfrId, pollutant);
  if (fc) {
    const totalPollution = calculateTotalPollution(fc, pollutant);
    cache.setToCache(totalPollutionId, totalPollution);
    return totalPollution;
  }
};

export const getTotalPollutionStats = async (
  year: number,
  gnfrId: string,
  pollutant: Pollutant
): Promise<TotalPollutionStats | undefined> => {
  const gnfrPollution = await getTotalPollution(year, gnfrId, pollutant);
  const totalPollution = await getTotalPollution(year, "COMBINED", pollutant);
  if (gnfrPollution && totalPollution) {
    return { gnfrId, gnfrPollution, totalPollution, unit: pollutant.unit };
  }
  return undefined;
};
