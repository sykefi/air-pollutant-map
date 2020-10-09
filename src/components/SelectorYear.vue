<template>
  <div class="select-wrapper">
    <CustomDropdownSelector
      v-if="yearOptions"
      uniqueSelectorId="year"
      :selectorLabel="'selector.vuosi.label' | translate"
      :options="yearOptions"
      :initialOption="yearOptions[yearOptions.length - 1]"
      @selected-option="(year) => $emit('selected-year', year.value)"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Option } from "@/types";
import CustomDropdownSelector from "./CustomDropdownSelector.vue";
import { initialYear } from "@/constants";

export default Vue.extend({
  components: {
    CustomDropdownSelector
  },
  data() {
    return {
      years: [1990, 1995, 2000, 2005, 2010, 2015, 2018] as number[],
      yearOptions: null as Option[] | null
    };
  },
  methods: {
    loadOptions() {
      this.yearOptions = this.years.map((year) => {
        return {
          id: year.toString(),
          label: year.toString(),
          value: year,
          showFirst: false
        } as Option;
      });
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
  width: 180px;
}
</style>
