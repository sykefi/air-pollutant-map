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
import { getColorFunction } from "./../utils/PollutantStyles";
import { Pollutant } from "../types";

const outputFormat = "&outputFormat=application%2Fjson";
const typeName = (table: string): string => "&typeName=paastotkartalla%3A" + table;
const propFilter = (prop: string): string => "&propertyName=geom," + prop;
const cqlFilter = (vuosi: number): string => `&cql_filter=(vuosi=%27${vuosi.toString()}%27)`;

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
      colorFunction: undefined as Function | undefined
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
      this.colorFunction = getColorFunction(newVal.dbCol);
      this.layerSource.refresh();
    }
  },
  mounted() {
    const gsUri = process.env.VUE_APP_GEOSERVER_URI;
    console.log("Using geoserver at:", gsUri);
    console.log("mounting grid data:", this.pollutant.dbCol, "of year", this.year);

    this.layerSource = new VectorSource({
      format: new GeoJSON(),
      loader: () => {
        const url =
          gsUri +
          "ows?service=WFS&version=1.0.0&request=GetFeature" +
          typeName("p_gd_sample_2015_a") +
          propFilter(this.pollutant.dbCol) +
          outputFormat +
          cqlFilter(this.year);

        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        const onError = () => {
          console.log("error in wfs request");
        };
        xhr.onerror = onError;
        xhr.onload = () => {
          if (xhr.status == 200) {
            this.layerSource.clear();
            this.layerSource.addFeatures(
              // @ts-ignore
              this.layerSource.getFormat().readFeatures(xhr.responseText)
            );
          } else {
            onError();
          }
        };
        xhr.send();
      },
      strategy: allStrategy
    });

    this.colorFunction = getColorFunction(this.pollutant.dbCol);
    this.vectorLayer = new VectorLayer({
      source: this.layerSource,
      style: (feature) => {
        return new Style({
          fill: new Fill({
            color: this.colorFunction ? this.colorFunction(feature) : "grey"
          })
        });
      }
    });
    this.map.addLayer(this.vectorLayer);
  }
});
</script>
