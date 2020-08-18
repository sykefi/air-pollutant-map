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

export interface MuniFeatureProperties {
  id: number;
  nimi: string;
  area: number;
  [key: string]: number | string;
}

interface LangStringMap {
  fi: string;
  sv: string;
  en: string;
}

export interface DbGnfr {
  db_key: string;
  nimi: string;
  namn: string;
  name: string;
  use_dev: boolean;
  use_prod: boolean;
}
export interface Gnfr {
  dbKey: string;
  name: LangStringMap;
  useDev: boolean;
  useProd: boolean;
}

export interface Pollutant {
  parlocGroupId: number;
  parlocGroupName: string;
  dbCol: string;
  name: LangStringMap;
  threshold: number | null;
  unit: string;
  repUnit: string;
  group: string | null;
  useDev: boolean;
  useProd: boolean;
}

export interface DbPollutant {
  parloc_ryhma_tunnus: number;
  parloc_ryhma_nimi: string;
  db_col: string;
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
