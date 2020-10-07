<template>
  <div class="desc-box">
    <div class="desc">
      <span class="gnfr-name">{{ gnfr && gnfr.name[lang] }}</span>
      {{ gnfr && gnfr.desc[lang] }}
      <div v-if="gnfr && gnfr.id !== 'COMBINED'" class="rep-ratio">
        {{ "gnfr.description.share.of.reported" | translate }}:
        <span class="percentage"> {{ getRepRatio() }} %</span>
        ({{ "gnfr.description.share.of.calculated" | translate }}:
        <span class="percentage">{{ getCalcRatio() }} %</span>)
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Gnfr, GnfrPollutantCalcShare, Pollutant } from "@/types";
import Vue, { PropType } from "vue";
import { mapState } from "vuex";
import { fetchGnfrPollutantCalcShares } from "../services/meta";

export default Vue.extend({
  props: {
    year: Number,
    gnfr: { type: Object as PropType<Gnfr> },
    pollutant: { type: Object as PropType<Pollutant | undefined> }
  },
  computed: mapState(["lang"]),
  data() {
    return {
      gnfrPollutantCalcShares: undefined as GnfrPollutantCalcShare[] | undefined
    };
  },
  methods: {
    getCalcRepShareObject(): GnfrPollutantCalcShare | undefined {
      if (this.year && this.gnfr && this.pollutant && this.gnfrPollutantCalcShares) {
        return this.gnfrPollutantCalcShares.find((o) => {
          return (
            o.year === this.year &&
            o.gnfr === this.gnfr.id &&
            o.pollutant === this.pollutant!.id
          );
        });
      }
      return undefined;
    },
    getRepRatio() {
      const gnfrPollutantShare = this.getCalcRepShareObject();
      if (gnfrPollutantShare) {
        return Math.round(gnfrPollutantShare.repShare * 1000) / 10;
      }
      return "?";
    },
    getCalcRatio() {
      const gnfrPollutantShare = this.getCalcRepShareObject();
      if (gnfrPollutantShare) {
        return Math.round(gnfrPollutantShare.calcShare * 1000) / 10;
      }
      return "?";
    }
  },
  async mounted() {
    this.gnfrPollutantCalcShares = await fetchGnfrPollutantCalcShares();
  }
});
</script>

<style scoped>
.desc-box {
  margin: -3px 0px 9px 0px;
  padding: 10px 12px;
  border-radius: 5px;
  background-color: #f8f8f8;
}
.gnfr-name {
  font-weight: 550;
  margin-right: 1px;
}
.desc {
  color: black;
}
.rep-ratio {
  margin: 7px 0px 0px 0px;
}
.percentage {
  color: #007ac9;
}
</style>
