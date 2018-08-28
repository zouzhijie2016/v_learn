import commApi from './index'

export default {
    async getDataCenters () {
        const date = await commApi.get('/v1/catalog/datacenters')
        return date
    },
    async getNodes (params) {
        const date = await commApi.get('/v1/catalog/nodes', params)
        return date
    },
    async getNode (node, params) {
        const date = await commApi.get('/v1/catalog/node/' + node, params)
        return date
    },
    async getServices (params) {
        const date = await commApi.get('/v1/catalog/services', params)
        return date
    },
    async getService (service, params) {
        const date = await commApi.get('/v1/catalog/service/' + service, params)
        return date
    },
    async getHealthServices (service, params) {
        const date = await commApi.get('/v1/health/service/' + service, params)
        return date
    },
    async getAuthenticatorVerify () {
        const date = await commApi.get('/authenticator/verify')
        return date
    },
    async getAuthenticatorLogin (params) {
        const date = await commApi.get('/authenticator/login', params)
        return date
    },
    async verifyDcCenter (params) {
        const date = await commApi.get('/verifyDcCenter', params)
        return date
    },
    async handleDcCenterChange (params) {
        const date = await commApi.get('/handleDcCenterChange', params)
        return date
    },
    async handleSecurityList (params) {
        const date = await commApi.get('/__securityList', params)
        return date
    },
    async handleVueCheckList (params) {
        const date = await commApi.post('/api/security/v1/vueCheck/select', params)
        return date
    }

}
