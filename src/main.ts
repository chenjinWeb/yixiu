import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Tab from './core/tabs';
import Transition from './core/transition';
import directive from './directive';
import component from './component';
import './assets/css/base.less';
import './assets/css/master.less';
import { setLocalStorage, uuid, getLocalStorage } from './core/util';
import { STORAGE_USER_TOKEN } from './core/config';
directive(Vue);
component(Vue);

Vue.use(Tab);
Vue.use(Transition);

Vue.config.productionTip = false

!getLocalStorage(STORAGE_USER_TOKEN) && setLocalStorage(STORAGE_USER_TOKEN, uuid())

router.beforeEach((to:any, from:any, next:any) => {
	window.scrollTo(0, 0);
	next()
});

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
		// You'll need this for renderAfterDocumentEvent.
		document.dispatchEvent(new Event('custom-render-trigger'));
	}
}).$mount('#app')
