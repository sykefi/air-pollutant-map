import { Gnfr, Pollutant } from "@/types";
import * as cache from "./cache";

const gsUri = process.env.VUE_APP_GEOSERVER_URI;
const gridDataTable = "p_gd_test";
const gridDataTotalsTable = "p_gd_totals";
const outputFormat = "&outputFormat=application/json";

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

const getCacheKey = (year: number, gnfr: Gnfr, pollutant: Pollutant) => {
  return `pollutant_map_grid_data_${year}_${gnfr}_${pollutant.dbCol}`;
};

export const fetchFeatures = async (year: number, gnfr: Gnfr, pollutant: Pollutant) => {
  const uri =
    gnfr === Gnfr.COMBINED
      ? getWfsTotalGridDataUri(year, pollutant)
      : getWfsGridDataUri(year, gnfr, pollutant);
  const cacheKey = getCacheKey(year, gnfr, pollutant);
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
