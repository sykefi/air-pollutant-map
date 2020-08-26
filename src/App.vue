<template>
  <div id="app-wrapper">
    <div id="app-container">
      <div id="settings-panel">
        <SelectorYear @set-selected-year="setSelectedYear" />
        <SelectorGnfr :mapDataType="mapDataType" @set-selected-gnfr="setSelectedGnfr" />
        <SelectorPollutant @set-selected-pollutant="setSelectedPollutant" />
      </div>
      <div id="map-container">
        <OlMap :gnfr="gnfr" :year="year" :pollutant="pollutant" :mapDataType="mapDataType" />
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
import { Pollutant, MapDataType } from "./types";
import * as constants from "./constants";

export default Vue.extend({
  components: {
    OlMap,
    SelectorYear,
    SelectorGnfr,
    SelectorPollutant,
    SelectorDataType,
    ToggleLanguageButtons
  },
  data() {
    return {
      year: constants.initialYear as number,
      gnfr: undefined as string | undefined,
      pollutant: undefined as Pollutant | undefined,
      mapDataType: MapDataType.GRID as MapDataType
    };
  },
  methods: {
    setSelectedYear(year: number) {
      this.year = year;
    },
    setSelectedGnfr(gnfrId: string) {
      this.gnfr = gnfrId;
    },
    setSelectedPollutant(pollutant: Pollutant) {
      this.pollutant = pollutant;
    },
    selectMapDataType(mapDataType: MapDataType) {
      this.mapDataType = mapDataType;
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
#map-container {
  position: relative;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#map-controls-container {
  position: absolute;
  display: flex;
  top: 9px;
  left: 50px;
}
</style>
