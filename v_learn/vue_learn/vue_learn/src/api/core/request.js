import Vue from 'vue'
import Axios from 'axios'
import {stringify} from 'qs'
import loginDialog from './loginDialog.vue'
import ElementUI from '~components/element-index'
Vue.use(ElementUI)
let LoginDialog = Vue.extend(loginDialog)

let nullF = () => {}
const globalConfig = {
    headers: {
        post: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        get: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    },
    xsrfCookieName: 'U_TOKEN',
    xsrfHeaderName: 'X_USER_TOKEN',
    timeout: 30000
}
Object.assign(Axios.defaults, globalConfig)
Axios.interceptors.request.use(config => {
    return config
}, error => Promise.reject(error))
Axios.interceptors.response.use(res => res, handleAllException)

function handleAllException (err) {
    err.success = false
    err.status = 0
    err.message = err.message || 'Service Exceptions'

    if (err.response) {
        let res = err.response
        err.message = res.statusText
        if (res.data && res.data.message) {
            err.message = res.data.message
        }
        err.noLogin = getErrorMessage(res);
        err.status = err.response.status
    }

    if(err && err.noLogin == true){
        showLoginDialog(err.message);
    }

    return Promise.reject(err)
}

function getErrorMessage(res) {
    if(res.data && (res.data.errCode > 50000 &&  res.data.errCode < 50100)){
        return true
    }else{
        return false
    }
}

function getResponseData (res) {
    return res.data
}

function getCancelToken (data = {}) {
    var cancelToken = data.cancelToken
    if (data.cancelToken) {
        delete data.cancelToken
    }
    return cancelToken ? cancelToken.token : null
}

function showLoginDialog(message) {
    if(!document.body.querySelector('#loginDialog')){
        let instance = new LoginDialog({
            data: {
                dialogForm: {
                    userName: document.body.querySelector('#userName').value || '',
                    message : message || ''
                }
            }
        })
        instance.vm = instance.$mount()
        document.body.appendChild(instance.vm.$el)
    }
}

export default {
    post (url, data = {}, options = {}) {
        return Axios({
            method: 'post',
            url,
            data: data || {},
            cancelToken: getCancelToken(options)
        }).then(getResponseData)
    },
    postUrl (url, data = {}, options = {}) {
        return Axios({
            method: 'post',
            url,
            data: stringify(data || {}),
            cancelToken: getCancelToken(options),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(getResponseData)
    },
    get (url, params = {}, options = {}) {
        return Axios({
            method: 'get',
            url,
            params: params || {},
            cancelToken: getCancelToken(options)
        }).then(getResponseData)
    },
    getDownload (url, params = {}, options = {}) {
        return Axios({
            method: 'get',
            url,
            params: params || {},
            cancelToken: getCancelToken(options),
            responseType: 'blob',
            timeout: 100 * 1000,
            maxContentLength: 1000,
            onDownloadProgress: options.progress || nullF
        })
    },
    getDownloadPost (url, data = {}, options = {}) {
        return Axios({
            method: 'post',
            url,
            data: data || {},
            cancelToken: getCancelToken(options),
            responseType: 'blob',
            timeout: 100 * 1000,
            maxContentLength: 1000,
            onDownloadProgress: options.progress || nullF
        })
    },
    postFormData (url, data = {}) {
        return Axios({
            method: 'post',
            url,
            data: data || {},
            cancelToken: getCancelToken(data),
            cache: false,
            contentType: false,
            processData: false
        }).then(getResponseData)
    }
}
