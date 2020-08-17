import { Gnfr, Pollutant, DbGnfr } from "@/types";
import * as cache from "./cache";

const gsUri = process.env.VUE_APP_GEOSERVER_URI;
const gridDataTable = "p_gd_test";
const gridDataTotalsTable = "p_gd_totals";
const muniDataTable = "p_muni_data";
const gnfrMetaTable = "p_gnfr_meta";
const outputFormat = "&outputFormat=application/json";
const m2tokm2 = 1e-6;

const getWfsGridDataUri = (year: number, gnfrKey: string, pollutant: Pollutant): string => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${gridDataTable}&propertyName=geom,${pollutant.dbCol}
    ${outputFormat}&viewparams=year:${year};class:${gnfrKey}`.replace(/ /g, "");
};

const getWfsTotalGridDataUri = (year: number, pollutant: Pollutant) => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${gridDataTotalsTable}&propertyName=geom,${pollutant.dbCol}
    ${outputFormat}&viewparams=year:${year}`.replace(/ /g, "");
};

const getGridDataCacheKey = (year: number, gnfrKey: string, pollutant: Pollutant) => {
  return `pollutant_map_grid_data_${year}_${gnfrKey}_${pollutant.dbCol}`;
};

export const fetchFeatures = async (year: number, gnfrKey: string, pollutant: Pollutant) => {
  const uri =
    gnfrKey === "COMBINED"
      ? getWfsTotalGridDataUri(year, pollutant)
      : getWfsGridDataUri(year, gnfrKey, pollutant);
  const cacheKey = getGridDataCacheKey(year, gnfrKey, pollutant);
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

const getGnfrObject = (props: DbGnfr): Gnfr => {
  const name = { fi: props.nimi, sv: props.namn, en: props.name };
  return { db_key: props.db_key, name, use_dev: props.use_dev, use_prod: props.use_prod };
};

export const fetchGnfrMeta = async (): Promise<Gnfr[]> => {
  const uri = `${gsUri}ows?service=WFS&version=1.0.0&request=GetFeature
  &typeName=paastotkartalla:${gnfrMetaTable}&outputFormat=application/json`.replace(/ /g, "");
  const response = await fetch(encodeURI(uri));
  const fc = await response.json();
  return fc.features.map((feat) => getGnfrObject(feat.properties));
};
