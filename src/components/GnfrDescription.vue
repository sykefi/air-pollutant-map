<template>
  <div class="desc-box">
    <div class="desc">
      <span class="gnfr-name">{{ gnfr && gnfr.name[lang] }}</span>
      {{ gnfr && gnfr.desc[lang] }}
      <div class="stats">
        <span v-if="totalPollutionStats">
          <span v-if="totalPollutionStats.gnfrId === 'COMBINED'">
            {{ "gnfr.description.combined-emissions" | translate }}
            <span class="formatted-number">
              {{ roundTotalPollution(totalPollutionStats.gnfrPollution) }}
              {{ totalPollutionStats.unit }}
            </span></span
          ><span v-else>
            {{ "gnfr.description.gnfr-share-of-total" | translate }}
            <span class="formatted-number">
              {{ getShareOfGnfrPollution(totalPollutionStats) }} %
            </span>
            (<span class="formatted-number"
              >{{ roundTotalPollution(totalPollutionStats.gnfrPollution) }}
              {{ totalPollutionStats.unit }}</span
            >)</span
          ></span
        ><span v-if="gnfr && gnfr.id !== 'COMBINED' && getCalcRepShareObject()">
          <span v-if="getRepRatio() > 0">
            {{ "gnfr.description.share.of.reported_pre" | translate }}
            <span class="formatted-number"> {{ getRepRatio() }} %</span>
            {{ "gnfr.description.share.of.reported_after" | translate }} </span
          ><span v-else>{{ "gnfr.description.no_reported_emissions" | translate }}</span>
        </span>
      </div>
    </div>
    <div v-if="!gnfrPollutantMetas || !totalPollutionStats" class="load-animation-container">
      <LoadingAnimation color="#007ac9" :size="17" />
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
    roundTotalPollution(n: number) {
      const rounded = parseFloat(n.toPrecision(3));
      if (rounded >= 1000) {
        return rounded.toLocaleString("fi-FI", { useGrouping: true });
      }
      return rounded;
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
  margin: 0.4em 0 1.2em 0;
  padding: 0em;
  min-height: 9em;
  background-color: #fff;
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
