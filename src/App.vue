<template>
  <div id="paastokartta-div">
    <OlMap v-bind:year="2015" pollutant="s16"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import OlMap from "./components/OlMap.vue";

@Component({
  components: {
    OlMap
  }
})
export default class App extends Vue {}
</script>

<style>
#paastokartta-div {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
