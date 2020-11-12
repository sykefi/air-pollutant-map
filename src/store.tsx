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
  setPreviouslySelectedLang = "setPreviouslySelectedLang",
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
  setPreviouslySelectedLang(context) {
    const previouslySelectedLang = Cookies.get("air-pollutant-map-lang") as Lang;
    if (previouslySelectedLang) {
      context.commit(Mutation.setLang, previouslySelectedLang);
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
