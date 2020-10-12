<template>
  <div>
    <label class="visually-hidden" for="lang-selector-wrapper">
      {{ "aria.language.selector.label" | translate }}
    </label>
    <div class="lang-selector-wrapper">
      <div style="display: flex;">
        <div
          id="selector-left"
          role="button"
          tabindex="0"
          :aria-pressed="lang === Lang.FI"
          v-on:click="() => setLanguage(Lang.FI)"
          v-bind:class="[
            lang === Lang.FI ? 'selected-lang' : 'lang-button-hover',
            'lang-button'
          ]"
        >
          FI
        </div>
        <div
          id="selector-middle"
          role="button"
          tabindex="0"
          :aria-pressed="lang === Lang.SV"
          v-on:click="() => setLanguage(Lang.SV)"
          v-bind:class="[
            lang === Lang.SV ? 'selected-lang' : 'lang-button-hover',
            'lang-button'
          ]"
        >
          SV
        </div>
        <div
          id="selector-right"
          role="button"
          tabindex="0"
          :aria-pressed="lang === Lang.EN"
          v-on:click="() => setLanguage(Lang.EN)"
          v-bind:class="[
            lang === Lang.EN ? 'selected-lang' : 'lang-button-hover',
            'lang-button'
          ]"
        >
          EN
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { Lang } from "@/store";

export default Vue.extend({
  data() {
    return {
      Lang: Object(Lang)
    };
  },
  computed: mapState(["lang"]),
  methods: {
    setLanguage: function (lang: Lang) {
      this.$store.commit("setLang", lang);
    }
  }
});
</script>

<style scoped>
.lang-selector-wrapper {
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.57);
  padding: 5px;
  font-size: 12px;
  box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.07);
  height: min-content;
  margin: 0px 10px 0px 10px;
}
.lang-button {
  background-color: white;
  border: 2px solid #949494;
  color: #949494;
  cursor: pointer;
  padding: 3px 7px;
  font-weight: 550;
  z-index: 2;
  transition-duration: 0.15s;
  -webkit-transition-duration: 0.15s; /* Safari */
}
.lang-button:focus {
  outline: none;
}
.lang-button-hover:hover {
  color: black;
}
#selector-left {
  padding: 3px 8px 3px 7px;
  margin-right: -1px;
  border-radius: 5px 0 0 5px;
}
#selector-right {
  border-radius: 0 5px 5px 0;
}
#selector-middle {
  margin-right: -1px;
}
.selected-lang {
  z-index: 3;
  cursor: auto;
  color: white;
  border-color: #3969a1;
  background-color: rgba(0, 60, 136, 0.5);
}
.visually-hidden {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
</style>
