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
