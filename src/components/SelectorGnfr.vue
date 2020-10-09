<template>
  <div class="select-wrapper">
    <CustomDropdownSelector
      v-if="options && initialOption"
      uniqueSelectorId="gnfr"
      :selectorLabel="'selector.gnfr.label' | translate"
      :options="options"
      :initialOption="initialOption"
      @selected-option="(gnfr) => $emit('selected-gnfr', gnfr.value)"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Option } from "./../types";
import { fetchGnfrMeta } from "@/services/meta";
import CustomDropdownSelector from "./CustomDropdownSelector.vue";

export default Vue.extend({
  components: {
    CustomDropdownSelector
  },
  data() {
    return {
      options: undefined as Option[] | undefined,
      initialOption: undefined as Option | undefined
    };
  },
  methods: {
    async loadGnfrOptions() {
      const gnfrOptions = await fetchGnfrMeta();
      this.options = gnfrOptions.map((gnfr) => {
        return {
          id: gnfr.id,
          label: gnfr.name,
          value: gnfr,
          showFirst: gnfr.id === "COMBINED"
        } as Option;
      });
      this.initialOption = this.options.find((o) => o.id === "COMBINED");
    }
  },
  mounted() {
    this.loadGnfrOptions();
  },
  destroyed() {
    this.$emit("selected-gnfr", undefined);
  }
});
</script>

<style scoped>
.select-wrapper {
  max-width: 250px;
}
</style>
