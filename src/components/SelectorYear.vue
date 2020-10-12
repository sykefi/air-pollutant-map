<template>
  <div class="select-wrapper">
    <CustomDropdownSelector
      v-if="options && initialOption"
      uniqueSelectorId="year"
      :selectorLabel="'selector.vuosi.label' | translate"
      :options="options"
      :initialOption="initialOption"
      @selected-option="(year) => $emit('selected-year', year.value)"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Option } from "@/types";
import CustomDropdownSelector from "./CustomDropdownSelector.vue";
import { yearOptions, initialYear } from "@/constants";

export default Vue.extend({
  components: {
    CustomDropdownSelector
  },
  data() {
    return {
      years: yearOptions as number[],
      options: null as Option[] | null,
      initialOption: undefined as Option | undefined
    };
  },
  methods: {
    loadOptions() {
      this.options = this.years.map((year) => {
        const sYear = year.toString();
        return {
          id: sYear,
          label: { fi: sYear, sv: sYear, en: sYear },
          value: year,
          showFirst: false
        } as Option;
      });
      this.initialOption = this.options.find((o) => o.value === initialYear);
    }
  },
  mounted() {
    this.loadOptions();
  },
  destroyed() {
    this.$emit("selected-year", initialYear);
  }
});
</script>

<style scoped>
.select-wrapper {
  width: 101px;
}
</style>
