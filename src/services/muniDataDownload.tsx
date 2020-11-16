import { MuniFeatureProperties, Pollutant } from "@/types";
import * as env from "./../env";

interface PollutantValues {
  s16: number;
  s15: number;
  s22: number;
  s13: number;
  s28: number;
  s29: number;
  s27: number;
  s43: number;
  s5: number;
  s18: number;
  s3: number;
  s12: number;
  s1: number;
  s7: number;
  s8: number;
  s14: number;
  s37: number;
  s25: number;
  s19: number;
  s17: number;
  s38: number;
  s40: number;
}

interface MuniDataProperties extends PollutantValues {
  kuntanro: number;
  nimi: string;
  namn: string;
  vuosi: number;
  gnfr: string;
  area: number;
}

interface MuniDataFeature {
  properties: MuniDataProperties;
}

const outputFormat = "&outputFormat=application/json";
const muniDataGnfrTable = env.useAggregatedGnfrs
  ? "p_muni_data_gnfr_prod"
  : "p_muni_data_gnfr_dev";

const getWfsMuniDataGnfrUri = (muniId: number, pollutantIdNames: string): string => {
  return `${env.gsUri}ows?service=WFS&version=1.0.0
  &request=GetFeature&typeName=paastotkartalla:${muniDataGnfrTable}
  &propertyName=kuntanro,nimi,namn,vuosi,gnfr,area,${pollutantIdNames}${outputFormat}
  &viewparams=kuntanro:${muniId}`.replace(/ /g, "");
};

const fetchMuniDataProps = async (
  muniId: number,
  pollutantIds: string[]
): Promise<MuniDataProperties[] | undefined> => {
  const pollutantIdNames = pollutantIds.join(",");
  const uri = getWfsMuniDataGnfrUri(muniId, pollutantIdNames);
  try {
    const response = await fetch(encodeURI(uri));
    const rawFc = await response.json();
    console.log("rawFc", rawFc);

    return rawFc.features.map((feat: MuniDataFeature) => feat.properties);
  } catch (error) {
    console.error(error);
  }
};

const sortMuniData = (a: MuniDataProperties, b: MuniDataProperties) => {
  if (a.vuosi !== b.vuosi) {
    return a.vuosi - b.vuosi;
  }
  return a.gnfr.localeCompare(b.gnfr);
};

const getMuniDataCsvContent = async (
  muniId: number,
  pollutantIds: string[]
): Promise<string | undefined> => {
  const muniData = await fetchMuniDataProps(muniId, pollutantIds);
  if (!muniData) return;

  const sortedMuniData = muniData.sort(sortMuniData);
  const firstRow = "kuntanro;nimi;namn;vuosi;gnfr;" + pollutantIds.join(";");
  return sortedMuniData.reduce((csvContent, props, index) => {
    if (index == 0) {
      csvContent = firstRow + "\r\n";
    }
    const row = [props.kuntanro, props.nimi, props.namn, props.vuosi, props.gnfr]
      .concat(pollutantIds.map((id) => props[id]))
      .join(";");
    csvContent += row + "\r\n";
    return csvContent;
  }, "");
};

const downloadCsvContent = (csvContent: string, filenamePrefix: string) => {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURI(csvContent));
  element.setAttribute("download", filenamePrefix + ".csv");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const downloadMuniDataCsv = async (
  municipality: MuniFeatureProperties,
  fetchPollutantMeta: () => Promise<Pollutant[]>,
  metadataCsv: boolean
): Promise<boolean> => {
  const pollutantMetas = await fetchPollutantMeta();
  const pollutantIds = pollutantMetas.map((props) => props.id);
  const csvContent = await getMuniDataCsvContent(municipality.id, pollutantIds);
  if (csvContent) {
    downloadCsvContent(csvContent, "paastodata_ " + municipality.name.fi);
    return true;
  }
  return false;
};
