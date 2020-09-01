<template>
  <div class="olpopup-container">
    <div class="olpopup-closer" @click="closePopup">✖</div>
    <div class="olpopup-content">
      <div class="olpopup-title">{{ pollutant.name[lang] }} ({{ pollutant.unit }}):</div>
      <div class="olpopup-value">
        <span class="olpopup-value">{{
          popupValue ? roundPollutantValue(popupValue) : 0
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Pollutant } from "@/types";
import { mapState } from "vuex";

export default Vue.extend({
  props: {
    pollutant: { type: Object as PropType<Pollutant> },
    popupValue: Number
  },
  computed: mapState(["lang"]),
  methods: {
    closePopup() {
      this.$emit("close-popup");
    },
    roundPollutantValue(n: number) {
      // rounds value to at least two significant figures
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
  padding: 3px 22px 2px 3px;
  color: black;
  font-weight: 550;
}
.olpopup-title {
  margin-bottom: 4px;
}
.olpopup-value {
  font-weight: 500;
  color: #007ac9;
}
</style>
