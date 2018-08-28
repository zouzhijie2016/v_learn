/**
 * Created by qinghua.gong on 2017/11/21.
 */
import Util from './../index'

export default {
    async isExistShipPermission () {
        const result = await Util.post('/api/shipment/v1/shipment/isExistShipPermission')
        return result
    },
    async getWarehousePermission () {
        const result = await Util.post('/api/shipment/v1/shipment/queryWarehousePermission')
        return result
    },
    async getShippingNeedOrder (data) {
        const result = await Util.post('/api/shipment/v1/shipment/queryShippingNeedOrder', data)
        return result
    },
    async getShippingPackageDetail (data) {
        const result = await Util.post('/api/shipment/v1/shipment/queryShipmentPackageDetail', data)
        return result
    },
    async getSaleShop () {
        const result = await Util.post('/api/shipment/v1/shipment/querySaleShop')
        return result
    },
    async getPendingPack (data) {
        const result = await Util.post('/api/shipment/v1/shipment/queryPaidOrder', data)
        return result
    },
    async getFacility () {
        const result = await Util.post('/api/shipment/v1/shipment/queryFacility')
        return result
    },
    async insertPack (data) {
        const result = await Util.post('/api/shipment/v1/shipment/markAsPack', data)
        return result
    },
    async getInitPackedOrder (data) { // id
        const result = await Util.post('/api/shipment/v1/shipment/queryInitPackedOrder', data)
        return result
    },
    async getPackedCompleteOrder (data) { // orderId
        const result = await Util.post('/api/shipment/v1/shipment/queryPackedCompleteOrder', data)
        return result
    },
    async getShipmentPackageListDetail (data) {
        const result = await Util.post('/api/shipment/v1/shipment/queryShipmentPackageListDetail', data)
        return result
    },
    async getPackedShipOrder (data) {
        const result = await Util.post('/api/shipment/v1/shipment/queryPackedShipOrder', data)
        return result
    },
    async getDriver (data) {
        const result = await Util.post('/api/shipment/v1/shipment/queryDriver', data)
        return result
    },
    async getShipmentPackageDetail (data) {
        const result = await Util.post('/api/shipment/v1/shipment/queryShipmentPackageDetail', data)
        return result
    },
    async getPackageOnTheWay (data) {
        const result = await Util.post('/api/shipment/v1/shipment/queryPackageOnTheWay', data)
        return result
    },
    async markAsComplete (data) {
        const result = await Util.post('/api/shipment/v1/shipment/markAsComplete', data)
        return result
    },
    async markAsShipped (data) {
        const result = await Util.post('/api/shipment/v1/shipment/markAsShipped', data)
        return result
    }
}

