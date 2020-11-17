<template>
  <div class="buttons-container">
    <button class="download-button" ref="download-muni-data-button" @click="downloadMuniData">
      <span v-if="!loadingMuniData">
        {{ "muni.popup.csv-data-download.download-label" | translate }} (.csv)
      </span>
      <span v-else class="loading-container">
        <span> {{ "muni.popup.csv-data-download.downloading-label" | translate }}</span>
        <span class="loading-wrapper"><LoadingAnimation color="white" :size="14" /></span>
      </span>
    </button>
    <div class="download-error-label" v-if="lastAttemptFailed">
      {{ "muni.popup.csv-data-download.download-error-text" | translate }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { MuniFeatureProperties } from "@/types";
import { mapState } from "vuex";
import { downloadMuniDataCsv } from "@/services/muniDataDownload";
import { fetchPollutantMeta, fetchGnfrMeta } from "@/services/meta";
import LoadingAnimation from "./LoadingAnimation.vue";

export default Vue.extend({
  props: {
    featProps: { type: Object as PropType<MuniFeatureProperties> }
  },
  computed: mapState(["lang"]),
  components: { LoadingAnimation },
  data() {
    return {
      loadingMuniData: false as boolean,
      lastAttemptFailed: false as boolean
    };
  },
  watch: {
    featProps() {
      this.lastAttemptFailed = false;
    }
  },
  methods: {
    getDownnloadMuniDataButton(): HTMLElement {
      return this.$refs["download-muni-data-button"] as HTMLElement;
    },
    translateOrDefault(key: string, defaultString: string): string {
      const translated = this.$options.filters
        ? this.$options.filters.translate(key)
        : defaultString;
      return translated !== key ? translated : defaultString;
    },
    async downloadMuniData() {
      this.loadingMuniData = true;
      const filenamePrefix = this.translateOrDefault(
        "muni.popup.csv-data-download.filename-prefix",
        "paastodata"
      );
      const headerRowPrefix = this.translateOrDefault(
        "muni.popup.csv-data-download.header-row",
        "kuntanro;nimi;namn;vuosi;luokka;"
      );

      const success = await downloadMuniDataCsv(
        filenamePrefix,
        headerRowPrefix,
        this.featProps,
        fetchGnfrMeta,
        fetchPollutantMeta,
        this.lang
      );

      this.loadingMuniData = false;
      this.lastAttemptFailed = !success;
      this.getDownnloadMuniDataButton().blur();
    }
  }
});
</script>

<style scoped>
.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px 0px 0px 0px;
}
.download-button {
  cursor: pointer;
  width: max-content;
  background-color: #007ac9;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 4px 12px;
  margin: 3px 2px;
  display: flex;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
}
.download-button:focus,
.download-button:hover {
  outline: 0 !important;
  background-color: #2996df;
}
.download-error-label {
  font-size: 12px;
  color: #e20000;
  margin: 0px 0px 4px 0px;
}
.loading-container {
  display: flex;
}
.loading-wrapper {
  margin: -1px 0px 0px 6px;
  display: flex;
  align-items: center;
}
</style>
