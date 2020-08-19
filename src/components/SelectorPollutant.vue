<template>
  <div class="pollutant-selector-div">
    <label class="hidden-visually" for="pollutant-select-input">Saastuke</label>
    <div class="selector-label" for="pollutant-select-input">Saastuke</div>
    <div id="pollutant-select-status" class="hidden-visually" aria-live="polite"></div>
    <div
      class="pollutant-select"
      id="pollutantSelector"
      v-on:click="handleSelectorClick"
      role="combobox"
      aria-haspopup="listbox"
      aria-owns="pollutant-select-list"
    >
      <input
        type="text"
        id="pollutant-select-input"
        v-model="pollutantInputValue"
        class="select-css"
        aria-describedby="pollutant-select-info"
        aria-autocomplete="both"
        aria-controls="pollutant-select-list"
        readonly
      />
      <span id="pollutant-select-info" class="hidden-visually"
        >Arrow down for options or start typing to filter.</span
      >
      <span class="pollutant-select-icons">
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill-rule="evenodd"
          clip-rule="evenodd"
          focusable="false"
          aria-hidden="true"
          id="icon-circle-down"
          v-bind:class="[
            !showOptions ? '' : 'rotate',
            !initialized ? 'hidden-all' : '',
            'icon'
          ]"
          role="img"
        >
          <path
            d="M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z"
          />
        </svg>
      </span>
      <ul
        v-bind:class="[showOptions ? '' : 'hidden-all', 'pollutant-select-options']"
        id="pollutant-select-list"
        role="listbox"
      >
        <li
          v-for="pollutant in pollutantOptions"
          :key="pollutant.parlocRyhmaTunnus"
          tabindex="-1"
          role="option"
        >
          {{ pollutant.name["fi"] }}
          <span> ({{ pollutant.id }})</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import { Pollutant } from "./../types";
import { fetchPollutantMeta } from "./../services/pollutants";

const findFocus = () => {
  const focusPoint = document.activeElement;
  return focusPoint;
};

let selectorElement: Element | null = null;
let pollutantInputElement: Element | null = null;

export default Vue.extend({
  data() {
    return {
      pollutantOptions: [] as Pollutant[],
      pollutantInputValue: "" as string,
      showOptions: false as boolean,
      selectorState: "initial" as string,
      initialized: false as boolean
    };
  },
  methods: {
    async initializePollutantOptions() {
      const pollutantOptions = await fetchPollutantMeta();
      this.pollutantOptions = pollutantOptions
        .filter((feat) => feat.useDev)
        .sort((a, b) => a.name["fi"].localeCompare(b.name["fi"]));

      const initialPollutant = this.pollutantOptions.find((feat) => feat.id === "s16");
      if (initialPollutant) {
        this.setSelectedPollutant(initialPollutant);
      }
      this.initialized = true;
    },
    togglePollutantSelector: function (open: boolean | undefined = undefined) {
      if (open !== undefined) {
        this.showOptions = open;
      } else {
        this.showOptions = !this.showOptions;
      }
    },
    setState: function (state: string) {
      this.selectorState = state;
    },
    handleSelectorClick: function () {
      if (!this.initialized) {
        return;
      }
      const currentFocus = findFocus();
      switch (this.selectorState) {
        case "initial":
          this.togglePollutantSelector(true);
          this.setState("opened");
          break;
        case "opened":
          if (currentFocus === pollutantInputElement) {
            this.togglePollutantSelector(false);
            this.setState("initial");
          } else if (currentFocus && currentFocus.tagName === "LI") {
            this.makeChoice(currentFocus);
            this.togglePollutantSelector(false);
            this.setState("closed");
          }
          break;
        case "filtered": // i.e. pollutant was selected
          if (currentFocus && currentFocus.tagName === "LI") {
            this.makeChoice(currentFocus);
            this.togglePollutantSelector(false);
            this.setState("closed");
          } else {
            this.togglePollutantSelector();
            this.setState(this.showOptions ? "opened" : "closed");
          }
          break;
        case "closed":
          this.togglePollutantSelector(true);
          this.setState("filtered");
          break;
      }
    },
    getPollutant: function (pollutantId: string): Pollutant | undefined {
      return this.pollutantOptions.filter((po) => po.id === pollutantId)[0];
    },
    makeChoice: function (whichOption) {
      // read pollutant identifier from hidden span element
      const selectedPollutantId = whichOption
        .querySelector("span")
        .textContent.replace(/[{()}]/g, "")
        .trim();

      const selectedPollutant = this.getPollutant(selectedPollutantId);
      if (selectedPollutant) {
        this.setSelectedPollutant(selectedPollutant);
      } else {
        console.log("Could not select pollutant by id", selectedPollutantId);
      }
    },
    setSelectedPollutant: function (po: Pollutant) {
      this.$emit("set-selected-pollutant", po);
      this.pollutantInputValue = po.name["fi"];
    }
  },
  mounted() {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest("#pollutantSelector")) {
        this.togglePollutantSelector(false);
        this.setState("initial");
      }
    });
    selectorElement = document.querySelector("#pollutantSelector");
    pollutantInputElement = selectorElement ? selectorElement.querySelector("input") : null;
    this.initializePollutantOptions();
  }
});
</script>

<style scoped>
.selector-label {
  font-weight: 500;
  margin: 0 1px 1px 2px;
}
.pollutant-selector-div {
  background: #ffffff;
  max-width: 13em;
  margin: 12px;
}
.pollutant-select {
  position: relative;
}
.select-css {
  display: block;
  font-size: 1em;
  font-family: sans-serif;
  /* font-weight: 700; */
  color: #444;
  line-height: 1;
  padding: 0.6em 1.4em 0.5em 0.8em;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: 1px solid black;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
  border-radius: 0.25em;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  position: relative;
  z-index: 10;
}
.select-css::-ms-expand {
  display: none;
}
.select-css:focus {
  border: 1px solid blue;
  color: #222;
  outline: none;
}
.pollutant-select-icons {
  pointer-events: none;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  z-index: 20;
  border: 1px solid white;
  background: transparent;
}
.pollutant-select-options {
  border: 1px solid #aaa;
  border-radius: 0 0 0.25em 0.25em;
  line-height: 1.5;
  padding: 0;
  padding-top: 7px;
  margin: 0;
  margin-top: -0.2em;
  list-style-type: none;
  font-weight: normal;
  cursor: pointer;
  z-index: 2;
  position: absolute;
  width: calc(100% - 2px);
  background-color: #ffffff;
  max-height: 400px;
  overflow: auto;
}
.pollutant-select-options li {
  padding: 0.5em;
  font-size: 0.9em;
}
.pollutant-select-options li:hover {
  background: blue;
  color: #fff;
  border: 1px solid blue;
  border-width: 0 1px 0 1px;
}
.icon {
  fill: ButtonText;
  pointer-events: none;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
}
.rotate {
  transform: rotate(180deg);
}
.hidden-all {
  display: none;
}
.hidden-visually {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  -webkit-clip-path: inset(50%);
  clip-path: inset(50%);
  border: 0;
}
</style>
