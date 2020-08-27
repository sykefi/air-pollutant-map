<template>
  <div class="pollutant-selector-div">
    <label class="selector-label" for="pollutant-select-input">
      {{ "selector.pollutant.label" | translate }}
    </label>
    <div id="pollutat-select-status" class="hidden-visually" aria-live="polite">
      {{ pollutantOptions.length }} {{ "aria.pollutant.selector.status.text" | translate }}
    </div>
    <div
      class="pollutant-select-container"
      id="pollutantSelectContainer"
      v-on:click="handleSelectorClick"
      v-on:keyup="doKeyAction"
      v-on:keydown="preventKeyDownScroll"
      role="combobox"
      aria-haspopup="listbox"
      aria-owns="pollutant-select-list"
      :aria-expanded="showOptions ? 'true' : 'false'"
    >
      <input
        type="text"
        id="pollutant-select-input"
        ref="pollutantSelectInput"
        v-model="pollutantInputValue"
        class="select-css"
        aria-describedby="pollutant-select-info"
        aria-controls="pollutant-select-list"
        readonly
      />
      <span id="pollutant-select-info" class="hidden-visually">
        {{ "aria.pollutant.selector.describe" | translate }}
      </span>
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
          ref="pollutantOptions"
        >
          {{ pollutant.name[lang] }}
          <span> ({{ pollutant.id }})</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { Pollutant } from "./../types";
import { fetchPollutantMeta } from "./../services/pollutants";
import * as selectorUtils from "./../utils/selectorUtils";

const findFocus = (): HTMLElement => {
  const focusPoint = document.activeElement;
  return focusPoint as HTMLElement;
};

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
  computed: mapState(["lang"]),
  methods: {
    async initializePollutantOptions() {
      const pollutantOptions = await fetchPollutantMeta();
      this.pollutantOptions = pollutantOptions
        .filter((feat) => feat.useDev)
        .sort((a, b) => a.name[this.lang].localeCompare(b.name[this.lang]));

      const initialPollutant = this.pollutantOptions.find((feat) => feat.id === "s16");
      if (initialPollutant) {
        this.setSelectedPollutant(initialPollutant, false);
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
    getInputElement: function (): HTMLElement {
      return this.$refs.pollutantSelectInput as HTMLElement;
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
          if (currentFocus === this.getInputElement()) {
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
    getPollutantIdFromElement: function (element: HTMLElement): string {
      return element!
        .querySelector("span")!
        .textContent!.replace(/[{()}]/g, "")
        .trim();
    },
    makeChoice: function (whichOption) {
      // read pollutant identifier from hidden span element
      const selectedPollutantId = this.getPollutantIdFromElement(whichOption);

      const selectedPollutant = this.getPollutant(selectedPollutantId);
      if (selectedPollutant) {
        this.setSelectedPollutant(selectedPollutant, true);
      } else {
        console.log("Could not select pollutant by id", selectedPollutantId);
      }
    },
    setSelectedPollutant: function (po: Pollutant, focusInput: boolean) {
      this.$emit("set-selected-pollutant", po);
      this.pollutantInputValue = po.name[this.lang];
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
            this.$refs.pollutantOptions[0].focus();
          } else if (toThere === "back") {
            this.$refs.pollutantOptions[this.pollutantOptions.length - 1].focus();
          }
          break;
        case this.$refs.pollutantOptions[0]:
          if (toThere === "forward") {
            this.$refs.pollutantOptions[1].focus();
          } else if (toThere === "back") {
            this.getInputElement().focus();
          }
          break;
        case this.$refs.pollutantOptions[this.pollutantOptions.length - 1]:
          if (toThere === "forward") {
            this.$refs.pollutantOptions[0].focus();
          } else if (toThere === "back") {
            this.$refs.pollutantOptions[this.pollutantOptions.length - 2].focus();
          }
          break;
        default: {
          const currentItem = findFocus();
          const pollutantId = currentItem ? this.getPollutantIdFromElement(currentItem) : "";
          const indexOfPollutant = this.pollutantOptions
            .map((pollutant) => pollutant.id)
            .indexOf(pollutantId);
          if (toThere === "forward") {
            this.$refs.pollutantOptions[indexOfPollutant + 1].focus();
          } else if (toThere === "back" && indexOfPollutant > 0) {
            this.$refs.pollutantOptions[indexOfPollutant - 1].focus();
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
            this.togglePollutantSelector(true);
            this.setState("opened");
          } else if (
            this.selectorState === "opened" &&
            currentFocus &&
            currentFocus.tagName === "LI"
          ) {
            this.makeChoice(currentFocus);
            this.togglePollutantSelector(false);
            this.setState("closed");
          } else if (
            this.selectorState === "opened" &&
            currentFocus === this.getInputElement()
          ) {
            this.togglePollutantSelector(false);
            this.setState("closed");
          } else if (
            this.selectorState === "filtered" &&
            currentFocus &&
            currentFocus.tagName === "LI"
          ) {
            this.makeChoice(currentFocus);
            this.togglePollutantSelector(false);
            this.setState("closed");
          } else if (
            this.selectorState === "filtered" &&
            currentFocus === this.getInputElement()
          ) {
            this.togglePollutantSelector(true);
            this.setState("opened");
          } else {
            this.togglePollutantSelector(true);
            this.setState("filtered");
          }
          break;

        case "Escape":
          if (this.selectorState === "opened" || this.selectorState === "filtered") {
            this.togglePollutantSelector(false);
            this.setState("initial");
          }
          break;

        case "ArrowDown":
          if (this.selectorState === "initial" || this.selectorState === "closed") {
            this.togglePollutantSelector(true);
            this.moveFocus(this.getInputElement(), "forward");
            this.setState("opened");
          } else {
            this.togglePollutantSelector(true);
            this.moveFocus(currentFocus, "forward");
          }
          break;
        case "ArrowUp":
          if (this.selectorState === "initial" || this.selectorState === "closed") {
            this.togglePollutantSelector(true);
            this.moveFocus(this.getInputElement(), "back");
            this.setState("opened");
          } else {
            this.moveFocus(currentFocus, "back");
          }
          break;
        default:
          if (this.selectorState === "initial") {
            this.togglePollutantSelector(true);
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
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest("#pollutantSelectContainer")) {
        this.togglePollutantSelector(false);
        this.setState("initial");
      }
    });
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
.pollutant-select-container {
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
  background: #d1d1d1;
}
.pollutant-select-options li:focus {
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
