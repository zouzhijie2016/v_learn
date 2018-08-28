/**
 * Created by qinghua.gong on 2017/12/6.
 */
import Util from './../index'

export default {
    async queryAllStoresByConditions (data) {
        const result = await Util.post('/api/store/v1/storeSetting/queryAllStoresByConditions', data)
        return result
    },
    async getAllFacility (data) {
        const result = await Util.post('/api/warehouse/v1/facilityMsgController/findAllFacilityMsg', data)
        return result
    },
    async getAllSalesChannel (data) {
        const result = await Util.post('/api/store/v1/storeSetting/querySaleChannels', data)
        return result
    },
    async createStore (data) {
        const result = await Util.postFormData('/api/store/v1/storeSetting/createStore', data)
        return result
    },
    async isExist (data) {
        const result = await Util.post('/api/store/v1/storeSetting/isExist', data)
        return result
    },
    async queryAddressInfo () {
        const result = await Util.post('/api/store/v1/storeSetting/queryAddressInfo')
        return result
    },
    async queryStoreGroup (data) {
        const result = await Util.post('/api/store/v1/storeSetting/queryStoreGroup', data)
        return result
    },
    async queryStoreInfoByID (data) {
        const result = await Util.post('/api/store/v1/storeSetting/queryStoreInfoByID', data)
        return result
    },
    async updateStore (data) {
        const result = await Util.post('/api/store/v1/storeSetting/updateStore', data)
        return result
    }

}

