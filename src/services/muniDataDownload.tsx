import { utfBom } from "@/constants";
import { Lang } from "@/store";
import { Gnfr, LangStringMap, MuniFeatureProperties, Pollutant } from "@/types";
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

interface LocalMuniDataProperties extends MuniDataProperties {
  localGnfrName: string;
}

interface MuniDataFeature {
  properties: MuniDataProperties;
}

const downloadCsvContent = async (csvContent: string, filenamePrefix: string) => {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURI(csvContent));
  element.setAttribute("download", filenamePrefix + ".csv");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  await new Promise((resolve) =>
    setTimeout(() => resolve(document.body.removeChild(element)), 700)
  );
};

const outputFormat = "&outputFormat=application/json";
const muniDataGnfrTable = env.useAggregatedGnfrs
  ? "p_muni_data_gnfr_prod"
  : "p_muni_data_gnfr_dev";

const getWfsMuniDataGnfrUri = (muniId: number, pollutantIds: string[]): string => {
  const pollutantIdNames = pollutantIds.join(",");
  return `${env.gsUri}ows?service=WFS&version=1.0.0
  &request=GetFeature&typeName=paastotkartalla:${muniDataGnfrTable}
  &propertyName=kuntanro,nimi,namn,vuosi,gnfr,area,${pollutantIdNames}${outputFormat}
  &viewparams=kuntanro:${muniId}`.replace(/ /g, "");
};

const fetchMuniDataProps = async (
  muniId: number,
  pollutantIds: string[]
): Promise<MuniDataProperties[] | undefined> => {
  const uri = getWfsMuniDataGnfrUri(muniId, pollutantIds);
  try {
    const response = await fetch(encodeURI(uri));
    const rawFc = await response.json();
    return rawFc.features.map((feat: MuniDataFeature) => feat.properties);
  } catch (error) {
    console.error(error);
  }
};

const joinLocalGnfrNamesToMuniDataProps = (
  muniDataProps: MuniDataProperties[],
  gnfrNameById: Map<string, LangStringMap>,
  lang: Lang
): LocalMuniDataProperties[] => {
  return muniDataProps.map((props) => {
    const localGnfrName = gnfrNameById.has(props.gnfr)
      ? gnfrNameById.get(props.gnfr)![lang]
      : props.gnfr;
    return { ...props, localGnfrName };
  });
};

const sortMuniData = (a: LocalMuniDataProperties, b: LocalMuniDataProperties) => {
  if (a.vuosi !== b.vuosi) {
    return a.vuosi - b.vuosi;
  }
  return a.localGnfrName.localeCompare(b.localGnfrName);
};

const getMuniDataCsvContent = async (
  muniId: number,
  pollutantMetas: Pollutant[],
  gnfrNameById: Map<string, LangStringMap>,
  lang: Lang
): Promise<string | undefined> => {
  const pollutantIds = pollutantMetas.map((props) => props.id);
  const muniData = await fetchMuniDataProps(muniId, pollutantIds);
  if (!muniData) return;

  const pollutantColNames = pollutantMetas.map(
    (p) => `${p.name.fi} - ${p.name.en} (${p.unit})`
  );
  const sortedMuniData = joinLocalGnfrNamesToMuniDataProps(muniData, gnfrNameById, lang).sort(
    sortMuniData
  );

  const headerRow = "kuntanro;nimi;namn;vuosi;luokka;" + pollutantColNames.join(";");
  return sortedMuniData.reduce((csvContent, props, index) => {
    if (index == 0) {
      csvContent = headerRow + "\r\n";
    }
    const row = [props.kuntanro, props.nimi, props.namn, props.vuosi, props.localGnfrName]
      .concat(pollutantIds.map((id) => props[id]))
      .join(";");
    csvContent += row + "\r\n";
    return csvContent;
  }, "");
};

const getGnfrNameByGnfrIdMap = (gnfrMetas: Gnfr[]) => {
  const gnfrNameById: Map<string, LangStringMap> = new Map();
  gnfrMetas.forEach((gnfr) => gnfrNameById.set(gnfr.id, gnfr.name));
  return gnfrNameById;
};

/**
 * Fetches and downloads all pollutant data of the given municipality as a CSV file.
 * Returns a boolean indicating the success of the fetch & download.
 */
export const downloadMuniDataCsv = async (
  municipality: MuniFeatureProperties,
  fetchGnfrMeta: () => Promise<Gnfr[] | undefined>,
  fetchPollutantMeta: () => Promise<Pollutant[] | undefined>,
  lang: Lang
): Promise<boolean> => {
  const gnfrMetas = await fetchGnfrMeta();
  const pollutantMetas = await fetchPollutantMeta();
  if (!pollutantMetas || !gnfrMetas) return false;
  const gnfrNameById = getGnfrNameByGnfrIdMap(gnfrMetas);
  const csvContent = await getMuniDataCsvContent(
    municipality.id,
    pollutantMetas,
    gnfrNameById,
    lang
  );
  if (csvContent) {
    try {
      await downloadCsvContent(utfBom + csvContent, "paastodata_" + municipality.name.fi);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return false;
};
