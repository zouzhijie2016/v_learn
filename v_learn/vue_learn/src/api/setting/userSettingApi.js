/**
 * Created by qinghua.gong on 2017/12/6.
 */
import Util from './../index'

export default {
    async findUserByConditions (data) {
        const result = await Util.post('/api/security/v1/UserPartyController/findUserByConditions', data)
        return result
    },
    async findUserByUserId (data) {
        const result = await Util.post('/api/security/v1/UserPartyController/findUserByUserId', data)
        return result
    },
    async findUserByUserId (data) {
        const result = await Util.post('/api/security/v1/UserPartyController/findUserByUserId', data)
        return result
    },
    async findAllRole (data) {
        const result = await Util.post('/api/security/v1/role/queryRoleAll', data)
        return result
    },
    async findAllCompany () {
        const result = await Util.post('/api/party/v1/company/findCompanies')
        return result
    },
    async findAllFacilityMsg () {
        const result = await Util.post('/api/security/v1/UserPartyController/findAllFacilityMsg')
        return result
    },
    async findAllStoreMsg () {
        const result = await Util.post('/api/security/v1/UserPartyController/findAllStoreMsg')
        return result
    },
    async searchAllGroups () {
        const result = await Util.post('/api/security/v1/UserPartyController/searchAllGroups')
        return result
    },
    async createUser (data) {
        const result = await Util.post('/api/security/v1/UserPartyController/createUser', data)
        return result
    },
    async updateUserEnabled (data) {
        const result = await Util.post('/api/security/v1/UserPartyController/updateUserEnabled', data)
        return result
    }

}

