import { defineStore } from "pinia";

interface State {
  count: number;
}

export const useLayout = defineStore("layout", {
  state: (): State => {
    return {
      count: 1
    };
  },
  getters: {},
  actions: {}
});
