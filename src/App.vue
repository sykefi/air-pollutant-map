<template>
  <div id="wrapper">
    <div id="app-wrapper">
      <div id="settings-panel">
        <SelectorYear @set-selected-year="setSelectedYear" />
        <SelectorPollutant @set-selected-pollutant="setSelectedPollutant" />
      </div>
      <div id="paastokartta-div">
        <OlMap :year="year" :pollutant="pollutant" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import OlMap from "./components/OlMap.vue";
import SelectorYear from "./components/SelectorYear.vue";
import SelectorPollutant, { getDefaultPollutant } from "./components/SelectorPollutant.vue";
import { Pollutant } from "./types";

export default Vue.extend({
  data() {
    return {
      year: 2015 as number,
      pollutant: getDefaultPollutant() as Pollutant
    };
  },
  methods: {
    setSelectedYear(year: number) {
      this.year = year;
    },
    setSelectedPollutant(pollutant: Pollutant) {
      this.pollutant = pollutant;
    }
  },
  components: {
    OlMap,
    SelectorYear,
    SelectorPollutant
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
}
#paastokartta-div {
  display: flex;
  align-content: center;
  justify-content: center;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
