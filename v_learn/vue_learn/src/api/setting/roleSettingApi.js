/**
 * Created by qinghua.gong on 2017/12/6.
 */
import Util from './../index'

export default {
    async queryRoleList (data) {
        const result = await Util.post('/api/security/v1/role/queryRoleList', data)
        return result
    },
    async createRole (data) {
        const result = await Util.post('/api/security/v1/role/createRole', data)
        return result
    },
    async isExistName (data) {
        const result = await Util.postFormData('/api/security/v1/role/isExistName', data)
        return result
    },
    async queryPermissionTree () {
        const result = await Util.post('/api/security/v1/role/queryPermissionTree')
        return result
    },
    async querySingleRole (data) {
        const result = await Util.post('/api/security/v1/role/querySingleRole', data)
        return result
    },
    async queryCurrentCompany () {
        const result = await Util.post('/api/security/v1/role/queryCurrentCompany')
        return result
    },
    async querySingleRoleAccessCheck (data) {
        const result = await Util.post('/api/security/v1/role/querySingleRoleAccessCheck', data)
        return result
    },
    async updateRole (data) {
        const result = await Util.post('/api/security/v1/role/updateRole', data)
        return result
    }
}

