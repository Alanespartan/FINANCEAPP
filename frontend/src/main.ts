import { createApp } from "vue";
import vSelect from "vue-select";
import Donut from "vue-css-donut-chart";
import Datepicker from "@vuepic/vue-datepicker";
import Multiselect from "@vueform/multiselect";
import "bootstrap";

import "vue-css-donut-chart/dist/vcdonut.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@vuepic/vue-datepicker/dist/main.css";
import "@vueform/multiselect/themes/default.css";
import "vue-select/dist/vue-select.css";
import "sweetalert2/src/sweetalert2.scss";

import App from "./App.vue";
import router from "./router";

createApp(App).use(router).use(Donut).component("Datepicker", Datepicker).component("Multiselect", Multiselect).component("v-select", vSelect).mount("#app");