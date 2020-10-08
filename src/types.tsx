export enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test"
}

export interface PollutantValues {
  s16?: number;
  s15?: number;
  s22?: number;
  s13?: number;
  s28?: number;
  s29?: number;
  s27?: number;
  s43?: number;
  s5?: number;
  s18?: number;
  s3?: number;
  s12?: number;
  s1?: number;
  s7?: number;
  s8?: number;
  s14?: number;
  s37?: number;
  s25?: number;
  s19?: number;
  s17?: number;
  s38?: number;
  s40?: number;
}

export enum MapDataType {
  MUNICIPALITY = "Municipality",
  GRID = "Grid"
}

interface ValueRange {
  min: number;
  max: number;
  color: string;
}

export interface PollutantLegend {
  classNames: number[];
  [key: number]: ValueRange;
  unit: string;
}

interface Polygon {
  coordinates: number[][];
  type: "Polgyon";
}

interface MultiPolygon {
  coordinates: number[][][];
  type: "MultiPolygon";
}

interface FeatureCollection {
  type: "FeatureCollection";
}

export interface GridFeature {
  geometry: Polygon;
  properties: PollutantValues;
}

export interface GridFeatureCollection extends FeatureCollection {
  features: GridFeature[];
}

export interface WfsMuniFeatureProperties extends PollutantValues {
  id: number;
  nimi: string;
  namn: string;
  area: number;
}

interface WfsMuniFeature {
  type: "Feature";
  geometry: MultiPolygon;
  properties: WfsMuniFeatureProperties;
}

export interface WfsMuniFeatureCollection extends FeatureCollection {
  features: WfsMuniFeature[];
}

export interface MuniFeatureProperties extends PollutantValues {
  id: number;
  name: LangStringMap;
  area: number;
}

export interface MuniFeature {
  type: "Feature";
  geometry: MultiPolygon;
  properties: MuniFeatureProperties;
}

export interface MuniFeatureCollection extends FeatureCollection {
  features: MuniFeature[];
}

interface LangStringMap {
  fi: string;
  sv: string;
  en: string;
}

export interface DbGnfr {
  id: string;
  nimi: string;
  namn: string;
  name: string;
  desc_fi: string;
  desc_sv: string;
  desc_en: string;
  use_dev: boolean;
  use_prod: boolean;
}
export interface Gnfr {
  id: string;
  name: LangStringMap;
  desc: LangStringMap;
  useDev: boolean;
  useProd: boolean;
}

export interface DbPollutant {
  id: string;
  parloc_ryhma_tunnus: number;
  parloc_ryhma_nimi: string;
  nimi: string;
  namn: string;
  name: string;
  raja_arvo: number | null;
  yksikko: string;
  rap_yksikko: string;
  ryhma: string | null;
  use_dev: boolean;
  use_prod: boolean;
}

export interface Pollutant {
  id: string;
  parlocGroupId: number;
  parlocGroupName: string;
  name: LangStringMap;
  threshold: number | null;
  unit: string;
  repUnit: string;
  group: string | null;
  useDev: boolean;
  useProd: boolean;
}

export interface DbGnfrPollutantMeta {
  year: number;
  gnfr: string;
  pollutant: string;
  rep_share: number;
  calc_share: number;
}

export interface GnfrPollutantMeta {
  year: number;
  gnfr: string;
  pollutant: string;
  repShare: number;
  calcShare: number;
}

export interface TotalPollutionStats {
  gnfrId: string;
  unit: string;
  gnfrPollution: number;
  totalPollution: number;
}
