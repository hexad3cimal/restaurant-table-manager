import Vue from 'vue';
import DashboardPlugin from './plugins/dashboard-plugin';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './assets/scss/argon.scss';
import Notifications from 'vue-notification';
 

 
Vue.use(Notifications);
Vue.use(DashboardPlugin);


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
