<template>
  <div class="olpopup-container">
    <div class="olpopup-closer" @click="closePopup">✖</div>
    <div class="olpopup-content">POPUP TEXT</div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PollutantLegend } from "@/types";
export default Vue.extend({
  props: {
    legend: { type: Object as PropType<PollutantLegend> }
  },
  methods: {
    closePopup() {
      this.$emit("close-popup");
    }
  }
});
</script>

<style scoped>
/* Close popup button */
.olpopup-closer {
  position: absolute;
  right: 11px;
  top: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}
.olpopup-content {
  color: blue;
}
</style>
