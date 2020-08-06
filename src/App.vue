<template>
  <div id="wrapper">
    <div id="app-wrapper">
      <div id="settings-panel">
        <SelectorYear @set-selected-year="setSelectedYear" />
        <SelectorGnfr @set-selected-gnfr="setSelectedGnfr" />
        <SelectorPollutant @set-selected-pollutant="setSelectedPollutant" />
      </div>
      <div id="paastokartta-div">
        <OlMap
          :gnfr="gnfr"
          :year="year"
          :pollutant="pollutant"
          @update-legend="updateLegend"
        />
        <Legend v-if="legend" class="map-legend" :legend="legend" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import OlMap from "./components/OlMap.vue";
import SelectorYear from "./components/SelectorYear.vue";
import Legend from "./components/Legend.vue";
import SelectorPollutant, { getDefaultPollutant } from "./components/SelectorPollutant.vue";
import SelectorGnfr from "./components/SelectorGnfr.vue";
import { Pollutant, PollutantLegend, Gnfr } from "./types";

export default Vue.extend({
  data() {
    return {
      year: 2015 as number,
      gnfr: Gnfr.A_PUBLICPOWER as Gnfr,
      pollutant: getDefaultPollutant() as Pollutant,
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
    updateLegend(legend: PollutantLegend) {
      this.legend = legend;
    }
  },
  components: {
    OlMap,
    SelectorYear,
    SelectorGnfr,
    SelectorPollutant,
    Legend
  }
});
</script>

<style scoped>
#wrapper {
  display: flex;
  align-content: center;
  justify-content: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
#app-wrapper {
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
  z-index: 3;
}
#paastokartta-div {
  position: relative;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.map-legend {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}
</style>
