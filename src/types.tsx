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

export enum Gnfr {
  COMBINED = "Combined",
  I_OFFROAD = "I_Offroad",
  A_PUBLICPOWER = "A_PublicPower",
  K_AGRILIVESTOCK = "K_AgriLivestock",
  G_SHIPPING = "G_Shipping",
  H_AVIATION = "H_Aviation",
  F_ROADTRANSPORT = "F_RoadTransport",
  B_INDUSTRY = "B_Industry",
  C_OTHERSTATIONARYCOMB = "C_OtherStationaryComb",
  L_AGRIOTHER = "L_AgriOther",
  E_SOLVENTS = "E_Solvents",
  J_WASTE = "J_Waste",
  D_FUGITIVE = "D_Fugitive"
}

export enum MapDataType {
  MUNICIPALITY = "Municipality",
  GRID = "Grid"
}
