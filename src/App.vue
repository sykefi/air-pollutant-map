<template>
  <div id="app-wrapper">
    <div id="app-container">
      <div id="settings-panel">
        <SelectorYear @set-selected-year="setSelectedYear" />
        <SelectorGnfr :mapDataType="mapDataType" @set-selected-gnfr="setSelectedGnfr" />
        <SelectorPollutant @set-selected-pollutant="setSelectedPollutant" />
      </div>
      <div v-if="gnfr" id="gnfr-desc">
        <GnfrDescription :year="year" :gnfr="gnfr" :pollutant="pollutant" />
      </div>
      <div id="map-container" :class="[nodeEnv === 'production' ? 'map-border' : '']">
        <OlMap
          :year="year"
          :gnfrId="gnfr ? gnfr.id : undefined"
          :pollutant="pollutant"
          :mapDataType="mapDataType"
        />
        <div id="map-controls-container">
          <SelectorDataType
            :mapDataType="mapDataType"
            @select-map-data-type="selectMapDataType"
          />
          <ToggleLanguageButtons />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OlMap from "./components/OlMap.vue";
import SelectorYear from "./components/SelectorYear.vue";
import SelectorDataType from "./components/SelectorDataType.vue";
import SelectorPollutant from "./components/SelectorPollutant.vue";
import SelectorGnfr from "./components/SelectorGnfr.vue";
import ToggleLanguageButtons from "./components/ToggleLanguageButtons.vue";
import GnfrDescription from "./components/GnfrDescription.vue";
import { Pollutant, MapDataType, Gnfr, NodeEnv } from "./types";
import { Dispatch } from "./store";
import * as constants from "./constants";

export default Vue.extend({
  components: {
    OlMap,
    SelectorYear,
    SelectorGnfr,
    SelectorPollutant,
    SelectorDataType,
    ToggleLanguageButtons,
    GnfrDescription
  },
  data() {
    return {
      nodeEnv: process.env.NODE_ENV as NodeEnv,
      year: constants.initialYear as number,
      gnfr: undefined as Gnfr | undefined,
      pollutant: undefined as Pollutant | undefined,
      mapDataType: MapDataType.GRID as MapDataType
    };
  },
  methods: {
    setSelectedYear(year: number) {
      this.year = year;
    },
    setSelectedGnfr(gnfr: Gnfr) {
      this.gnfr = gnfr;
    },
    setSelectedPollutant(pollutant: Pollutant) {
      this.pollutant = pollutant;
    },
    selectMapDataType(mapDataType: MapDataType) {
      this.mapDataType = mapDataType;
    }
  },
  beforeCreate() {
    if (process.env.VUE_APP_DETECT_LANGUAGE === "false") {
      return;
    } else {
      this.$store.dispatch(Dispatch.setDetectedLang);
    }
  }
});
</script>

<style scoped>
#app-wrapper {
  display: flex;
  align-content: center;
  justify-content: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
#app-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  width: calc(100% - 20px);
  max-width: 600px;
}
#settings-panel {
  width: 100%;
  display: flex;
  z-index: 5;
}
#gnfr-desc {
  width: 100%;
  display: flex;
}
#map-container {
  position: relative;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.map-border {
  border: 1px solid #707070;
  border-radius: 4px;
}
#map-controls-container {
  position: absolute;
  display: flex;
  top: 9px;
  left: 50px;
}
</style>
