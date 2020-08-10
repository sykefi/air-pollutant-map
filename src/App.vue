<template>
  <div id="app-wrapper">
    <div id="app-container">
      <div id="settings-panel">
        <SelectorYear @set-selected-year="setSelectedYear" />
        <SelectorGnfr @set-selected-gnfr="setSelectedGnfr" />
        <SelectorPollutant @set-selected-pollutant="setSelectedPollutant" />
      </div>
      <div id="map-container">
        <OlMap
          :gnfr="gnfr"
          :year="year"
          :pollutant="pollutant"
          @update-legend="updateLegend"
        />
        <SelectorDataType
          id="map-data-type-selector-container"
          :mapDataType="mapDataType"
          @select-map-data-type="selectMapDataType"
        />
        <Legend v-if="legend" id="map-legend-container" :legend="legend" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import OlMap from "./components/OlMap.vue";
import SelectorYear from "./components/SelectorYear.vue";
import SelectorDataType from "./components/SelectorDataType.vue";
import Legend from "./components/Legend.vue";
import SelectorPollutant, { getDefaultPollutant } from "./components/SelectorPollutant.vue";
import SelectorGnfr from "./components/SelectorGnfr.vue";
import { Pollutant, PollutantLegend, Gnfr, MapDataType } from "./types";
import * as constants from "./constants";

export default Vue.extend({
  data() {
    return {
      year: constants.initialYear as number,
      gnfr: constants.initialGnfr as Gnfr,
      pollutant: getDefaultPollutant() as Pollutant,
      mapDataType: MapDataType.GRID as MapDataType,
      legend: undefined as PollutantLegend | undefined
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
    },
    updateLegend(legend: PollutantLegend) {
      this.legend = legend;
    }
  },
  components: {
    OlMap,
    SelectorYear,
    SelectorGnfr,
    SelectorPollutant,
    SelectorDataType,
    Legend
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
#map-data-type-selector-container {
  position: absolute;
  top: 9px;
  left: 50px;
}
#map-legend-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}
</style>
