<template>
  <div class="buttons-container">
    <button class="download-button" @click="downloadMuniData">
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
    <button class="download-button metadata-button" @click="downloadMuniDataMetadata">
      {{ "muni.popup.csv-data-download.download-metadata-label" | translate }} (.csv)
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { MuniFeatureProperties } from "@/types";
import { mapState } from "vuex";
import { downloadMuniDataCsv, downloadPollutantMetaCsv } from "@/services/muniDataDownload";
import { fetchPollutantMeta } from "@/services/meta";
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
    async downloadMuniData() {
      this.loadingMuniData = true;
      const success = await downloadMuniDataCsv(this.featProps, fetchPollutantMeta);
      this.loadingMuniData = false;
      this.lastAttemptFailed = !success;
    },
    downloadMuniDataMetadata() {
      downloadPollutantMetaCsv(fetchPollutantMeta);
    }
  }
});
</script>

<style scoped>
.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4px 0px 0px 0px;
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
.download-button:focus {
  outline: 0 !important;
  background-color: #046db3;
}
.download-error-label {
  font-size: 12px;
  color: #e20000;
  margin: 0px 0px 4px 0px;
}
.metadata-button {
  background-color: #979797;
}
.metadata-button:focus {
  outline: 0 !important;
  background-color: #818181;
}
.loading-container {
  display: flex;
}
.loading-wrapper {
  margin: 0px 0px 0px 6px;
  display: flex;
  align-items: center;
}
</style>
