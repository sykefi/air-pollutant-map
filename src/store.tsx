import Vue from "vue";
import Vuex from "vuex";
import Cookies from "js-cookie";

Vue.use(Vuex);

export enum Lang {
  FI = "fi",
  SV = "sv",
  EN = "en"
}

export const store = new Vuex.Store({
  state: {
    lang: Lang.FI
  },
  mutations: {
    setLang(state, lang: Lang) {
      Cookies.set("air-pollutant-map-lang", lang);
      state.lang = lang;
    }
  },
  actions: {
    setDetectedLang(context) {
      const previouslySelectedLang = Cookies.get("air-pollutant-map-lang");
      if (previouslySelectedLang) {
        context.commit("setLang", previouslySelectedLang);
      } else {
        // try to detect language from browser
        const detectedLangCode: string =
          (navigator.languages && navigator.languages[0]) ||
          navigator.language ||
          //@ts-ignore deprecated but IE may still have it
          navigator.userLanguage;
        Object.values(Lang).forEach((lang) => {
          if (detectedLangCode.substring(0, 2).toLowerCase().includes(lang)) {
            context.commit("setLang", lang);
          }
        });
      }
    }
  },
  getters: {
    lang: (state) => state.lang
  }
});
