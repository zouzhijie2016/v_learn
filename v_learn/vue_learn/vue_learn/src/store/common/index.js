import Vue from 'vue'
import Vuex from 'vuex'
import commonStore from './store'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    ...commonStore,
    strict: debug
})
