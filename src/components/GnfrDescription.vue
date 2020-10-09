<template>
  <div class="desc-box">
    <div class="desc">
      <span class="gnfr-name">{{ gnfr && gnfr.name[lang] }}</span>
      {{ gnfr && gnfr.desc[lang] }}
      <div class="stats">
        <div v-if="gnfr && gnfr.id !== 'COMBINED'">
          {{ "gnfr.description.share.of.reported" | translate }}:
          <span class="formatted-number"> {{ getRepRatio() }} %</span> ({{
            "gnfr.description.share.of.calculated" | translate
          }}: <span class="formatted-number">{{ getCalcRatio() }} %</span>)
        </div>
        <div v-if="totalPollutionStats && totalPollutionStats.gnfrId !== 'COMBINED'">
          Luokan päästöjen osuus kokonaispäästöistä:
          <span class="formatted-number">
            {{ getShareOfGnfrPollution(totalPollutionStats) }} %
          </span>
          (<span class="formatted-number"
            >{{ roundTotalPollution(totalPollutionStats.gnfrPollution) }}
            {{ totalPollutionStats.unit }}</span
          >)
        </div>
        <div v-if="totalPollutionStats && totalPollutionStats.gnfrId === 'COMBINED'">
          Valitun luokan päästöt yhteensä:
          <span class="formatted-number">
            {{ roundTotalPollution(totalPollutionStats.gnfrPollution) }}
            {{ totalPollutionStats.unit }}
          </span>
        </div>
      </div>
      <div v-if="!gnfrPollutantMetas || !totalPollutionStats" class="load-animation-container">
        <LoadingAnimation color="black" :size="17" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Gnfr, GnfrPollutantMeta, Pollutant, TotalPollutionStats } from "@/types";
import Vue, { PropType } from "vue";
import { mapState } from "vuex";
import { fetchGnfrPollutantMetas } from "../services/meta";
import LoadingAnimation from "./LoadingAnimation.vue";

export default Vue.extend({
  props: {
    year: Number,
    gnfr: { type: Object as PropType<Gnfr> },
    pollutant: { type: Object as PropType<Pollutant | undefined> },
    totalPollutionStats: { type: Object as PropType<TotalPollutionStats | undefined> }
  },
  computed: mapState(["lang"]),
  components: {
    LoadingAnimation
  },
  data() {
    return {
      gnfrPollutantMetas: undefined as GnfrPollutantMeta[] | undefined
    };
  },
  methods: {
    getCalcRepShareObject(): GnfrPollutantMeta | undefined {
      if (this.year && this.gnfr && this.pollutant && this.gnfrPollutantMetas) {
        return this.gnfrPollutantMetas.find((o) => {
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
    },
    roundTotalPollution(pollution: number) {
      return Math.round(pollution * 10) / 10;
    },
    roundPercentage(n: number) {
      // round breakpoint values to at least two significant figures
      for (let i = 1; i < Math.pow(10, 10); i = i * 10) {
        const divider = 10 / i;
        if (n > divider) {
          return Math.round(n * i) / i;
        }
      }
      return n;
    },
    getShareOfGnfrPollution(tpi: TotalPollutionStats) {
      return this.roundPercentage((tpi.gnfrPollution / tpi.totalPollution) * 100);
    }
  },
  async mounted() {
    this.gnfrPollutantMetas = await fetchGnfrPollutantMetas();
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
.stats {
  margin: 7px 0px -1px 0px;
  line-height: 115%;
}
.formatted-number {
  color: #007ac9;
}
.load-animation-container {
  margin: 5px 0px -2px 2px;
}
</style>
