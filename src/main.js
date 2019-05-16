import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLightbulb, faSkullCrossbones, faLock, faSearch, faCog} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueSweetalert2 from 'vue-sweetalert2';

library.add(faLightbulb, faSkullCrossbones, faLock, faSearch, faCog)

Vue.use(VueSweetalert2)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

require("./assets/main.scss")

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
