<template>
  <div></div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import { PropType } from "vue";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { all as allStrategy } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Style } from "ol/style";
import Map from "ol/Map.js";
import * as styleUtils from "./../utils/pollutantStyles";
import * as pollutantService from "./../services/pollutants";
import { Pollutant, PollutantLegend, Gnfr, MapDataType } from "../types";
import { FeatureLike } from "ol/Feature";
import * as constants from "./../constants";

const classCount = 7;

export default Vue.extend({
  props: {
    map: { type: Object as PropType<Map> },
    year: Number,
    pollutant: { type: Object as PropType<Pollutant> },
    gnfr: String
  },
  data() {
    return {
      layerSource: new VectorSource() as VectorSource,
      vectorLayer: new VectorLayer() as VectorLayer,
      colorFunction: undefined as Function | undefined,
      legend: undefined as PollutantLegend | undefined,
      cache: {} as { [key: string]: string }
    };
  },
  watch: {
    year: function (newVal) {
      console.log(`Year changed to ${newVal}, refreshing grid data...`);
      this.layerSource.refresh();
    },
    gnfr: function (newVal: Gnfr) {
      console.log(`Gnfr changed to ${newVal}, refreshing grid data...`);
      this.layerSource.refresh();
    },
    pollutant: function (newVal: Pollutant) {
      console.log(`Pollutant changed to ${newVal.parlocRyhmaSelite}, refreshing grid data...`);
      this.colorFunction = undefined;
      this.layerSource.refresh();
    }
  },
  methods: {
    getOlStyle(debugMsg?: string) {
      console.log(`Getting OL style (${debugMsg})`);
      return (feature: FeatureLike) =>
        new Style({
          fill: new Fill({
            color: this.colorFunction ? this.colorFunction(feature) : "rgba(255,255,255,0)"
          })
        });
    },
    async updateStyle() {
      console.log(
        `Has breakpoints (${this.pollutant.dbCol})? ${styleUtils.hasBreakPoints(
          MapDataType.GRID,
          this.pollutant.dbCol
        )}`
      );
      const maxValue = Math.ceil(
        Math.max(
          ...this.layerSource.getFeatures().map((feat) => feat.get(this.pollutant.dbCol))
        )
      );
      console.log("Found max value for the layer", maxValue);

      if (!styleUtils.hasBreakPoints(MapDataType.GRID, this.pollutant.dbCol)) {
        if (this.gnfr === "COMBINED" && this.year === constants.latestYear) {
          // current layer is combined pollutants and latest year, thus breakpoints can be calculated by it
          console.log(
            `Calculating breakpoints from visible features (${constants.latestYear})`
          );
          const latestValues = this.layerSource
            .getFeatures()
            .map((feat) => feat.get(this.pollutant.dbCol));
          styleUtils.setPollutantBreakPoints(
            MapDataType.GRID,
            this.pollutant.dbCol,
            latestValues,
            classCount
          );
          this.colorFunction = styleUtils.getColorFunction(
            MapDataType.GRID,
            this.pollutant.dbCol,
            maxValue
          );
        } else {
          // combined pollutants from latest year need to be fetched for calculating breakpoints
          console.log(
            `Fetching features of ${constants.latestYear} and calculating breakpoints`
          );
          const fc = await pollutantService.fetchFeatures(
            constants.latestYear,
            "COMBINED",
            this.pollutant
          );
          const latestValues = fc.features.map(
            (feat) => feat.properties[this.pollutant.dbCol]
          );
          styleUtils.setPollutantBreakPoints(
            MapDataType.GRID,
            this.pollutant.dbCol,
            latestValues,
            classCount
          );
          this.colorFunction = styleUtils.getColorFunction(
            MapDataType.GRID,
            this.pollutant.dbCol,
            maxValue
          );
          // for some reason this async style update needs to be triggered manually
          this.vectorLayer.setStyle(this.getOlStyle("update"));
        }
      } else {
        this.colorFunction = styleUtils.getColorFunction(
          MapDataType.GRID,
          this.pollutant.dbCol,
          maxValue
        );
        console.log(`Updated to use previously created style function`);
      }
      // finally update legend to match the new style
      this.legend = styleUtils.getPollutantLegendObject(
        MapDataType.GRID,
        this.pollutant,
        this.pollutant.dbCol,
        maxValue
      );
      this.$emit("update-legend", this.legend);
    },
    async setFeaturePopup(event) {
      const feats = await this.layerSource.getFeaturesAtCoordinate(event.coordinate);
      if (feats.length > 0) {
        this.$emit(
          "set-grid-feature-popup",
          event.coordinate,
          feats[0].getProperties()[this.pollutant.dbCol]
        );
      } else {
        console.log("no features found on click -> cannot set popup");
      }
    },
    enableShowFeaturePopupOnClick() {
      this.map.on("singleclick", this.setFeaturePopup);
    },
    disableShowFeaturePopupOnClick() {
      this.map.un("singleclick", this.setFeaturePopup);
      this.$emit("set-grid-feature-popup", undefined, null);
    }
  },
  mounted() {
    console.log("mounting grid data:", this.pollutant.dbCol, "of year", this.year);
    this.layerSource = new VectorSource({
      format: new GeoJSON(),
      loader: async () => {
        const fc = await pollutantService.fetchFeatures(this.year, this.gnfr, this.pollutant);
        this.layerSource.clear();
        this.layerSource.addFeatures(
          // @ts-ignore
          this.layerSource.getFormat().readFeatures(fc)
        );
        this.updateStyle();
      },
      strategy: allStrategy
    });

    this.vectorLayer = new VectorLayer({
      source: this.layerSource,
      style: this.getOlStyle("initial")
    });
    this.map.addLayer(this.vectorLayer);
    this.enableShowFeaturePopupOnClick();
  },
  destroyed() {
    console.log("Removing grid data layer from the map");
    this.$emit("update-legend", undefined);
    this.disableShowFeaturePopupOnClick();
    this.map.removeLayer(this.vectorLayer);
  }
});
</script>
