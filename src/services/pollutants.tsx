import { Gnfr, Pollutant } from "@/types";
import * as cache from "./cache";

const gsUri = process.env.VUE_APP_GEOSERVER_URI;
const gridDataTable = "p_gd_test";
const gridDataTotalsTable = "p_gd_totals";
const muniDataTable = "p_muni_data";
const outputFormat = "&outputFormat=application/json";
const m2tokm2 = 1e-6;

const getWfsGridDataUri = (year: number, gnfr: Gnfr, pollutant: Pollutant): string => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${gridDataTable}&propertyName=geom,${pollutant.dbCol}
    ${outputFormat}&viewparams=year:${year};class:${gnfr}`.replace(/ /g, "");
};

const getWfsTotalGridDataUri = (year: number, pollutant: Pollutant) => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${gridDataTotalsTable}&propertyName=geom,${pollutant.dbCol}
    ${outputFormat}&viewparams=year:${year}`.replace(/ /g, "");
};

const getGridDataCacheKey = (year: number, gnfr: Gnfr, pollutant: Pollutant) => {
  return `pollutant_map_grid_data_${year}_${gnfr}_${pollutant.dbCol}`;
};

export const fetchFeatures = async (year: number, gnfr: Gnfr, pollutant: Pollutant) => {
  const uri =
    gnfr === Gnfr.COMBINED
      ? getWfsTotalGridDataUri(year, pollutant)
      : getWfsGridDataUri(year, gnfr, pollutant);
  const cacheKey = getGridDataCacheKey(year, gnfr, pollutant);
  const cached = cache.getFromCache(cacheKey);
  if (cached) {
    console.log("Fetched grid data from cache");
    return cached;
  }
  const response = await fetch(encodeURI(uri));
  const fc = await response.json();
  cache.setToCache(cacheKey, fc);
  console.log("Fetched grid data from WFS");
  return fc;
};

const getMuniDataCacheKey = (year: number, pollutant: Pollutant) => {
  return `pollutant_map_muni_data_${year}_${pollutant.dbCol}`;
};

const getWfsMuniDataUri = (year: number, pollutant: Pollutant) => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${muniDataTable}&propertyName=geom,nimi,area,${pollutant.dbCol}
    ${outputFormat}&viewparams=year:${year}`.replace(/ /g, "");
};

export const fetchMuniFeatures = async (year: number, pollutant: Pollutant) => {
  const uri = getWfsMuniDataUri(year, pollutant);
  const cacheKey = getMuniDataCacheKey(year, pollutant);
  const cached = cache.getFromCache(cacheKey);
  if (cached) {
    console.log("Fetched grid data from cache");
    return cached;
  }
  const response = await fetch(encodeURI(uri));
  const fc = await response.json();
  // calculate pollutant densities to feature properties
  fc.features.forEach((feat) => {
    feat.properties[pollutant.dbCol + "-density"] =
      feat.properties[pollutant.dbCol] / (feat.properties.area * m2tokm2);
  });
  cache.setToCache(cacheKey, fc);
  console.log("Fetched muni data from WFS");
  return fc;
};
