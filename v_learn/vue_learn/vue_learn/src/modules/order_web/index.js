import Vue from 'vue'
import util from '~utils/index'
import vueRouter from 'vue-router'
import routes from './router'
import app from './app.vue'
import store from '~store/index'
import '~api/index'
import '~components/index'

Vue.use(vueRouter)
let router = new vueRouter({
    routes
})

store.dispatch('getLoginUserInfo').then(function () {
    util.LoadPiwikScript(store.state.commonInfo)
    new Vue({
        el: '#app',
        router,
        store,
        render: h => h(app)
    })
}, err => {
    window.NProgress.done()
    if (err.errCode && (err.errCode > 50000 || err.errCode < 50100)) {
        Vue.jumpLogin()
    } else {
        new Vue({
            el: '#app',
            render: h => h('g-serviceerror', {
                props: {
                    error: err
                }
            })
        })
    }
})

