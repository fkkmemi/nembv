// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from "bootstrap-vue";
import App from './App';
import router from './router';
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert';
import Icon from 'vue-awesome/components/Icon';
import fam from 'fontawesome-markers';
import * as VueGoogleMaps from 'vue2-google-maps';
import 'vue-awesome/icons'

import cfg from '../static/cfg';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

moment.locale('ko');

Vue.prototype.$axios = axios;
Vue.prototype.$cfg = cfg;
Vue.prototype.$moment = moment;
Vue.prototype.$swal = swal;
Vue.prototype.$fam = fam;

Vue.component('icon', Icon);

Vue.use(BootstrapVue);
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBzlLYISGjL_ovJwAehh6ydhB56fCCpPQw',
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  },
  // installComponents: true,
});

Vue.config.productionTip = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
