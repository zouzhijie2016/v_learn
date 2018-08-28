import CommonApi from '~api/commonapi'
import * as types from '../mutation-types'
import secondList from './secondDatasList.js'

const state = {
    timeNow: 0,
    zoneOffset: 0,
    currentTime: '',
    timeZoneArea: '',
    userName: '',
    commonInfo: {},
    selectedUrl: '',
    navTrees: [],
    systemSettingsUomid: '',
    totalTransferMessage: 0,
    totalIncomeMessage: 0,
    totalAuditMessage: 0
}

const mutations = {
    [types.UPDATE_COMMON_INFO] (state, value) {
        state.commonInfo = value
    },
    [types.UPDATE_USER_NAME] (state, value) {
        state.userName = value
    },
    [types.UPDATE_TIME_NOW] (state, value) {
        state.timeNow = value
    },
    [types.UPDATE_ZONE_OFFSET] (state, value) {
        state.zoneOffset = value
    },
    [types.UPDATE_CURRENT_TIME] (state, value) {
        state.currentTime = value
    },
    [types.UPDATE_TIME_ZONE_AREA] (state, value) {
        state.timeZoneArea = value
    },
    [types.UPDATE_TIME_ZONE_AREA] (state, value) {
        state.timeZoneArea = value
    },
    [types.UPDATE_SELECTED_URL] (state, value) {
        state.selectedUrl = value
    },
    [types.TOTAL_TRANSFER_MESSAGE] (state, value) {
        state.totalTransferMessage = value
    },
    [types.TOTAL_INCOME_MESSAGE] (state, value) {
        state.totalIncomeMessage = value
    },
    [types.TOTAL_AUDIT_MESSAGE] (state, value) {
        state.totalAuditMessage = value
    },
    [types.SESTEM_SETTINGS_UOMID] (state, value) {
        state.systemSettingsUomid = value
    },
    [types.UPDATE_NAV_TREES] (state, value) {
        state.navTrees = value
    }
}
const actions = {
    getLoginUserInfo ({commit}) {
        return CommonApi.getLoginUserInfo().then(d => {
            if (d.success) {
                // d.orderNavInfo = secondList.orderNavInfo
                // d.reportNavInfo = secondList.reportNavInfo
                d.storeNavInfo = secondList.storeNavInfo
                // d.warehouseNavInfo.childNode = d.warehouseNavInfo.childNode.concat(secondList.warehouseShippingNavInfo)
                commit(types.UPDATE_COMMON_INFO, d)
                commit(types.UPDATE_USER_NAME, d.userLogin.userLoginId)
                commit(types.UPDATE_TIME_NOW, d.timeNow)
                commit(types.UPDATE_ZONE_OFFSET, d.rawOffset)
                commit(types.UPDATE_CURRENT_TIME, d.currenttime)
                commit(types.UPDATE_TIME_ZONE_AREA, d.timeZoneId)
                commit(types.SESTEM_SETTINGS_UOMID, d.SystemSettingsUomid)

                return d
            } else {
                return Promise.reject(d)
            }
        })
    },
    initState ({commit}, res) {
        if (res.success) {
            let data = res.data
            commit(types.UPDATE_COMMON_INFO, data)
            commit(types.UPDATE_USER_NAME, data.userLoginId)
            commit(types.UPDATE_TIME_NOW, data.timeNow)
            commit(types.UPDATE_ZONE_OFFSET, data.rawOffset)
            commit(types.UPDATE_CURRENT_TIME, data.currentTime)
            commit(types.UPDATE_TIME_ZONE_AREA, data.timeZone)
            commit(types.SESTEM_SETTINGS_UOMID, data.SystemSettingsUomid)
            data.navTrees.forEach(item=>{
                item.selected = false;
            })
            commit(types.UPDATE_NAV_TREES, data.navTrees)
        } else {

        }

        return 'dsadasd'
    }
}

const getters = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
