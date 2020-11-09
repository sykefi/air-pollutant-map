<template>
  <div></div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { all as allStrategy } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Style, Stroke } from "ol/style";
import { StyleFunction } from "ol/style/Style";
import Map from "ol/Map.js";
import * as styleUtils from "./../utils/pollutantStyles";
import * as pollutantService from "./../services/pollutants";
import { Pollutant, PollutantLegend, MapDataType } from "../types";
import { FeatureLike } from "ol/Feature";
import { Dispatch } from "@/store";
import * as constants from "./../constants";

const classCount = 7;

export default Vue.extend({
  props: {
    map: { type: Object as PropType<Map> },
    year: Number,
    gnfrId: String,
    pollutant: { type: Object as PropType<Pollutant> }
  },
  data() {
    return {
      layerSource: new VectorSource() as VectorSource,
      vectorLayer: new VectorLayer() as VectorLayer,
      colorFunction: undefined as Function | undefined,
      legend: undefined as PollutantLegend | undefined,
      densityProp: (this.pollutant.id + "-density") as string
    };
  },
  watch: {
    year: function (newVal) {
      console.log(`Year changed to ${newVal}, refreshing muni data...`);
      this.layerSource.refresh();
    },
    gnfrId: function (newVal: string) {
      console.log(`Gnfr changed to ${newVal}, refreshing muni data...`);
      this.layerSource.refresh();
    },
    pollutant: function (newVal: Pollutant) {
      console.log(`Pollutant changed to ${newVal.name["fi"]}, refreshing muni data...`);
      this.densityProp = newVal.id + "-density";
      this.colorFunction = undefined;
      this.layerSource.refresh();
    }
  },
  methods: {
    getOlStyle(): StyleFunction {
      return (feature: FeatureLike) =>
        new Style({
          fill: new Fill({
            color: this.colorFunction ? this.colorFunction(feature) : "rgba(255,255,255,0)"
          }),
          stroke: new Stroke({
            color: "black",
            width: 1
          })
        });
    },
    getMaxPollutionValue(): number {
      return Math.ceil(
        Math.max(...this.layerSource.getFeatures().map((feat) => feat.get(this.densityProp)))
      );
    },
    async updateStyle(maxPollutionValue: number): Promise<number[] | undefined> {
      if (styleUtils.hasBreakPoints(MapDataType.MUNICIPALITY, this.densityProp)) {
        const breakPoints = styleUtils.getBreakPoints(
          MapDataType.MUNICIPALITY,
          this.pollutant.id
        );
        this.colorFunction = styleUtils.getColorFunction(
          this.densityProp,
          breakPoints!,
          maxPollutionValue
        );
        return breakPoints;
      } else if (this.year === constants.latestYear && this.gnfrId === "COMBINED") {
        // current layer is combined pollutants and latest year, thus breakpoints can be calculated by it
        const latestValues = this.layerSource
          .getFeatures()
          .map((feat) => feat.get(this.densityProp));

        const breakPoints = styleUtils.getPollutantBreakPoints(
          MapDataType.MUNICIPALITY,
          this.pollutant.id,
          latestValues,
          classCount
        );
        this.colorFunction = styleUtils.getColorFunction(
          this.densityProp,
          breakPoints,
          maxPollutionValue
        );
        return breakPoints;
      } else {
        // combined pollutants from latest year need to be fetched for calculating breakpoints
        console.log(
          `Fetching features of ${constants.latestYear} and calculating breakpoints`
        );
        const fc = await pollutantService.fetchMuniFeatures(
          constants.latestYear,
          "COMBINED",
          this.pollutant.id,
          this.pollutant.coeffLegend
        );
        if (!fc) return;
        const latestValues = fc.features.map((feat) => feat.properties[this.densityProp]);
        const breakPoints = styleUtils.getPollutantBreakPoints(
          MapDataType.MUNICIPALITY,
          this.pollutant.id,
          latestValues,
          classCount
        );
        this.colorFunction = styleUtils.getColorFunction(
          this.densityProp,
          breakPoints,
          maxPollutionValue
        );
        // for some reason this async style update needs to be triggered manually
        this.vectorLayer.setStyle(this.getOlStyle());
        return breakPoints;
      }
    },
    updateLegend(breakPoints: number[], maxPollutionValue: number): void {
      // finally update legend to match the new style
      this.legend = styleUtils.getPollutantLegend(
        this.pollutant,
        breakPoints,
        maxPollutionValue
      );
      this.$emit("update-legend", this.legend);
    },
    async updateTotalPollutionStats(): Promise<void> {
      const totalPollutionStats = await pollutantService.getTotalPollutionStats(
        this.year,
        this.gnfrId,
        this.pollutant
      );
      this.$emit("update-total-pollution-stats", totalPollutionStats);
    },
    async setFeaturePopup(event): Promise<void> {
      const feats = await this.layerSource.getFeaturesAtCoordinate(event.coordinate);
      if (feats.length > 0) {
        this.$emit("set-muni-feature-popup", event.coordinate, feats[0].getProperties());
      } else {
        console.log("no features found on click -> cannot set popup");
      }
    },
    enableShowFeaturePopupOnClick(): void {
      this.map.on("singleclick", this.setFeaturePopup);
    },
    disableShowFeaturePopupOnClick(): void {
      this.map.un("singleclick", this.setFeaturePopup);
      this.$emit("set-muni-feature-popup", undefined, null);
    }
  },
  mounted() {
    console.log("mounting muni data:", this.pollutant.id, "of year", this.year);
    this.layerSource = new VectorSource({
      format: new GeoJSON(),
      loader: async () => {
        this.$emit("update-total-pollution-stats", undefined);
        this.$store.dispatch(Dispatch.setLoading);
        const fc = await pollutantService.fetchMuniFeatures(
          this.year,
          this.gnfrId,
          this.pollutant.id,
          this.pollutant.coeffLegend
        );
        if (!fc) return;
        this.layerSource.clear();
        this.layerSource.addFeatures(
          // @ts-ignore
          this.layerSource.getFormat().readFeatures(fc)
        );
        const maxPollutionValue = this.getMaxPollutionValue();
        const breakPoints = await this.updateStyle(maxPollutionValue);
        if (breakPoints) {
          this.updateLegend(breakPoints, maxPollutionValue);
          this.$store.dispatch(Dispatch.setLoaded);
        } else {
          console.error("Could not update style for the current layer");
        }
        this.updateTotalPollutionStats();
      },
      strategy: allStrategy
    });

    this.vectorLayer = new VectorLayer({
      source: this.layerSource,
      style: this.getOlStyle()
    });
    this.map.addLayer(this.vectorLayer);
    this.enableShowFeaturePopupOnClick();
  },
  destroyed() {
    console.log("Removing muni data layer from the map");
    this.$emit("update-legend", undefined);
    this.disableShowFeaturePopupOnClick();
    this.map.removeLayer(this.vectorLayer);
  }
});
</script>
