import Vue from "vue";
import Vuex from "vuex";
import Cookies from "js-cookie";

Vue.use(Vuex);

export enum Lang {
  FI = "fi",
  SV = "sv",
  EN = "en"
}

export enum Dispatch {
  setDetectedLang = "setDetectedLang",
  setLang = "setLang",
  setLoading = "setLoading",
  setLoaded = "setLoaded"
}

enum Mutation {
  setLang = "setLang",
  setLoadingState = "setLoadingState"
}

const state = {
  lang: Lang.FI as Lang,
  loading: true as boolean
};

const mutations = {
  setLang(state, lang: Lang) {
    Cookies.set("air-pollutant-map-lang", lang);
    state.lang = lang;
  },
  setLoadingState(state, loading: boolean) {
    state.loading = loading;
  }
};

const actions = {
  setLang(context, lang: Lang) {
    context.commit(Mutation.setLang, lang);
  },
  setDetectedLang(context) {
    const previouslySelectedLang = Cookies.get("air-pollutant-map-lang");
    if (previouslySelectedLang) {
      context.commit(Mutation.setLang, previouslySelectedLang);
    } else {
      // try to detect language from browser
      const detectedLangCode: string =
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        //@ts-ignore deprecated but IE may still have it
        navigator.userLanguage;
      Object.values(Lang).forEach((lang) => {
        if (detectedLangCode.substring(0, 2).toLowerCase().includes(lang)) {
          context.commit(Mutation.setLang, lang);
        }
      });
    }
  },
  setLoading(context) {
    context.commit(Mutation.setLoadingState, true);
  },
  setLoaded(context) {
    context.commit(Mutation.setLoadingState, false);
  }
};

export const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters: {
    lang: (state) => state.lang
  }
});
