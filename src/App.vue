<template>
  <div id="app-wrapper">
    <div id="app-container">
      <div id="settings-panel">
        <SelectorYear @selected-year="(year) => (this.year = year)" />
        <SelectorGnfr
          :mapDataType="mapDataType"
          @selected-gnfr="(gnfr) => (this.gnfr = gnfr)"
        />
        <SelectorPollutant @selected-pollutant="(p) => (this.pollutant = p)" />
      </div>
      <div v-if="gnfr" id="gnfr-desc">
        <GnfrDescription
          :year="year"
          :gnfr="gnfr"
          :pollutant="pollutant"
          :totalPollutionStats="totalPollutionStats"
        />
      </div>
      <div id="map-container">
        <OlMap
          :year="year"
          :gnfrId="gnfr ? gnfr.id : undefined"
          :pollutant="pollutant"
          :mapDataType="mapDataType"
          @update-total-pollution-stats="(tps) => (this.totalPollutionStats = tps)"
        />
        <div id="map-controls-container">
          <ToggleDataType
            :mapDataType="mapDataType"
            @select-map-data-type="(type) => (this.mapDataType = type)"
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
import ToggleDataType from "./components/ToggleDataType.vue";
import SelectorPollutant from "./components/SelectorPollutant.vue";
import SelectorGnfr from "./components/SelectorGnfr.vue";
import ToggleLanguageButtons from "./components/ToggleLanguageButtons.vue";
import GnfrDescription from "./components/GnfrDescription.vue";
import { Pollutant, MapDataType, Gnfr, TotalPollutionStats } from "./types";
import { Dispatch } from "./store";
import * as env from "./env";

export default Vue.extend({
  components: {
    OlMap,
    SelectorYear,
    SelectorGnfr,
    SelectorPollutant,
    ToggleDataType,
    ToggleLanguageButtons,
    GnfrDescription
  },
  data() {
    return {
      year: env.latestYear as number,
      gnfr: undefined as Gnfr | undefined,
      pollutant: undefined as Pollutant | undefined,
      mapDataType: MapDataType.GRID as MapDataType,
      totalPollutionStats: undefined as TotalPollutionStats | undefined
    };
  },
  beforeCreate() {
    this.$store.dispatch(Dispatch.setDetectedLang);
  }
});
</script>

<style scoped>
#app-wrapper {
  display: flex;
  align-content: center;
  justify-content: center;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 15px;
  width: 100%;
  line-height: initial;
}
#app-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  width: 100%;
  max-width: 556px;
}
#settings-panel {
  width: 100%;
  display: flex;
  z-index: 5;
}
@media (max-width: 508px) {
  #settings-panel {
    flex-wrap: wrap;
  }
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
  border: 1px solid #707070;
  border-radius: 4px;
}
#map-controls-container {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  top: 9px;
  left: 50px;
}
</style>
