import apiUtil from './index'

export default {
    async userLogin (data) {
        const result = await apiUtil.post('/commondefine/control/login', data)
        return result
    },
    userLoginModel: apiUtil.createClass({
        method: 'post',
        url: '/commondefine/control/login'
    }),
    userLoginModelV1: apiUtil.createClass({
        method: 'post',
        url: '/api/security/v1/login/login'
    }),
    async getLoginVueInfo(scope, data){
        const result = await apiUtil.get(`/api/security/v1/security/getLoginVueInfo/${scope}`, data)
        return result
    }
}
