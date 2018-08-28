import Util from './index'

export default {
    async getShipFacilityByStoreId (data) {
        const result = await Util.get('/api/store/v1/storeFacilityController/findShipFacilityByStoreId', data)
        return result
    },
    async delShipFacilityByFacilityId (data) {
        const result = await Util.post('/api/store/v1/storeFacilityController/deleteShipFacility', data)
        return result
    },
    async insertShipFacilityByBatch (data) {
        const result = await Util.post('/api/store/v1/storeFacilityController/insertShipFacilityByBatch', data)
        return result
    },
    async getAllFacility (data) {
        const result = await Util.post('/api/warehouse/v1/facilityMsgController/findAllFacilityMsg', data)
        return result
    },
    async getStoreMsgByStoreId (storeId) {
        const result = await Util.get('/api/store/v1/productStoreController/findStoreMsgByStoreId/' + storeId, {})
        return result
    }

}

