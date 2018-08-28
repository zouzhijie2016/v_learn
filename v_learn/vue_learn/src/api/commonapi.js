import apiUtil from './index'

export default {
    async loginOut () {
        const result = await apiUtil.post('/commondefine/control/logout')
        return result
    },
    async getLoginUserInfo (data) {
        const result = await apiUtil.post('/commondefine/control/getloginUserInfo', data)
        return result
    },
    async updateNewPassword (data) {
        const result = await apiUtil.postUrl('/partymgr/control/newUpdatePassword', data)
        return result
    },
    async getSettingPermission () {
        const result = await apiUtil.post('/api/store/v1/storeSetting/queryStoreSettingPremission')
        return result
    },
    async getVueInfo (data) {
        const result = await apiUtil.post('/commondefine/control/getVueInfo',data)
        // const result = await apiUtil.post('/api/security/v1/security/getVueInfo', data)
        return result
    },
    async getAllVueInfo () {
        const result = await apiUtil.get('/api/security/v1/security/getAllVueInfo')
        // const result = await apiUtil.post('/api/security/v1/security/getVueInfo', data)
        return result
    }

}
