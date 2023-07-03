import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

import VXETable from "vxe-table";
import "vxe-table/lib/style.css";

Vue.use(VXETable);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
