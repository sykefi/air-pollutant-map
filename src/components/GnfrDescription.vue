<template>
  <div class="desc-box">
    <div class="desc">
      <span class="gnfr-name"> {{ gnfr && gnfr.name[lang] }} </span>
      {{ gnfr && gnfr.desc[lang] }}
    </div>
  </div>
</template>

<script lang="ts">
import { Gnfr } from "@/types";
import Vue, { PropType } from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  props: {
    gnfr: { type: Object as PropType<Gnfr> }
  },
  computed: mapState(["lang"])
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
  margin-right: 3px;
}
.desc {
  color: black;
}
</style>
