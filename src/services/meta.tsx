import {
  DbGnfr,
  DbPollutant,
  Gnfr,
  GnfrPollutantMeta,
  DbGnfrPollutantMeta,
  NodeEnv,
  Pollutant
} from "@/types";

const gsUri = process.env.VUE_APP_GEOSERVER_URI;
const gnfrMetaTable = "p_gnfr_meta";
const pollutantMetaTable = "p_pollutant_meta";
const pollutantGnfrMetaTable = "p_gnfr_pollutant_meta";

const getGnfrObject = (props: DbGnfr): Gnfr => {
  const name = { fi: props.nimi, sv: props.namn, en: props.name };
  const desc = { fi: props.desc_fi, sv: props.desc_sv, en: props.desc_en };
  return { id: props.id, name, desc, useDev: props.use_dev, useProd: props.use_prod };
};

export const fetchGnfrMeta = async (): Promise<Gnfr[]> => {
  const uri = `${gsUri}ows?service=WFS&version=1.0.0&request=GetFeature
  &typeName=paastotkartalla:${gnfrMetaTable}&outputFormat=application/json`.replace(/ /g, "");
  const response = await fetch(encodeURI(uri));
  const fc = await response.json();
  return fc.features
    .map((feat) => getGnfrObject(feat.properties))
    .filter((gnfr: Gnfr) => {
      if (process.env.NODE_ENV === NodeEnv.PRODUCTION) {
        return gnfr.useProd;
      }
      return gnfr.useDev;
    });
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

const getGnfrPollutantMetaObject = (props: DbGnfrPollutantMeta): GnfrPollutantMeta => {
  return {
    year: props.year,
    gnfr: props.gnfr,
    pollutant: "s" + props.pollutant,
    calcShare: props.calc_share,
    repShare: props.rep_share
  };
};

export const fetchGnfrPollutantMetas = async (): Promise<GnfrPollutantMeta[]> => {
  const uri = `${gsUri}ows?service=WFS&version=1.0.0&request=GetFeature
  &typeName=paastotkartalla:${pollutantGnfrMetaTable}
  &outputFormat=application/json`.replace(/ /g, "");
  const response = await fetch(encodeURI(uri));
  const fc = await response.json();
  console.log("response", fc);
  return fc.features.map((feat) => getGnfrPollutantMetaObject(feat.properties));
};