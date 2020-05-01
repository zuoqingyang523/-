import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false
  },
  mutations: {
    showLoading(state,isLoad) {
      state.isLoading = isLoad
    }
  },
  actions: {}
});