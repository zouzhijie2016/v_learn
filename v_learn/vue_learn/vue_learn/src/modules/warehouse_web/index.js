import Vue from 'vue'
import util from '~utils/index'
import VueRoute from 'vue-router'
import routes from './router'
import app from './app.vue'
import store from '~store/warehouse/index'
import '~api/index'
import '~components/index'

import securityPlugin from '~utils/plugins/securityplugin/security_plugin'
import _commonapi from '~api/commonapi'

Vue.use(VueRoute)
let router = new VueRoute({
    routes
})

let startObj = {}
startObj.applicationName = 'warehouse_web'
_commonapi.getVueInfo(startObj)
    .then(function (res) {
        if (res.success) {
            let resData = res.data
            Vue.use(securityPlugin, {router: router, roleList: resData.userRoles, permissions: resData.permission})
            util.LoadPiwikScriptV2(resData)
            store.dispatch('initState', res).then(function () {
                new Vue({
                    el: '#app',
                    router,
                    store,
                    render: h => h(app)
                })
            })
        } else {
            if (res.errCode && (res.errCode > 50000 || res.errCode < 50100)) {
                Vue.jumpLogin()
            } else {
                new Vue({
                    el: '#app',
                    render: h => h('g-serviceerror', {
                        props: {
                            error: res.message
                        }
                    })
                })
            }
        }
    })
    .catch(function (e) {
        window.NProgress.done()
        console.log(arguments)
        Vue.jumpLogin()
    })
