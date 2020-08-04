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
import { Pollutant, PollutantLegend } from "../types";
import { FeatureLike } from "ol/Feature";

const gsUri = process.env.VUE_APP_GEOSERVER_URI;
const gridDataTable = "p_gd_sample_2015_a";
const latestYear = 2018;
const classCount = 7;

export default Vue.extend({
  props: {
    map: { type: Object as PropType<Map> },
    year: Number,
    pollutant: { type: Object as PropType<Pollutant> }
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
    year: function (newVal, oldVal) {
      console.log(`Year changed to ${newVal} (from ${oldVal}) - refreshing grid data...`);
      this.layerSource.refresh();
    },
    pollutant: function (newVal: Pollutant, oldVal: Pollutant) {
      console.log(
        `Pollutant changed to ${newVal.parlocRyhmaSelite} (from ${oldVal.parlocRyhmaSelite}) - refreshing grid data...`
      );
      this.colorFunction = undefined;
      this.layerSource.refresh();
    }
  },
  methods: {
    getLoaderUrl(dbCol: string, year: number): string {
      const outputFormat = "&outputFormat=application%2Fjson";
      return `${gsUri}ows?service=WFS&version=1.0.0&request=GetFeature
        &typeName=paastotkartalla%3A${gridDataTable}&propertyName=geom,${dbCol}
        ${outputFormat}&cql_filter=(vuosi=%27${year}%27)`;
    },
    getOlStyle(debugMsg?: string) {
      console.log(`Getting OL style (${debugMsg})`);
      return (feature: FeatureLike) =>
        new Style({
          fill: new Fill({
            color: this.colorFunction ? this.colorFunction(feature) : "rgba(255,255,255,0)"
          })
        });
    },
    async updateStyle(pollutant: Pollutant) {
      console.log(
        `Has breakpoints (${pollutant.dbCol})? ${styleUtils.hasBreakPoints(pollutant)}`
      );
      const maxValue = Math.ceil(
        Math.max(
          ...this.layerSource.getFeatures().map((feat) => feat.get(this.pollutant.dbCol))
        )
      );
      console.log("Found max value for the layer", maxValue);

      if (!styleUtils.hasBreakPoints(pollutant)) {
        // current layer is latest year, thus breakpoints can be calculated by it
        if (this.year === latestYear) {
          console.log(`Calculating breakpoints from visible features (${latestYear})`);
          const latestValues = this.layerSource
            .getFeatures()
            .map((feat) => feat.get(this.pollutant.dbCol));
          styleUtils.setPollutantBreakPoints(pollutant, latestValues, classCount);
          this.colorFunction = styleUtils.getColorFunction(pollutant, maxValue);
        } else {
          // latest year needs to be fetched for pollutant for calculating breakpoints
          console.log(`Fetching features of ${latestYear} and calculating breakpoints`);
          const uri = this.getLoaderUrl(pollutant.dbCol, latestYear);
          const latestFeatures = await fetch(uri);
          const response = await latestFeatures.json();
          this.cache[uri] = response;
          const latestValues = response.features.map(
            (feat) => feat.properties[pollutant.dbCol]
          );
          styleUtils.setPollutantBreakPoints(pollutant, latestValues, classCount);
          this.colorFunction = styleUtils.getColorFunction(pollutant, maxValue);
          // for some reason this async style update needs to be triggered manually
          this.vectorLayer.setStyle(this.getOlStyle("update"));
        }
      } else {
        this.colorFunction = styleUtils.getColorFunction(pollutant, maxValue);
        console.log(`Updated to use previously created style function`);
      }
      // finally update legend to match the new style
      this.legend = styleUtils.getPollutantLegendObject(pollutant, maxValue);
      this.$emit("update-legend", this.legend);
    }
  },
  mounted() {
    console.log("Using geoserver at:", gsUri);
    console.log("mounting grid data:", this.pollutant.dbCol, "of year", this.year);

    this.layerSource = new VectorSource({
      format: new GeoJSON(),
      loader: () => {
        const uri = this.getLoaderUrl(this.pollutant.dbCol, this.year);
        if (uri in this.cache) {
          console.log("Reading grid data from cache");
          this.layerSource.clear();
          this.layerSource.addFeatures(
            // @ts-ignore
            this.layerSource.getFormat().readFeatures(this.cache[uri])
          );
          this.updateStyle(this.pollutant);
        } else {
          console.log("Fetching grid data from WFS");
          const xhr = new XMLHttpRequest();
          xhr.open("GET", uri);
          const onError = () => {
            console.log("error in wfs request");
          };
          xhr.onerror = onError;
          xhr.onload = () => {
            console.log("Fetched features for pollutant", this.pollutant.dbCol);
            if (xhr.status == 200) {
              this.layerSource.clear();
              this.layerSource.addFeatures(
                // @ts-ignore
                this.layerSource.getFormat().readFeatures(xhr.responseText)
              );
              this.updateStyle(this.pollutant);
              this.cache[uri] = xhr.responseText;
            } else {
              onError();
            }
          };
          xhr.send();
        }
      },
      strategy: allStrategy
    });

    this.vectorLayer = new VectorLayer({
      source: this.layerSource,
      style: this.getOlStyle("initial")
    });
    this.map.addLayer(this.vectorLayer);
  }
});
</script>
