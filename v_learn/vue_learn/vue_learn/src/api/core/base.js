/**
 * Api Base Class
 * Handle Common Logic
 */
import Axios from 'axios'
import ApiUtil from './request'
import autoBind from '~utils/thirdparty/autobind'
import _ from '~utils/thirdparty/lodash'

function createClass (setting) {
    if (!setting || !setting.url) {
        throw new Error('Incorrect API Configuration')
    }
    return class ApiModel {
        constructor () {
            Object.assign(this, {
                method: 'post',
                url: '',
                _cancelToken: null
            }, _.cloneDeep(setting))
            autoBind(this)
        }

        execute (data = {}, options = {}) {
            if (this.checkProcess()) {
                this.abort()
            }
            this._cancelToken = this.createCancelToken()
            options.cancelToken = this._cancelToken
            return ApiUtil[this.method](options.tailPath ? `${this.url}/${options.tailPath}` : this.url, data, options).then(result => {
                return result
            }).catch(err => {
                if (Axios.isCancel(err)) {
                    err.isCancel = true
                    err.message = 'Cancellation request'
                }
                return Promise.reject(err)
            })
        }

        checkProcess () {
            return !!this._cancelToken
        }

        destoryToken () {
            this._cancelToken = null
        }

        createCancelToken () {
            return Axios.CancelToken.source()
        }

        /**
         * 单例构造实例函数，统一处理当前函数多次token构造
         * @returns {*}
         */
        static getInstance () {
            return this.instance ? this.instance : this.instance = new this()
        }

        abort () {
            if (this._cancelToken) {
                this._cancelToken.cancel()
                this.destoryToken()
            }
        }
    }
}

function createPageClass (setting) {
    let result = {
        listApi: createClass(_.cloneDeep(setting)),
        pageApi: createClass(_.cloneDeep(setting))
    }
    let apiNameArr = Object.keys(result)
    result.abort = () => {
        apiNameArr.forEach(api => {
            api.getInstance().abort()
        })
    }
    return result
}

export {
    createClass,
    createPageClass
}

