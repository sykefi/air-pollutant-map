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
    getOlStyle(debugMsg?: string) {
      console.log(`Getting OL style (${debugMsg})`);
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
    async updateStyle() {
      console.log("Updating style with density prop:", this.densityProp);
      console.log(
        `Has breakpoints (${this.densityProp})? ${styleUtils.hasBreakPoints(
          MapDataType.MUNICIPALITY,
          this.densityProp
        )}`
      );
      const maxValue = Math.ceil(
        Math.max(...this.layerSource.getFeatures().map((feat) => feat.get(this.densityProp)))
      );
      console.log("Found max value for the layer", maxValue);

      if (!styleUtils.hasBreakPoints(MapDataType.MUNICIPALITY, this.densityProp)) {
        if (this.year === constants.latestYear && this.gnfrId === "COMBINED") {
          // current layer is combined pollutants and latest year, thus breakpoints can be calculated by it
          console.log(
            `Calculating breakpoints from visible features (combined ${constants.latestYear})`
          );
          const latestValues = this.layerSource
            .getFeatures()
            .map((feat) => feat.get(this.densityProp));
          styleUtils.setPollutantBreakPoints(
            MapDataType.MUNICIPALITY,
            this.densityProp,
            latestValues,
            classCount
          );
          this.colorFunction = styleUtils.getColorFunction(
            MapDataType.MUNICIPALITY,
            this.densityProp,
            maxValue
          );
        } else {
          // combined pollutants from latest year need to be fetched for calculating breakpoints
          console.log(
            `Fetching features of ${constants.latestYear} and calculating breakpoints`
          );
          const fc = await pollutantService.fetchMuniFeatures(
            constants.latestYear,
            "COMBINED",
            this.pollutant
          );
          const latestValues = fc.features.map((feat) => feat.properties[this.densityProp]);
          styleUtils.setPollutantBreakPoints(
            MapDataType.MUNICIPALITY,
            this.densityProp,
            latestValues,
            classCount
          );
          this.colorFunction = styleUtils.getColorFunction(
            MapDataType.MUNICIPALITY,
            this.densityProp,
            maxValue
          );
          // for some reason this async style update needs to be triggered manually
          this.vectorLayer.setStyle(this.getOlStyle("update"));
        }
      } else {
        this.colorFunction = styleUtils.getColorFunction(
          MapDataType.MUNICIPALITY,
          this.densityProp,
          maxValue
        );
        console.log(`Updated to use previously created style function`);
      }
      // finally update legend to match the new style
      this.legend = styleUtils.getPollutantLegendObject(
        MapDataType.MUNICIPALITY,
        this.pollutant,
        this.densityProp,
        maxValue
      );
      this.$emit("update-legend", this.legend);
    },
    async setFeaturePopup(event) {
      const feats = await this.layerSource.getFeaturesAtCoordinate(event.coordinate);
      if (feats.length > 0) {
        this.$emit("set-muni-feature-popup", event.coordinate, feats[0].getProperties());
      } else {
        console.log("no features found on click -> cannot set popup");
      }
    },
    enableShowFeaturePopupOnClick() {
      this.map.on("singleclick", this.setFeaturePopup);
    },
    disableShowFeaturePopupOnClick() {
      this.map.un("singleclick", this.setFeaturePopup);
      this.$emit("set-muni-feature-popup", undefined, null);
    }
  },
  mounted() {
    console.log("mounting muni data:", this.pollutant.id, "of year", this.year);
    this.layerSource = new VectorSource({
      format: new GeoJSON(),
      loader: async () => {
        this.$store.dispatch(Dispatch.setLoading);
        const fc = await pollutantService.fetchMuniFeatures(
          this.year,
          this.gnfrId,
          this.pollutant
        );
        this.layerSource.clear();
        this.layerSource.addFeatures(
          // @ts-ignore
          this.layerSource.getFormat().readFeatures(fc)
        );
        this.updateStyle();
        this.$store.dispatch(Dispatch.setLoaded);
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
    console.log("Removing muni data layer from the map");
    this.$emit("update-legend", undefined);
    this.disableShowFeaturePopupOnClick();
    this.map.removeLayer(this.vectorLayer);
  }
});
</script>
