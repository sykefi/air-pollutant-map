<template>
  <div>
    <div id="ol-map">
      <OlMuniBasemapLayer
        v-if="isReady"
        :visible="mapDataType === mapDataTypes.GRID"
        :map="map"
      />
      <OlGridDataLayer
        v-if="gnfrId && pollutant && isReady && mapDataType === mapDataTypes.GRID"
        :year="year"
        :gnfrId="gnfrId"
        :pollutant="pollutant"
        :map="map"
        @update-legend="updateLegend"
        @set-grid-feature-popup="setGridFeaturePopup"
        @update-total-pollution-stats="(tps) => $emit('update-total-pollution-stats', tps)"
      />
      <OlMuniDataLayer
        v-if="pollutant && isReady && mapDataType === mapDataTypes.MUNICIPALITY"
        :year="year"
        :gnfrId="gnfrId"
        :pollutant="pollutant"
        :map="map"
        @update-legend="updateLegend"
        @set-muni-feature-popup="setMuniFeaturePopup"
        @update-total-pollution-stats="(tps) => $emit('update-total-pollution-stats', tps)"
      />
    </div>
    <Legend id="map-legend-container" :legend="legend" :mapDataType="mapDataType" />
    <div class="olpopup" ref="olpopup" v-show="gridPopupValue || muniPopupFeat">
      <GridFeaturePopup
        v-if="gridPopupValue"
        :popupValue="gridPopupValue"
        :pollutant="pollutant"
        @close-popup="closePopup"
      />
      <MuniFeaturePopup
        v-if="muniPopupFeat"
        :featProps="muniPopupFeat"
        :pollutant="pollutant"
        @close-popup="closePopup"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Overlay from "ol/Overlay";
import { Coordinate } from "ol/coordinate";
import OlGridDataLayer from "./OlGridDataLayer.vue";
import OlMuniDataLayer from "./OlMuniDataLayer.vue";
import OlMuniBasemapLayer from "./OlMuniBasemapLayer.vue";
import GridFeaturePopup from "./GridFeaturePopup.vue";
import MuniFeaturePopup from "./MuniFeaturePopup.vue";
import Legend from "./Legend.vue";
import { Pollutant, MapDataType, MuniFeatureProperties } from "@/types";
import { PollutantLegend } from "../types";
import Projection from "ol/proj/Projection";

const projection = new Projection({
  code: "EPSG:3067",
  extent: [50199.4814, 6582464.0358, 761274.6247, 7799839.8902],
  global: false,
  metersPerUnit: 1
});

export default Vue.extend({
  components: {
    OlGridDataLayer,
    OlMuniDataLayer,
    OlMuniBasemapLayer,
    GridFeaturePopup,
    MuniFeaturePopup,
    Legend
  },
  props: {
    year: Number,
    gnfrId: String,
    pollutant: { type: Object as PropType<Pollutant | undefined> },
    mapDataType: { type: String as PropType<MapDataType> }
  },
  data() {
    return {
      map: undefined as Map | undefined,
      isReady: false as boolean,
      mapDataTypes: Object(MapDataType),
      overlay: null as Overlay | null,
      gridPopupValue: null as number | null,
      muniPopupFeat: null as MuniFeatureProperties | null,
      legend: undefined as PollutantLegend | undefined
    };
  },
  watch: {
    year: function () {
      this.closePopup();
    },
    gnfrId: function () {
      this.closePopup();
    },
    pollutant: function () {
      this.closePopup();
    }
  },
  methods: {
    updateLegend(legend: PollutantLegend) {
      this.legend = legend;
    },
    initializePopup() {
      this.overlay = new Overlay({
        // @ts-ignore
        element: this.$refs.olpopup, // popup tag, in html
        autoPan: true, // If the pop-up window is at the edge of the base image, the base image will move
        autoPanAnimation: {
          // Basemap moving animation
          duration: 250
        }
      });
      if (this.map) {
        this.map.addOverlay(this.overlay);
      }
    },
    setGridFeaturePopup(coordinate: Coordinate, value: number) {
      this.gridPopupValue = value;
      setTimeout(() => {
        // Set the timer here, otherwise the pop-up window will appear for the first time, and the base map will be off-track
        if (this.overlay) {
          this.overlay.setPosition(coordinate);
        }
      }, 0);
    },
    setMuniFeaturePopup(coordinate: Coordinate, value: MuniFeatureProperties) {
      this.muniPopupFeat = value;
      setTimeout(() => {
        if (this.overlay) {
          this.overlay.setPosition(coordinate);
        }
      }, 0);
    },
    closePopup() {
      // Set the position of the pop-up window to undefined, and clear the coordinate data
      if (this.overlay) {
        this.overlay.setPosition(undefined);
      }
      this.gridPopupValue = null;
      this.muniPopupFeat = null;
    }
  },
  mounted() {
    this.map = new Map({
      target: "ol-map",
      layers: [],
      view: new View({
        projection,
        center: [435385.0836878328, 7247696.528687431],
        zoom: 1.54
      })
    });
    this.map.once("postrender", () => {
      this.isReady = true;
    });
    this.initializePopup();
    console.log("map", this.map);
  }
});
</script>

<style scoped>
@import "~ol/ol.css";
#ol-map {
  height: calc(100vh - 260px);
  width: 100%;
  background-color: #fbfbfb;
  z-index: 0;
}
@media (max-height: 900px) {
  #ol-map {
    height: 70vh;
  }
}
#map-legend-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}
/* Pop-up window style */
.olpopup {
  min-width: max-content;
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
</style>
