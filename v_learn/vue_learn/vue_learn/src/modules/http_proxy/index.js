import Vue from 'vue'
import '~utils/index'
import Vueg from 'vueg'
import VueCookie from 'vue-cookie'
import Meta from 'vue-meta'
import VueRouter from 'vue-router'
import VueProgressBar from 'vue-progressbar'
import CxltToastr from 'cxlt-vue2-toastr'
import store from '~store/index'
import '~api/index'
import '~components/index'
import Routers from './router.js'
import App from './app.vue'

import securityPlugin from '~utils/plugins/securityplugin/security_plugin'

console.log(securityPlugin)

// import 'element-ui/lib/theme-default/index.css'
// import 'nprogress/nprogress.css'
// import 'toastr/build/toastr.min.css'
// import 'vueg/css/transition-min.css'

Vue.use(VueCookie)
Vue.use(VueRouter)
Vue.use(Meta)

const options = {
    color: '#bffaf3',
    failedColor: '#874b4b',
    thickness: '5px'
}

Vue.use(VueProgressBar, options)

var toastrConfigs = {
    position: 'top right',
    showDuration: 2000
}
Vue.use(CxltToastr, toastrConfigs)

const RouterConfig = {
    routes: Routers
}
const router = new VueRouter(RouterConfig)

Vue.use(Vueg, router)

const app = new Vue({
    router,
    store,
    render: h => h(App)
})

app.$mount('#app')
