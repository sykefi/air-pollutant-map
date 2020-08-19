<template>
  <div class="gnfr-selector-div">
    <label class="hidden-visually" for="gnfr-select-input">Luokka</label>
    <div
      :class="[disabled ? 'gnfr-selector-disabled' : '', 'selector-label']"
      for="gnfr-select-input"
    >
      Luokka
    </div>
    <div id="gnfr-select-status" class="hidden-visually" aria-live="polite"></div>
    <div
      class="gnfr-select"
      id="gnfrSelector"
      @click="handleSelectorClick"
      role="combobox"
      aria-haspopup="listbox"
      aria-owns="gnfr-select-list"
    >
      <input
        type="text"
        id="gnfr-select-input"
        v-model="gnfrInputValue"
        :disabled="disabled"
        class="select-css"
        aria-describedby="gnfr-select-info"
        aria-autocomplete="both"
        aria-controls="gnfr-select-list"
        readonly
      />
      <span id="gnfr-select-info" class="hidden-visually"
        >Arrow down for options or start typing to filter.</span
      >
      <span class="gnfr-select-icons">
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
          :class="[!showOptions ? '' : 'hidden-all', 'icon']"
          role="img"
        >
          <path
            d="M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z"
          />
        </svg>
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
          class="icon"
          role="img"
          v-bind:class="[showOptions ? '' : 'hidden-all', 'icon']"
        >
          <path
            d="M23.245 20l-11.245-14.374-11.219 14.374-.781-.619 12-15.381 12 15.391-.755.609z"
          />
        </svg>
      </span>
      <ul
        v-bind:class="[showOptions ? '' : 'hidden-all', 'gnfr-select-options']"
        id="gnfr-select-list"
        role="listbox"
      >
        <li
          v-for="gnfr in gnfrOptions"
          :key="gnfr.parlocRyhmaTunnus"
          tabindex="-1"
          role="option"
        >
          {{ gnfr.name["fi"] }}
          <span class="hidden-gnfr-key" style="display: none;"> {{ gnfr.id }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Gnfr, MapDataType } from "./../types";
import { fetchGnfrMeta } from "@/services/pollutants";

const findFocus = () => {
  const focusPoint = document.activeElement;
  return focusPoint;
};

const sortGnfrOptions = (a: Gnfr, b: Gnfr): number => {
  if (a.id === "COMBINED") {
    return -1;
  } else if (b.id === "COMBINED") {
    return 1;
  }
  if (a.name["fi"] < b.name["fi"]) {
    return -1;
  } else if (a.name["fi"] > b.name["fi"]) {
    return 1;
  }
  return 0;
};

let selectorElement: Element | null = null;
let gnfrInputElement: Element | null = null;

export default Vue.extend({
  props: {
    mapDataType: { type: String as PropType<MapDataType> }
  },
  watch: {
    mapDataType: function () {
      if (this.mapDataType === MapDataType.MUNICIPALITY) {
        // Disable GNFR selector for municipality data
        this.setSelectedGnfr(this.combinedGnfr!);
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    }
  },
  data() {
    return {
      gnfrOptions: [] as Gnfr[],
      gnfrInputValue: "" as string,
      combinedGnfr: undefined as Gnfr | undefined,
      showOptions: false as boolean,
      selectorState: "initial" as string,
      disabled: false as boolean
    };
  },
  methods: {
    async initializeGnfrOptions() {
      const gnfrOptions = await fetchGnfrMeta();
      this.gnfrOptions = gnfrOptions.sort(sortGnfrOptions);
      const combinedGnfr = this.gnfrOptions.find((gnfr) => gnfr.id === "COMBINED");
      if (combinedGnfr) {
        this.combinedGnfr = combinedGnfr;
        this.gnfrInputValue = combinedGnfr.name["fi"];
        this.setSelectedGnfr(this.combinedGnfr);
      } else {
        console.error("Could not find initial (combined) gnfr");
      }
    },
    getGnfrByKey(gnfrId: string): Gnfr | undefined {
      return this.gnfrOptions.find((gnfr) => gnfr.id === gnfrId);
    },
    toggleGnfrSelector: function (open: boolean | undefined = undefined) {
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
      if (this.disabled) {
        return;
      }
      const currentFocus = findFocus();
      switch (this.selectorState) {
        case "initial":
          this.toggleGnfrSelector(true);
          this.setState("opened");
          break;
        case "opened":
          if (currentFocus === gnfrInputElement) {
            this.toggleGnfrSelector(false);
            this.setState("initial");
          } else if (currentFocus && currentFocus.tagName === "LI") {
            this.makeChoice(currentFocus);
            this.toggleGnfrSelector(false);
            this.setState("closed");
          }
          break;
        case "filtered": // i.e. gnfr was selected
          if (currentFocus && currentFocus.tagName === "LI") {
            this.makeChoice(currentFocus);
            this.toggleGnfrSelector(false);
            this.setState("closed");
          } else {
            this.toggleGnfrSelector();
            this.setState(this.showOptions ? "opened" : "closed");
          }
          break;
        case "closed":
          this.toggleGnfrSelector(true);
          this.setState("filtered");
          break;
      }
    },
    makeChoice: function (whichOption) {
      // read gnfr identifier from span element
      const selectedGnfrId = whichOption
        .querySelector("span")
        .textContent.replace(/[{()}]/g, "")
        .trim();

      const selectedGnfr = this.getGnfrByKey(selectedGnfrId);
      if (selectedGnfrId && selectedGnfr) {
        this.setSelectedGnfr(selectedGnfr);
      } else {
        console.log("Could not select gnfr by id", selectedGnfr);
      }
    },
    setSelectedGnfr: function (selectedGnfr: Gnfr) {
      this.$emit("set-selected-gnfr", selectedGnfr.id);
      this.gnfrInputValue = selectedGnfr.name["fi"];
    }
  },
  mounted() {
    this.initializeGnfrOptions();

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest("#gnfrSelector")) {
        this.toggleGnfrSelector(false);
        this.setState("initial");
      }
    });
    selectorElement = document.querySelector("#gnfrSelector");
    gnfrInputElement = selectorElement ? selectorElement.querySelector("input") : null;
  }
});
</script>

<style scoped>
.selector-label {
  font-weight: 500;
  margin: 0 1px 1px 2px;
}
.gnfr-selector-div {
  background: #ffffff;
  max-width: 14em;
  margin: 12px;
}
.gnfr-select {
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
.select-css:disabled {
  border-color: grey;
  color: grey;
}
.gnfr-selector-disabled {
  color: grey;
}
.gnfr-selector-disabled:hover {
  color: grey;
  cursor: initial;
}
.gnfr-select-icons {
  pointer-events: none;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  z-index: 20;
  border: 1px solid white;
  background: transparent;
}
.gnfr-select-options {
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
.gnfr-select-options li {
  padding: 0.5em;
  font-size: 0.9em;
}
.gnfr-select-options li:hover {
  background: blue;
  color: #fff;
  border: 1px solid blue;
  border-width: 0 1px 0 1px;
}
.icon {
  fill: ButtonText;
  pointer-events: none;
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
