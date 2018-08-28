/**
 * Created by qinghua.gong on 2017/10/26.
 */
import Util from './../index'

export default {
    async getUserPermission () {
        const result = await Util.post('/warehouse/control/userPermission')
        return result
    },
    async getProductTypeList () {
        const result = await Util.post('/api/warehouse/v1/inventoryItem/queryProductType')
        return result
    },
    async getProductList (data) {
        const result = await Util.post('/api/warehouse/v1/inventoryItem/queryProduct', data)
        return result
    },
    async getFacilityList () {
        const result = await Util.post('/api/warehouse/v1/inventoryItem/queryFacility')
        return result
    },
    async getInventoryItemDetailList (data) {
        const result = await Util.post('/api/warehouse/v1/inventoryItem/findInventoryItemDetail', data)
        return result
    },
    async getLotList (data) {
        const result = await Util.post('/api/warehouse/v1/inventoryItem/queryLots', data)
        return result
    },
    async getInventoryItemList (data) {
        const result = await Util.post('/api/warehouse/v1/inventoryItem/findInventoryItem', data)
        return result
    }

}

