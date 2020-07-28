<template>
  <div id="wrapper">
    <div id="app-wrapper">
      <div id="settings-panel">
        <SelectorYear @set-selected-year="setSelectedYear" />
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

export default Vue.extend({
  data() {
    return {
      year: 2015,
      pollutant: "s16"
    };
  },
  methods: {
    setSelectedYear(year: number) {
      this.year = year;
    }
  },
  components: {
    OlMap,
    SelectorYear
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
