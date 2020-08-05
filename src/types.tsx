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
  I_Offroad = "I_Offroad",
  A_PublicPower = "A_PublicPower",
  K_AgriLivestock = "K_AgriLivestock",
  G_Shipping = "G_Shipping",
  H_Aviation = "H_Aviation",
  F_RoadTransport = "F_RoadTransport",
  B_Industry = "B_Industry",
  C_OtherStationaryComb = "C_OtherStationaryComb",
  L_AgriOther = "L_AgriOther",
  E_Solvents = "E_Solvents",
  J_Waste = "J_Waste",
  D_Fugitive = "D_Fugitive"
}
