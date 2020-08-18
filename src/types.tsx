export interface Pollutant {
  parlocRyhmaTunnus: number;
  dbCol: string;
  parlocRyhmaNimi: string;
  parlocRyhmaSelite: string;
  raja_arvo: number;
  yksikko: string;
  rapYkskko: string;
  kerroinRaportointiin: string;
  seliteRaportoinnissa: string;
  ryhma: string;
  jarjestusraportissa: number | string;
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

export enum MapDataType {
  MUNICIPALITY = "Municipality",
  GRID = "Grid"
}

export interface MuniFeatureProperties {
  id: number;
  nimi: string;
  area: number;
  [key: string]: number | string;
}
