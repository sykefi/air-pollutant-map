<template>
  <div>
    <div id="ol-map">
      <div v-if="isReady && mapDataType === mapDataTypes.GRID">
        <OlGridDataLayer
          :gnfr="gnfr"
          :year="year"
          :pollutant="pollutant"
          :map="map"
          @update-legend="updateLegend"
        />
      </div>
    </div>
    <div class="olpopup" ref="olpopup" v-show="popupContent">
      <span class="olpopup-closer" @click="closePopup">✖</span>
      <div class="olpopup-content">{{ popupContent }}</div>
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
import { Pollutant, MapDataType } from "../types";
import { PollutantLegend, Gnfr } from "../types";
import Overlay from "ol/Overlay";
import { toStringHDMS } from "ol/coordinate";
import { toLonLat } from "ol/proj";

const attribution = new Attribution({
  collapsible: true
});

export default Vue.extend({
  props: {
    year: Number,
    pollutant: { type: Object as PropType<Pollutant> },
    gnfr: { type: String as PropType<Gnfr> },
    mapDataType: { type: String as PropType<MapDataType> }
  },
  components: {
    OlGridDataLayer
  },
  methods: {
    updateLegend(legend: PollutantLegend) {
      this.$emit("update-legend", legend);
    },
    closePopup() {
      // Set the position of the pop-up window to undefined, and clear the coordinate data
      if (this.overlay) {
        this.overlay.setPosition(undefined);
      }
      this.popupContent = null;
    }
  },
  data() {
    return {
      map: undefined as Map | undefined,
      isReady: false as boolean,
      mapDataTypes: Object(MapDataType),
      overlay: null as Overlay | null,
      popupContent: null as string | null
    };
  },
  mounted() {
    this.map = new Map({
      target: "ol-map",
      layers: [new TileLayer({ source: new OSM() })],
      controls: defaultControls({ attribution: false }).extend([attribution]),
      view: new View({
        projection: "EPSG:3857",
        center: [2897716, 9389901],
        zoom: 6
      })
    });
    this.map.once("postrender", () => {
      console.log("map is ready");
      this.isReady = true;
    });
    this.overlay = new Overlay({
      // @ts-ignore
      element: this.$refs.olpopup, // popup tag, in html
      autoPan: true, // If the pop-up window is at the edge of the base image, the base image will move
      autoPanAnimation: {
        // Basemap moving animation
        duration: 250
      }
    });
    this.map.addOverlay(this.overlay);
    this.map.on("singleclick", (evt) => {
      const coordinate = evt.coordinate; // get coordinates
      const hdms = toStringHDMS(toLonLat(coordinate)); // Convert coordinate format
      this.popupContent = hdms;
      setTimeout(() => {
        // Set the position of the pop-up window
        // Set the timer here, otherwise the pop-up window will appear for the first time, and the base map will be off-track
        if (this.overlay) {
          this.overlay.setPosition(coordinate);
        }
      }, 0);
    });
  }
});
</script>

<style scoped>
@import "~ol/ol.css";
#ol-map {
  height: 900px;
  width: 100%;
  z-index: 0;
}
/* Pop-up window style */
.olpopup {
  min-width: 280px;
  position: absolute;
  background: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transform: translate(-50%, calc(-100% - 12px));
}
/* The small triangle below the pop-up window */
.olpopup:after,
.olpopup:before {
  display: block;
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  border: 12px solid transparent;
  border-top-color: #fff;
  bottom: -23px;
  left: 50%;
  transform: translateX(-50%);
}
/* Close popup button */
.olpopup-closer {
  cursor: pointer;
  align-self: flex-end;
  margin-bottom: 10px;
}
.olpopup-content {
  color: blue;
}
</style>
