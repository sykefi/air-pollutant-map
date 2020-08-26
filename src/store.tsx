import Vue from "vue";
import Vuex from "vuex";

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
      state.lang = lang;
    }
  },
  getters: {
    lang: (state) => state.lang
  }
});
