import Util from './index'

export default {
    async getStoreData () {
        const result = await Util.post('/api/order/v1/order/findAvailableStore')
        return result
    },
    async getReturnSalesByCondition (data) {
        const result = await Util.post('/api/order/v1/order/getReturnOrderList', data)
        return result
    },
    async getReturnSalesByOrderId (data) {
        const result = await Util.post('/api/order/v1/order/getReturnOrderDetailList', data)
        return result
    },
    // create return item
    async getReturnReasonList () {
        const result = await Util.post('/api/order/v1/order/getReturnReasonList')
        return result
    },
    async findOrderCurrency () {
        const result = await Util.post('/api/order/v1/order/findOrderCurrency')
        return result
    },
    async getReturnResponsiblePartyList () {
        const result = await Util.post('/api/order/v1/order/getReturnResponsiblePartyList')
        return result
    },
    async selectReturnItems (data) {
        const result = await Util.post('/api/order/v1/order/selectReturnItems', data)
        return result
    },
    async createReturnSaleOrder (data) {
        const result = await Util.post('/api/order/v1/order/creatReturnSaleOrder', data)
        return result
    },
    async findOrderByImei (data) {
        const result = await Util.post('/api/order/v1/order/findOrderByImei', data)
        return result
    },
    async findOrderByOrderId (data) {
        const result = await Util.post('/api/order/v1/order/findOrderByOrderId', data)
        return result
    },
    async findYWShopCartByOrderId (data) {
        const result = await Util.post('/api/order/v1/order/findYWShopCartByOrderId', data)
        return result
    },
    async cancelOrder (data) {
        const result = await Util.post('/api/order/v1/order/cancelOrder', data)
        return result
    },
    async queryShippingDetailOrder (data) {
        const result = await Util.post('/api/shipment/v1/shipment/queryShippingDetailOrder', data)
        return result
    },
    async checkCancelOrderPremission (data) {
        const result = await Util.post('/api/order/v1/order/checkCancelOrderPremission', data)
        return result
    },
    async findActiveProductBykeyWord (data) {
        const result = await Util.post('/api/product/v1/product/findActiveProductBykeyWord', data)
        return result
    },
    async findSaleStore (data) {
        const result = await Util.post('/api/order/v1/order/findSaleStore', data)
        return result
    },
    async findPersonByUserName (data) {
        const result = await Util.post('/api/order/v1/order/findPersonByUserName', data)
        return result
    },
    async findSaleOrderListV3 (data) {
        const result = await Util.post('/api/order/v1/order/findSaleOrderListV3', data)
        return result
    }
}

