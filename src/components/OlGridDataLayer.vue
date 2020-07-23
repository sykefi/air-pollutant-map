<template>
  <div></div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import { Vector as VectorLayer } from "ol/layer";
import { Extent } from "ol/extent";
import VectorSource from "ol/source/Vector";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Style } from "ol/style";
import Projection from "ol/proj/Projection";
import Map from "ol/Map.js";
import { getColorFunction } from "./PollutantStyles";

const outputFormat = "&outputFormat=application%2Fjson";
const typeName = (table: string): string => "&typeName=paastotkartalla%3A" + table;
const propFilter = (prop: string): string => "&propertyName=geom," + prop;
const cqlFilter = (extent: Extent, projection: Projection, vuosi: number) => {
  return `&cql_filter=(bbox(geom,${extent.join(",")},%27EPSG:${projection.getCode()}%27)and
  (vuosi=%27 ${vuosi.toString()}%27))`;
};

export default Vue.extend({
  props: {
    map: Map,
    year: Number,
    pollutant: String,
  },
  mounted() {
    const gsUri = process.env.VUE_APP_GEOSERVER_URI;
    console.log("Using geoserver at:", gsUri);
    console.log("initializing grid data layer of pollutant", this.pollutant,"and year",this.year);

    const pollutantSampleSource = new VectorSource({
      format: new GeoJSON(),
      loader: (extent: Extent, resolution: number, projection: Projection) => {
        const url =
          gsUri +
          "ows?service=WFS&version=1.0.0&request=GetFeature" +
          typeName("p_gd_sample_2015_a") +
          propFilter(this.pollutant) +
          outputFormat +
          cqlFilter(extent, projection, this.year);
        
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        const onError = () => {
          // pollutantSampleSource.removeLoadedExtent(extent);
          console.log("error in wfs request");
        };
        xhr.onerror = onError;
        xhr.onload = () => {
          if (xhr.status == 200) {
            pollutantSampleSource.clear();
            pollutantSampleSource.addFeatures(
              // @ts-ignore
              pollutantSampleSource.getFormat().readFeatures(xhr.responseText)
            );
          } else {
            onError();
          }
        };
        xhr.send();
      },
      strategy: bboxStrategy,
    });

    const colorFunction = getColorFunction(this.pollutant);
    const pollutantVector = new VectorLayer({
      source: pollutantSampleSource,
      style: (feature) => {
        return new Style({
          fill: new Fill({
            color: colorFunction ? colorFunction(feature) : "grey",
          }),
        });
      },
    });
    this.map.addLayer(pollutantVector);
  },
});
</script>