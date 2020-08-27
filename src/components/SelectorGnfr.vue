<template>
  <div class="gnfr-selector-div">
    <label
      :class="[disabled ? 'gnfr-selector-disabled' : '', 'selector-label']"
      for="gnfr-select-input"
    >
      {{ "selector.gnfr.label" | translate }}
    </label>
    <div id="gnfr-select-status" class="hidden-visually" aria-live="polite">
      {{ gnfrOptions.length }} {{ "aria.gnfr.selector.status.text" | translate }}
    </div>
    <div
      class="gnfr-select-container"
      id="gnfrSelectContainer"
      v-on:click="handleSelectorClick"
      v-on:keyup="doKeyAction"
      v-on:keydown="preventKeyDownScroll"
      role="combobox"
      aria-haspopup="listbox"
      aria-owns="gnfr-select-list"
      :aria-expanded="showOptions ? 'true' : 'false'"
    >
      <input
        type="text"
        id="gnfr-select-input"
        ref="gnfrSelectInput"
        v-model="gnfrInputValue"
        :disabled="disabled"
        class="select-css"
        aria-describedby="gnfr-select-info"
        aria-controls="gnfr-select-list"
        readonly
      />
      <span id="gnfr-select-info" class="hidden-visually">
        {{ "aria.gnfr.selector.describe" | translate }}
      </span>
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
          :class="[!showOptions ? '' : 'rotate', !initialized ? 'hidden-all' : '', 'icon']"
          role="img"
        >
          <path
            d="M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z"
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
          ref="gnfrOptions"
        >
          {{ gnfr.name[lang] }}
          <span class="hidden-gnfr-key" style="display: none;"> {{ gnfr.id }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { mapState } from "vuex";
import { Gnfr, MapDataType } from "./../types";
import { fetchGnfrMeta } from "@/services/pollutants";
import * as selectorUtils from "./../utils/selectorUtils";

const findFocus = (): HTMLElement => {
  const focusPoint = document.activeElement;
  return focusPoint as HTMLElement;
};

export default Vue.extend({
  props: {
    mapDataType: { type: String as PropType<MapDataType> }
  },
  watch: {
    mapDataType: function () {
      if (this.mapDataType === MapDataType.MUNICIPALITY) {
        // Disable GNFR selector for municipality data
        this.setSelectedGnfr(this.combinedGnfr!, false);
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
      disabled: false as boolean,
      initialized: false as boolean
    };
  },
  computed: mapState(["lang"]),
  methods: {
    async initializeGnfrOptions() {
      const gnfrOptions = await fetchGnfrMeta();
      this.gnfrOptions = gnfrOptions.sort(this.sortGnfrOptions);
      const combinedGnfr = this.gnfrOptions.find((gnfr) => gnfr.id === "COMBINED");
      if (combinedGnfr) {
        this.combinedGnfr = combinedGnfr;
        this.gnfrInputValue = combinedGnfr.name[this.lang];
        this.setSelectedGnfr(this.combinedGnfr, false);
        this.initialized = true;
      } else {
        console.error("Could not find initial (combined) gnfr");
      }
    },
    sortGnfrOptions(a: Gnfr, b: Gnfr): number {
      if (a.id === "COMBINED") {
        return -1;
      } else if (b.id === "COMBINED") {
        return 1;
      }
      if (a.name[this.lang] < b.name[this.lang]) {
        return -1;
      } else if (a.name[this.lang] > b.name[this.lang]) {
        return 1;
      }
      return 0;
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
    getInputElement: function (): HTMLElement {
      return this.$refs.gnfrSelectInput as HTMLElement;
    },
    handleSelectorClick: function () {
      if (this.disabled || !this.initialized) {
        return;
      }
      const currentFocus = findFocus();
      switch (this.selectorState) {
        case "initial":
          this.toggleGnfrSelector(true);
          this.setState("opened");
          break;
        case "opened":
          if (currentFocus === this.getInputElement()) {
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
    getGnfrIdFromElement: function (element: HTMLElement): string {
      return element!
        .querySelector("span")!
        .textContent!.replace(/[{()}]/g, "")
        .trim();
    },
    makeChoice: function (whichOption): void {
      // read gnfr identifier from span element
      const selectedGnfrId = this.getGnfrIdFromElement(whichOption);

      const selectedGnfr = this.getGnfrByKey(selectedGnfrId);
      if (selectedGnfrId && selectedGnfr) {
        this.setSelectedGnfr(selectedGnfr, true);
      } else {
        console.log("Could not select gnfr by id", selectedGnfr);
      }
    },
    setSelectedGnfr: function (selectedGnfr: Gnfr, focusInput: boolean): void {
      this.$emit("set-selected-gnfr", selectedGnfr.id);
      this.gnfrInputValue = selectedGnfr.name[this.lang];
      if (focusInput) {
        this.moveFocus(findFocus(), "input");
      }
    },
    moveFocus: function (fromHere, toThere) {
      if (toThere === "input") {
        this.getInputElement().focus();
        return;
      }
      switch (fromHere) {
        case this.getInputElement():
          if (toThere === "forward") {
            this.$refs.gnfrOptions[0].focus();
          } else if (toThere === "back") {
            this.$refs.gnfrOptions[this.gnfrOptions.length - 1].focus();
          }
          break;
        case this.$refs.gnfrOptions[0]:
          if (toThere === "forward") {
            this.$refs.gnfrOptions[1].focus();
          } else if (toThere === "back") {
            this.getInputElement().focus();
          }
          break;
        case this.$refs.gnfrOptions[this.gnfrOptions.length - 1]:
          if (toThere === "forward") {
            this.$refs.gnfrOptions[0].focus();
          } else if (toThere === "back") {
            this.$refs.gnfrOptions[this.gnfrOptions.length - 2].focus();
          }
          break;
        default: {
          const currentItem = findFocus();
          const gnfrId = currentItem ? this.getGnfrIdFromElement(currentItem) : "";
          const indexOfGnfr = this.gnfrOptions.map((gnfr) => gnfr.id).indexOf(gnfrId);
          if (toThere === "forward") {
            this.$refs.gnfrOptions[indexOfGnfr + 1].focus();
          } else if (toThere === "back" && indexOfGnfr > 0) {
            this.$refs.gnfrOptions[indexOfGnfr - 1].focus();
          } else {
            this.getInputElement().focus();
          }
          break;
        }
      }
    },
    preventKeyDownScroll: function (e) {
      selectorUtils.preventKeyDownScroll(e);
    },
    doKeyAction: function (whichKey: KeyboardEvent) {
      const currentFocus = findFocus();
      switch (whichKey.code) {
        case "Enter":
          if (this.selectorState === "initial") {
            this.toggleGnfrSelector(true);
            this.setState("opened");
          } else if (
            this.selectorState === "opened" &&
            currentFocus &&
            currentFocus.tagName === "LI"
          ) {
            this.makeChoice(currentFocus);
            this.toggleGnfrSelector(false);
            this.setState("closed");
          } else if (
            this.selectorState === "opened" &&
            currentFocus === this.getInputElement()
          ) {
            this.toggleGnfrSelector(false);
            this.setState("closed");
          } else if (
            this.selectorState === "filtered" &&
            currentFocus &&
            currentFocus.tagName === "LI"
          ) {
            this.makeChoice(currentFocus);
            this.toggleGnfrSelector(false);
            this.setState("closed");
          } else if (
            this.selectorState === "filtered" &&
            currentFocus === this.getInputElement()
          ) {
            this.toggleGnfrSelector(true);
            this.setState("opened");
          } else {
            this.toggleGnfrSelector(true);
            this.setState("filtered");
          }
          break;

        case "Escape":
          if (this.selectorState === "opened" || this.selectorState === "filtered") {
            this.toggleGnfrSelector(false);
            this.setState("initial");
          }
          break;

        case "ArrowDown":
          if (this.selectorState === "initial" || this.selectorState === "closed") {
            this.toggleGnfrSelector(true);
            this.moveFocus(this.getInputElement(), "forward");
            this.setState("opened");
          } else {
            this.toggleGnfrSelector(true);
            this.moveFocus(currentFocus, "forward");
          }
          break;
        case "ArrowUp":
          if (this.selectorState === "initial" || this.selectorState === "closed") {
            this.toggleGnfrSelector(true);
            this.moveFocus(this.getInputElement(), "back");
            this.setState("opened");
          } else {
            this.moveFocus(currentFocus, "back");
          }
          break;
        default:
          if (this.selectorState === "initial") {
            this.toggleGnfrSelector(true);
            this.setState("filtered");
          } else if (this.selectorState === "opened") {
            this.setState("filtered");
          } else if (this.selectorState === "closed") {
            this.setState("filtered");
          }
          break;
      }
    }
  },
  mounted() {
    this.initializeGnfrOptions();
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest("#gnfrSelectContainer")) {
        this.toggleGnfrSelector(false);
        this.setState("initial");
      }
    });
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
.gnfr-select-container {
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
  background: #d1d1d1;
}
.gnfr-select-options li:focus {
  background: #d1d1d1;
  border: none;
  outline: none;
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
