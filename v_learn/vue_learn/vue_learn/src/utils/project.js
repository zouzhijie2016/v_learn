import * as mutationTypes from '~store/mutation-types'
import * as piwikHelper from './custom/piwikhelper'
import lodashApi from './thirdparty/lodash'

let jumpLogin = () => {
    if (process.env.NODE_ENV === 'development') {
        location.href = '/user_web/index.html#login'
    } else {
        location.href = '/'
    }
}

let globalVueMixin = {
    beforeRouteEnter (to, from, next) {
        next(vm => {
            if (vm.$store) {
                vm.$store.commit(mutationTypes.UPDATE_SELECTED_URL, vm.selectedUrl || to.path)
                piwikHelper.TrackPageView(vm.$route)
            }
        })
    }
}

let isFunction = (f) => typeof f === 'function'
let callFunction = (f, ...args) => {
    try {
        isFunction(f) && f.apply(this, args)
    } catch (e) {}
}
let isContractObject = (f) => f && typeof f === 'object' && f.listApi && f.pageApi
/**
 * 为了兼容旧的Api非instance实例
 * @param api api函数或Class
 * @returns {*}
 */
let getExecuteMethod = (api) => {
    if (api && isFunction(api.getInstance) && api.getInstance().execute) {
        return api.getInstance().execute
    }
    return api
}
/**
 * 调用分页Api通用函数；pageChoice字段为通用约定字段,值只允许为其中之一{List1:,All:0,Page:-1}
 * @param listApi  Promise Api
 * @param param   查询条件参数，isOnlyList为标识字段：true为只需要list数据即可，false为list与page数据
 *                               tailPath 为尾部url path端，不传入为空值.
 * @param success 列表查询成功后回调
 * @returns {*}
 */
let getCommonPageListApi = function (listApi, param = {}, success) {
    if (!isFunction(listApi) && !isContractObject(listApi)) {
        return Promise.reject({message: 'Expected  Invalid Api Arguments', success: false, data: ''})
    }
    let pageApi = listApi
    if (isContractObject(listApi)) {
        pageApi = listApi.pageApi
        listApi = listApi.listApi
    }

    let isOnlyList = !!param.isOnlyList
    if (param.hasOwnProperty('isOnlyList')) {
        delete param.isOnlyList
    }
    // 尾部的url
    let tailPath = param.tailPath || ''
    if (param.hasOwnProperty('tailPath')) {
        delete param.tailPath
    }
    let listPromise = getExecuteMethod(listApi)(Object.assign({}, param, {pageChoice: 1}), {tailPath}).then((d) => {
        d.success && callFunction(success, d)
        return d
    })
    let allPromise = [listPromise]
    if (!isOnlyList) {
        allPromise.push(getExecuteMethod(pageApi)(Object.assign({}, param, {pageChoice: -1}), {tailPath}))
    }
    return Promise.all(allPromise.map(p => p.then(value => value, reason => reason))).then(r => {
        r.forEach(d => {
            !d.success && this.$showErrorMessage(d)
        })
        return r
    })
}

let showErrorMessage = function (err, duration = 3, isForce = false) {
    let message = typeof err === 'object' && err !== null ? err.message : err

    if (isForce || !(err && err.isCancel)) {
        if (err && err.noLogin == true) {
            return false
        }
        this.$message({
            showClose: true,
            message: message || 'Service Exceptions！',
            type: 'error',
            duration: duration * 1000
        })
    }
}

let showSuccessMessage = function (message, duration = 3) {
    this.$message({
        showClose: true,
        message: message || 'Successful Operation！',
        type: 'success',
        duration: duration * 1000
    })
}

let showInfoMessage = function (message, duration = 3) {
    this.$message({
        showClose: true,
        message: message || 'Operation Tips！',
        type: 'info',
        duration: duration * 1000
    })
}

export default {
    install (Vue) {
        Vue.jumpLogin = jumpLogin
        Vue.prototype.jumpLogin = jumpLogin
        Vue.prototype.$getCommonPageListApi = getCommonPageListApi
        Vue.prototype.$showErrorMessage = showErrorMessage
        Vue.prototype.$showSuccessMessage = showSuccessMessage
        Vue.prototype.$showInfoMessage = showInfoMessage

        Vue.mixin(globalVueMixin)
    }
}
