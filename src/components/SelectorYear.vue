<template>
  <div class="year-selector-div">
    <label class="hidden-visually" for="custom-select-input">Vuosi</label>
    <div class="selector-label" for="custom-select-input">
      {{ "selector.vuosi.label" | translate }}
    </div>
    <div id="custom-select-status" class="hidden-visually" aria-live="polite"></div>
    <div
      class="custom-select"
      id="myCustomSelect"
      v-on:click="handleSelectorClick"
      role="combobox"
      aria-haspopup="listbox"
      aria-owns="custom-select-list"
    >
      <input
        type="text"
        id="custom-select-input"
        v-model="yearInputValue"
        class="select-css"
        aria-describedby="custom-select-info"
        aria-autocomplete="both"
        aria-controls="custom-select-list"
        readonly
      />
      <span id="custom-select-info" class="hidden-visually"
        >Arrow down for options or start typing to filter.</span
      >
      <span class="custom-select-icons">
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
          v-bind:class="[!showOptions ? '' : 'rotate', 'icon']"
          role="img"
        >
          <path
            d="M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z"
          />
        </svg>
      </span>
      <ul
        v-bind:class="[showOptions ? '' : 'hidden-all', 'custom-select-options']"
        id="custom-select-list"
        role="listbox"
      >
        <li v-for="year in yearOptions" :key="year" tabindex="-1" role="option">
          {{ year }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import * as constants from "./../constants";

const findFocus = () => {
  const focusPoint = document.activeElement;
  return focusPoint;
};

let selectorElement: Element | null = null;
let yearInputElement: Element | null = null;

export default Vue.extend({
  data() {
    return {
      yearOptions: [1990, 1995, 2000, 2005, 2010, 2015, 2018] as number[],
      showOptions: false as boolean,
      yearInputValue: constants.initialYear as number,
      selectorState: "initial" as string
    };
  },
  methods: {
    toggleYearSelector: function (open: boolean | undefined = undefined) {
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
      const currentFocus = findFocus();
      switch (this.selectorState) {
        case "initial":
          this.toggleYearSelector(true);
          this.setState("opened");
          break;
        case "opened":
          if (currentFocus === yearInputElement) {
            this.toggleYearSelector(false);
            this.setState("initial");
          } else if (currentFocus && currentFocus.tagName === "LI") {
            this.makeChoice(currentFocus);
            this.toggleYearSelector(false);
            this.setState("closed");
          }
          break;
        case "filtered": // i.e. year was selected
          if (currentFocus && currentFocus.tagName === "LI") {
            this.makeChoice(currentFocus);
            this.toggleYearSelector(false);
            this.setState("closed");
          } else {
            this.toggleYearSelector();
            this.setState(this.showOptions ? "opened" : "closed");
          }
          break;
        case "closed":
          this.toggleYearSelector(true);
          this.setState("filtered");
          break;
      }
    },
    makeChoice: function (whichOption) {
      this.yearInputValue = parseInt(whichOption.textContent.trim());
      this.$emit("set-selected-year", this.yearInputValue);
    }
  },
  mounted() {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest("#myCustomSelect")) {
        this.toggleYearSelector(false);
        this.setState("initial");
      }
    });
    selectorElement = document.querySelector("#myCustomSelect");
    yearInputElement = selectorElement ? selectorElement.querySelector("input") : null;
  }
});
</script>

<style scoped>
.selector-label {
  font-weight: 500;
  margin: 0 1px 1px 2px;
}
.year-selector-div {
  background: #ffffff;
  max-width: 6em;
  margin: 12px;
}
.custom-select {
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
.custom-select-icons {
  pointer-events: none;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  z-index: 20;
  border: 1px solid white;
  background: transparent;
}
.custom-select-options {
  border: 1px solid #aaa;
  border-radius: 0 0 0.25em 0.25em;
  line-height: 1.5;
  padding: 0;
  padding-top: 7px;
  margin: 0;
  margin-top: -0.5em;
  list-style-type: none;
  font-weight: normal;
  cursor: pointer;
  z-index: 2;
  position: absolute;
  width: calc(100% - 2px);
  background-color: #ffffff;
}
.custom-select-options li {
  padding: 0.5em;
}
.custom-select-options li:hover {
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
