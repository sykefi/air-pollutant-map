<template>
  <div class="buttons-container">
    <button class="download-button" @click="downloadMuniData">
      <span v-if="!loadingMuniData">Download data</span>
      <span v-else class="loading-container">
        <span> Downloading data </span>
        <span class="loading-wrapper"><LoadingAnimation color="white" :size="14" /></span>
      </span>
    </button>
    <button class="download-button metadata-button" @click="downloadMuniDataMetadata">
      Download metadata
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { MuniFeatureProperties } from "@/types";
import { mapState } from "vuex";
import { downloadMuniDataCsv, downloadMuniDataMetaCsv } from "@/services/muniDataDownload";
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
      loadingMuniData: false as boolean
    };
  },
  methods: {
    async downloadMuniData() {
      this.loadingMuniData = true;
      const success = await downloadMuniDataCsv(this.featProps, fetchPollutantMeta);
      this.loadingMuniData = false;
      if (!success) {
        console.log("Error in downloading municipality dataset");
      }
    },
    async downloadMuniDataMetadata() {
      await downloadMuniDataMetaCsv(fetchPollutantMeta);
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
}
.metadata-button {
  background-color: #acacac;
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
