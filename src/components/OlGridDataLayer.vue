<template>
  <div></div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import { Vector as VectorLayer } from "ol/layer";
import { FeatureLike } from "ol/Feature";
import { Extent } from "ol/extent";
import VectorSource from "ol/source/Vector";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Style } from "ol/style";
import Projection from "ol/proj/Projection";
import Map from "ol/Map.js";

const gsUri = process.env.VUE_APP_GEOSERVER_URI;
console.log("Using geoserver at:", gsUri);

const outputFormat = "&outputFormat=application%2Fjson"
const typeName = (table: string): string => '&typeName=paastotkartalla%3A'+ table
const propFilter = (prop: string): string =>  '&propertyName=geom,'+ prop
const cqlFilter = (extent: Extent, projection: Projection, vuosi: number) => {
  return '&cql_filter='+ 
  '(bbox(geom,' + extent.join(",") + ',%27EPSG:'+ projection.getCode() +'%27)'+'and'+
  '(vuosi=%27'+ vuosi.toString()+ '%27)'+')'
}

const getColor = (feature: FeatureLike) => {
  const value = feature.get("s16");
  if (value < 0.01) return "#fef0d9"
  if (value < 0.03) return "#fdcc8a"
  if (value < 0.07) return "#fc8d59"
  if (value < 5) return "#e34a33"
  if (value < 2576) return "#b30000"
  return 'grey'
};

export default Vue.extend({
  props: {
    map: Map
  },
  mounted() {
    const pollutantSampleSource = new VectorSource({
      format: new GeoJSON(),
      loader: (extent: Extent, resolution: number, projection: Projection) => {
        const url =
          gsUri + "ows?service=WFS&version=1.0.0&request=GetFeature" +
          typeName('p_gd_sample_2015_a') + propFilter('s16') + outputFormat + cqlFilter(extent, projection, 2015);
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        const onError = () => {
          pollutantSampleSource.removeLoadedExtent(extent);
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
      strategy: bboxStrategy
    });

    const pollutantVector = new VectorLayer({
      source: pollutantSampleSource,
      style: feature => {
        return new Style({
          fill: new Fill({
            color: getColor(feature)
          })
        });
      }
    });
    this.map.addLayer(pollutantVector);
  }
});
</script>