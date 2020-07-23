<template>
  <div id="ol-map">
    <div v-if="isReady">
      <OlGridDataLayer v-bind:year="year" v-bind:pollutant="pollutant" v-bind:map="map" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import Map from "ol/Map.js";
import View from "ol/View.js";
import OSM from "ol/source/OSM";
import { Tile as TileLayer } from "ol/layer";
import OlGridDataLayer from "./OlGridDataLayer.vue";

export default Vue.extend({
  props: {
    year: Number,
    pollutant: String,
  },
  components: {
    OlGridDataLayer
  },
  data() {
    return {
      map: undefined as Map | undefined,
      isReady: false as boolean
    };
  },
  mounted() {
    this.map = new Map({
      target: "ol-map",
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        projection: "EPSG:3857",
        center: [2587716,8599901],
        zoom: 8
      })
    });
    this.map.once("postrender", () => {
      console.log("map is ready");
      this.isReady = true;
    });
  }
});
</script>

<style scoped>
@import "~ol/ol.css";
#ol-map {
  height: 400px;
  width: 600px;
  z-index: 0;
}
</style>