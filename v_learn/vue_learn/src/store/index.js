// import Vue from 'vue'
// import Vuex from 'vuex'
// import * as actions from './actions'
// import * as getters from './getters'
// import state from './state'
// import mutations from './mutations'
// import warehouse from './modules/warehouse'
//
// Vue.use(Vuex)
//
// const debug = process.env.NODE_ENV !== 'production'
//
// export default new Vuex.Store({
//     actions,
//     getters,
//     state,
//     mutations,
//     modules: {
//         warehouse
//     },
//     strict: debug
// })
import commonStoreInstance from './common/index'
export default commonStoreInstance
