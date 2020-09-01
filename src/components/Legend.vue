<template>
  <div>
    <div v-if="!loading && legend" class="legend-box legend-container">
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
    <div v-else class="legend-box loading-wrapper">
      <LoadingAnimation />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { mapState } from "vuex";
import { PollutantLegend, MapDataType } from "./../types";
import LoadingAnimation from "./LoadingAnimation.vue";

export default {
  components: {
    LoadingAnimation
  },
  props: {
    legend: { type: Object as PropType<PollutantLegend> },
    mapDataType: { type: String as PropType<MapDataType> }
  },
  computed: mapState(["loading"]),
  data() {
    return {
      mapDataTypes: Object(MapDataType)
    };
  }
};
</script>

<style scoped>
.legend-box {
  border-radius: 5px;
  background-color: rgb(0 0 0 / 70%);
  color: white;
  font-size: 0.9em;
  box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.07);
}
.legend-container {
  padding: 11px 10px 11px 10px;
}
.loading-wrapper {
  padding: 10px;
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
