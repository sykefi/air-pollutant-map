import fi from "./fi.json";
import sv from "./sv.json";
import en from "./en.json";
import { Lang } from "@/store";

export default {
  fi: fi as Record<string, string>,
  sv: sv as Record<string, string>,
  en: en as Record<string, string>
} as Record<Lang, Record<string, string>>;
