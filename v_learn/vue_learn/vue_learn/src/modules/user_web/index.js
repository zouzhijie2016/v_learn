import Vue from 'vue'
import '~utils/index'
import vueRouter from 'vue-router'
import store from '~store/index'
import routes from '~user-modules/router'
import App from '~user-modules/app.vue'
import '~api/index'
import '~components/index'

Vue.use(vueRouter)
let router = new vueRouter({
    routes
})

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
