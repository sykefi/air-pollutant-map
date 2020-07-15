<template>
  <div id="olMap">
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import Map from 'ol/Map.js';
  import View from 'ol/View.js';
  import OSM from 'ol/source/OSM';
  import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
  import { FeatureLike } from 'ol/Feature';
  import { Extent } from 'ol/extent';
  import VectorSource from 'ol/source/Vector';
  import {bbox as bboxStrategy} from 'ol/loadingstrategy';
  import GeoJSON from 'ol/format/GeoJSON';
  import {Fill, Style} from 'ol/style'; 
  import Projection from 'ol/proj/Projection';

  // const gsUri = 'http://kkxgsmapt2:8080/geoserver/paastotkartalla/'¨

  const gsUri = process.env.VUE_APP_GEOSERVER_URI;
  console.log('Using geoserver at:', gsUri);

  const getColor = (feature: FeatureLike) => {
    const pollutantValue = feature.get('s16');
    return pollutantValue < 0.01 ? 'rgba(89, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)';
  }

  @Component
  export default class OlMap extends Vue {
    mounted() {

      const pollutantSampleSource = new VectorSource({
        format: new GeoJSON(),
        loader: (extent: Extent, resolution: number, projection: Projection) => {
          const proj = projection.getCode()
          const url = gsUri +
              'ows?service=WFS&version=1.0.0&request=GetFeature&typeName=paastotkartalla%3Ap_gd_sample_2015_a&' +
              'outputFormat=application%2Fjson&' +
              'bbox=' + extent.join(',') + ',' + proj;
          const xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          const onError = () => {
            pollutantSampleSource.removeLoadedExtent(extent);
          }
          xhr.onerror = onError;
          xhr.onload = () => {
            if (xhr.status == 200) {
              pollutantSampleSource.clear()
              pollutantSampleSource.addFeatures(
                // @ts-ignore
                pollutantSampleSource.getFormat().readFeatures(xhr.responseText));
            } else {
              onError();
            }
          }
          xhr.send();
        },
        strategy: bboxStrategy
      });

      const pollutantVector = new VectorLayer({
        source: pollutantSampleSource,
        style: (feature) => {
          return new Style({
          fill: new Fill({
            color: getColor(feature)
            })
          });
        }
      });

      const map = new Map({
        target: 'olMap',
        layers: [
          new TileLayer({source: new OSM()}), pollutantVector
        ],
        view: new View({
          projection: 'EPSG:4326',
          center: [24.56, 61.24],
          zoom: 8
        })
      })
    console.log(map);
    }
  }
</script>

<style scoped>
  @import "~ol/ol.css";
  #olMap {
    height: 400px;
    width: 600px;
  }
</style>