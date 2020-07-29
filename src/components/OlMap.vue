<template>
  <div id="ol-map">
    <div v-if="isReady">
      <OlGridDataLayer :year="year" :pollutant="pollutant" :map="map" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import { PropType } from "vue";
import Map from "ol/Map.js";
import View from "ol/View.js";
import OSM from "ol/source/OSM";
import { Tile as TileLayer } from "ol/layer";
import { Attribution, defaults as defaultControls } from "ol/control";
import OlGridDataLayer from "./OlGridDataLayer.vue";
import { Pollutant } from "../types";

const attribution = new Attribution({
  collapsible: true
});

export default Vue.extend({
  props: {
    year: Number,
    pollutant: { type: Object as PropType<Pollutant> }
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
      controls: defaultControls({ attribution: false }).extend([attribution]),
      view: new View({
        projection: "EPSG:3857",
        center: [2587716, 8599901],
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
  width: 100%;
  z-index: 0;
}
</style>
