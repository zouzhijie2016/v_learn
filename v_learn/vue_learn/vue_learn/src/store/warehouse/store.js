import * as types from '../mutation-types'

const state = {
    myProperty: '111'
}

const mutations = {
    [types.WH_TEST_PROPERTY] (state, value) {
        state.myProperty = value
    }
}

const actions = {}

const getters = {}

export default {
    state,
    getters,
    actions,
    mutations
}
