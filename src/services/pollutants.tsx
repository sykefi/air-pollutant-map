import { Gnfr, Pollutant, DbGnfr, DbPollutant } from "@/types";
import * as cache from "./cache";
import { m2tokm2 } from "./../constants";

const gsUri = process.env.VUE_APP_GEOSERVER_URI;
const gridDataGnfrTable = "p_grid_data_gnfr";
const gridDataTotalsTable = "p_grid_data_totals";
const muniDataGnfrTable = "p_muni_data_gnfr";
const muniDataTotalsTable = "p_muni_data_totals";
const gnfrMetaTable = "p_gnfr_meta";
const pollutantMetaTable = "p_pollutant_meta";
const outputFormat = "&outputFormat=application/json";

const getWfsGridDataUri = (year: number, gnfrId: string, pollutant: Pollutant): string => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${gridDataGnfrTable}&propertyName=geom,${pollutant.id}
    ${outputFormat}&viewparams=year:${year};gnfr:${gnfrId}`.replace(/ /g, "");
};

const getWfsTotalGridDataUri = (year: number, pollutant: Pollutant) => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${gridDataTotalsTable}&propertyName=geom,${pollutant.id}
    ${outputFormat}&viewparams=year:${year}`.replace(/ /g, "");
};

const getGridDataCacheKey = (year: number, gnfrId: string, pollutant: Pollutant) => {
  return `pollutant_map_grid_data_${year}_${gnfrId}_${pollutant.id}`;
};

export const fetchGridFeatures = async (
  year: number,
  gnfrId: string,
  pollutant: Pollutant
) => {
  const uri =
    gnfrId === "COMBINED"
      ? getWfsTotalGridDataUri(year, pollutant)
      : getWfsGridDataUri(year, gnfrId, pollutant);
  const cacheKey = getGridDataCacheKey(year, gnfrId, pollutant);
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

const getMuniDataCacheKey = (year: number, gnfrId: string, pollutant: Pollutant) => {
  return `pollutant_map_muni_data_${year}_${gnfrId}_${pollutant.id}`;
};

const getWfsMuniDataGnfrUri = (year: number, gnfrId: string, pollutant: Pollutant) => {
  return `${gsUri}ows?service=WFS&version=1.0.0
  &request=GetFeature&typeName=paastotkartalla:${muniDataGnfrTable}&propertyName=geom,nimi,namn,area,${pollutant.id}
  ${outputFormat}&viewparams=year:${year};gnfr:${gnfrId}`.replace(/ /g, "");
};

const getWfsMuniDataTotalsUri = (year: number, pollutant: Pollutant) => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${muniDataTotalsTable}&propertyName=geom,nimi,namn,area,${pollutant.id}
    ${outputFormat}&viewparams=year:${year}`.replace(/ /g, "");
};

export const fetchMuniFeatures = async (
  year: number,
  gnfrId: string,
  pollutant: Pollutant
) => {
  const uri =
    gnfrId === "COMBINED"
      ? getWfsMuniDataTotalsUri(year, pollutant)
      : getWfsMuniDataGnfrUri(year, gnfrId, pollutant);
  const cacheKey = getMuniDataCacheKey(year, gnfrId, pollutant);
  const cached = cache.getFromCache(cacheKey);
  if (cached) {
    console.log("Fetched muni data from cache");
    return cached;
  }
  const response = await fetch(encodeURI(uri));
  const fc = await response.json();
  // calculate pollutant densities to feature properties
  fc.features.forEach((feat) => {
    feat.properties[pollutant.id + "-density"] =
      feat.properties[pollutant.id] / (feat.properties.area * m2tokm2);
  });
  cache.setToCache(cacheKey, fc);
  console.log("Fetched muni data from WFS");
  return fc;
};

const getGnfrObject = (props: DbGnfr): Gnfr => {
  const name = { fi: props.nimi, sv: props.namn, en: props.name };
  return { id: props.id, name, useDev: props.use_dev, useProd: props.use_prod };
};

export const fetchGnfrMeta = async (): Promise<Gnfr[]> => {
  const uri = `${gsUri}ows?service=WFS&version=1.0.0&request=GetFeature
  &typeName=paastotkartalla:${gnfrMetaTable}&outputFormat=application/json`.replace(/ /g, "");
  const response = await fetch(encodeURI(uri));
  const fc = await response.json();
  return fc.features.map((feat) => getGnfrObject(feat.properties));
};

const getPollutantObject = (props: DbPollutant): Pollutant => {
  return {
    id: props.id,
    parlocGroupId: props.parloc_ryhma_tunnus,
    parlocGroupName: props.parloc_ryhma_nimi,
    name: { fi: props.nimi, sv: props.namn, en: props.name },
    threshold: props.raja_arvo,
    unit: props.yksikko,
    repUnit: props.rap_yksikko,
    group: props.ryhma,
    useDev: props.use_dev,
    useProd: props.use_prod
  };
};

export const fetchPollutantMeta = async (): Promise<Pollutant[]> => {
  const uri = `${gsUri}ows?service=WFS&version=1.0.0&request=GetFeature
  &typeName=paastotkartalla:${pollutantMetaTable}
  &outputFormat=application/json`.replace(/ /g, "");
  const response = await fetch(encodeURI(uri));
  const fc = await response.json();
  return fc.features.map((feat) => getPollutantObject(feat.properties));
};
