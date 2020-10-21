import * as cache from "./cache";

const gsUri = process.env.VUE_APP_GEOSERVER_URI;
const gridGeomTable = "p_grid_geom";
const outputFormat = "&outputFormat=application/json";

const getWfsGridUri = (): string => {
  return `${gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=paastotkartalla:${gridGeomTable}
    &propertyName=id,geom${outputFormat}`.replace(/ /g, "");
};

export const fetchGridFeatures = async () => {
  const cached = cache.getFromCache("grid_geom");
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(encodeURI(getWfsGridUri()));
    const fc = await response.json();
    cache.setToCache("grid_geom", fc);
    return fc;
  } catch (error) {
    console.error(error);
  }
};
