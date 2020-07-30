<template>
  <div id="legend-box">
    <div id="legend-title">Päästömäärä ({{ legend.unit }})</div>
    <div class="legend-class-row" v-for="className in legend.classNames" :key="className">
      <div
        class="legend-color-box"
        v-bind:style="{ backgroundColor: legend[className].color }"
      />
      <div>{{ legend[className].min }} - {{ legend[className].max }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { PollutantLegend } from "./../utils/PollutantStyles";

export default {
  props: {
    legend: { type: Object as PropType<PollutantLegend> }
  }
};
</script>

<style scoped>
#legend-box {
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.97);
  padding: 11px 10px 11px 10px;
  font-size: 0.9em;
  box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.07);
}
#legend-title {
  margin: 0 0 5px 0;
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
  border: 1px solid grey;
  border-radius: 2px;
}
</style>
