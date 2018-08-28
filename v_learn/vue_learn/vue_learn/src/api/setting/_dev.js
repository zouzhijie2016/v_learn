/**
 * Created by qinghua.gong on 2017/12/6.
 */
import Util from './../index'

export default {
    async loadCloudInstances () {
        const result = await Util.get('/api/security/v1/loadPermission/loadCloudInstances')
        return result
    },
    async reFlushUrlMappings (data) {
        const result = await Util.post('/api/security/v1/loadPermission/reFlushUrlMappings', data)
        return result
    },
    async getDBaccessCheckList (data) {
        const result = await Util.post('/api/security/v1/accessCheck/select', data)
        return result
    },
    async getDBpermissionAccessList (data) {
        const result = await Util.post('/api/security/v1/permissionAccess/select', data)
        return result
    },
    async getDBpermissionTreeList (data) {
        const result = await Util.post('/api/security/v1/permissionTree/select', data)
        return result
    },
    async changeEnable (data) {
        const result = await Util.post('/api/security/v1/access_check/changeEnable', data)
        return result
    },
    async getDBWebNavList (data) {
        const result = await Util.post('/api/security/v1/webnav/select', data)
        return result
    },
    async getDBWebNavPermissionList (data) {
        const result = await Util.post('/api/security/v1/web_nav_permission/select', data)
        return result
    },
    async getDBAppConfigList (data) {
        const result = await Util.get('/api/security/v1/app-configuration/list', data)
        return result
    },
    async getAppConfig (data) {
        const result = await Util.get('/api/security/v1/app-configuration/getAppConfig', data)
        return result
    },
    async updateAppConfiguration (data) {
        const result = await Util.post('/api/security/v1/app-configuration/updateAppConfiguration', data)
        return result
    }

}
