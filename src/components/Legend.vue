<template>
  <div>
    <div id="legend-box">
      <div id="legend-title">
        {{ "map.legend.title-without-unit" | translate }}
        <span v-if="mapDataType === mapDataTypes.MUNICIPALITY">
          ({{ legend.unit }} / km<sup>2</sup>)
        </span>
        <span v-else> ({{ legend.unit }})</span>
      </div>
      <div class="legend-class-row" v-for="className in legend.classNames" :key="className">
        <div
          class="legend-color-box"
          v-bind:style="{ backgroundColor: legend[className].color }"
        />
        <div>{{ legend[className].min }} - {{ legend[className].max }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { PollutantLegend, MapDataType } from "./../types";

export default {
  props: {
    legend: { type: Object as PropType<PollutantLegend> },
    mapDataType: { type: String as PropType<MapDataType> }
  },
  data() {
    return {
      mapDataTypes: Object(MapDataType)
    };
  }
};
</script>

<style scoped>
#legend-box {
  border-radius: 5px;
  background-color: rgb(0 0 0 / 70%);
  color: white;
  padding: 11px 10px 11px 10px;
  font-size: 0.9em;
  box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.07);
}
#legend-title {
  margin: 0 0 8px 0;
  font-weight: 550;
}
.legend-class-row {
  margin: 5px 0 0 0;
  display: flex;
  align-content: center;
  justify-content: flex-start;
}
.legend-color-box {
  width: 15px;
  height: 15px;
  margin: 0 5px 0 5px;
  /* box-shadow: 1px 1px 0 1px rgba(0, 0, 0, 0.1); */
  border: 1px solid #ffffffad;
  border-radius: 2px;
}
</style>
