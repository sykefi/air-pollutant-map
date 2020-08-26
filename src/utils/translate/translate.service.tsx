import { store, Lang } from "../../store";
import dictionary from "./dictionary";

export default {
  translate(key: string): string {
    const currentLang: Lang = store.getters.lang;
    if (key in dictionary[currentLang]) {
      return dictionary[currentLang][key];
    }
    return key;
  }
};
