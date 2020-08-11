<template>
  <div class="olpopup-container">
    <div class="olpopup-closer" @click="closePopup">✖</div>
    <div class="olpopup-content">
      {{ roundPollutantValue(popupValue) }} {{ pollutant.yksikko }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Pollutant } from "@/types";

export default Vue.extend({
  props: {
    pollutant: { type: Object as PropType<Pollutant> },
    popupValue: Number
  },
  methods: {
    closePopup() {
      this.$emit("close-popup");
    },
    roundPollutantValue(n: number) {
      // round breakpoint values to at least two significant figures
      for (let i = 10; i < Math.pow(10, 10); i = i * 10) {
        const divider = 10 / i;
        if (n > divider) {
          return Math.round(n * i) / i;
        }
      }
      return n;
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
  padding: 3px 22px 3px 3px;
  color: black;
  font-weight: 550;
}
</style>
