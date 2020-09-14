<template>
  <div class="year-selector-div">
    <label class="selector-label" for="year-select-input">
      {{ "selector.vuosi.label" | translate }}
    </label>
    <div id="year-select-status" class="hidden-visually" aria-live="polite">
      {{ yearOptions.length }} {{ "aria.year.selector.status.text" | translate }}
    </div>
    <div
      class="year-select-container"
      id="yearSelectContainer"
      v-on:click="handleSelectorClick"
      v-on:keyup="doKeyAction"
      v-on:keydown="preventKeyDownScroll"
      role="combobox"
      aria-haspopup="listbox"
      aria-owns="year-select-list"
      :aria-expanded="showOptions ? 'true' : 'false'"
    >
      <input
        type="text"
        id="year-select-input"
        ref="yearSelectInput"
        v-model="yearInputValue"
        class="select-css"
        aria-describedby="year-select-info"
        aria-controls="year-select-list"
        readonly
      />
      <span id="year-select-info" class="hidden-visually">
        {{ "aria.year.selector.describe" | translate }}
      </span>
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
        v-bind:class="[showOptions ? '' : 'hidden-all', 'year-select-options']"
        id="year-select-list"
        role="listbox"
      >
        <li
          v-for="year in yearOptions"
          :key="year"
          tabindex="-1"
          role="option"
          ref="yearOptions"
        >
          {{ year }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as constants from "./../constants";
import * as selectorUtils from "./../utils/selectorUtils";

const findFocus = () => {
  const focusPoint = document.activeElement;
  return focusPoint;
};

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
    getInputElement: function (): HTMLElement {
      return this.$refs.yearSelectInput as HTMLElement;
    },
    handleSelectorClick: function (): void {
      const currentFocus = findFocus();
      switch (this.selectorState) {
        case "initial":
          this.toggleYearSelector(true);
          this.setState("opened");
          break;
        case "opened":
          if (currentFocus === this.getInputElement()) {
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
      this.moveFocus(findFocus(), "input");
      this.$emit("set-selected-year", this.yearInputValue);
    },
    moveFocus: function (fromHere, toThere) {
      if (toThere === "input") {
        this.getInputElement().focus();
        return;
      }
      switch (fromHere) {
        case this.getInputElement():
          if (toThere === "forward") {
            this.$refs.yearOptions[0].focus();
          } else if (toThere === "back") {
            this.$refs.yearOptions[this.yearOptions.length - 1].focus();
          }
          break;
        case this.$refs.yearOptions[0]:
          if (toThere === "forward") {
            this.$refs.yearOptions[1].focus();
          } else if (toThere === "back") {
            this.getInputElement().focus();
          }
          break;
        case this.$refs.yearOptions[this.yearOptions.length - 1]:
          if (toThere === "forward") {
            this.$refs.yearOptions[0].focus();
          } else if (toThere === "back") {
            this.$refs.yearOptions[this.yearOptions.length - 2].focus();
          }
          break;
        default: {
          const currentItem = findFocus();
          const yearOption = parseInt(currentItem!.textContent!.trim());
          const indexOfYear = this.yearOptions.indexOf(yearOption);
          if (toThere === "forward") {
            this.$refs.yearOptions[indexOfYear + 1].focus();
          } else if (toThere === "back" && indexOfYear > 0) {
            this.$refs.yearOptions[indexOfYear - 1].focus();
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
            this.toggleYearSelector(true);
            this.setState("opened");
          } else if (
            this.selectorState === "opened" &&
            currentFocus &&
            currentFocus.tagName === "LI"
          ) {
            this.makeChoice(currentFocus);
            this.toggleYearSelector(false);
            this.setState("closed");
          } else if (
            this.selectorState === "opened" &&
            currentFocus === this.getInputElement()
          ) {
            this.toggleYearSelector(false);
            this.setState("closed");
          } else if (
            this.selectorState === "filtered" &&
            currentFocus &&
            currentFocus.tagName === "LI"
          ) {
            this.makeChoice(currentFocus);
            this.toggleYearSelector(false);
            this.setState("closed");
          } else if (
            this.selectorState === "filtered" &&
            currentFocus === this.getInputElement()
          ) {
            this.toggleYearSelector(true);
            this.setState("opened");
          } else {
            this.toggleYearSelector(true);
            this.setState("filtered");
          }
          break;

        case "Escape":
          if (this.selectorState === "opened" || this.selectorState === "filtered") {
            this.toggleYearSelector(false);
            this.setState("initial");
          }
          break;

        case "ArrowDown":
          if (this.selectorState === "initial" || this.selectorState === "closed") {
            this.toggleYearSelector(true);
            this.moveFocus(this.getInputElement(), "forward");
            this.setState("opened");
          } else {
            this.toggleYearSelector(true);
            this.moveFocus(currentFocus, "forward");
          }
          break;
        case "ArrowUp":
          if (this.selectorState === "initial" || this.selectorState === "closed") {
            this.toggleYearSelector(true);
            this.moveFocus(this.getInputElement(), "back");
            this.setState("opened");
          } else {
            this.moveFocus(currentFocus, "back");
          }
          break;
        default:
          if (this.selectorState === "initial") {
            this.toggleYearSelector(true);
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
      if (target && !target.closest("#yearSelectContainer")) {
        this.toggleYearSelector(false);
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
.year-selector-div {
  background: #ffffff;
  max-width: 6em;
  margin: 12px;
}
.year-select-container {
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
.year-select-options {
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
.year-select-options li {
  padding: 0.5em;
}
.year-select-options li:hover {
  background: #d1d1d1;
}
.year-select-options li:focus {
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
