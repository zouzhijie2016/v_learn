import Vue from 'vue'
import Vuex from 'vuex'
import commonStore from '../common/store'
import WareHouse from './store'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    ...commonStore,
    modules: {
        WareHouse
    },
    strict: debug
})
