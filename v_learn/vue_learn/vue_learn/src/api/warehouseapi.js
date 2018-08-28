import Util from './index'

export default {
    async getUserPermission () {
        const result = await Util.post('/warehouse/control/userPermission')
        return result
    },
    async getProductList (data) {
        const result = await Util.post('/warehouse/control/queryProduct', data)
        return result
    },
    async getIMEIProduct (data) {
        const result = await Util.post('/warehouse/control/queryProduct', data)
        return result
    },
    async findIMEIWithProductIdLog (data) {
        const result = await Util.post('/api/warehouse/v1/inventoryItem/findIMEIWithProductIdLog', data)
        return result
    },
    async queryTransferData (data) {
        const result = await Util.post('/api/warehouse/v1/inventoryTransfer/queryTransferData', data)
        return result
    },
    // async findProductByImei (data) {
    //     const result = await Util.post('/api/warehouse/v1/inventoryItem/findProductByImei', data)
    //     return result
    // },
    findProductByImei: Util.createClass({
        method: 'post',
        url: '/api/warehouse/v1/inventoryItem/findProductByImei'
    }),
    updateIMEIProductId: Util.createClass({
        method: 'post',
        url: '/api/warehouse/v1/inventoryItem/updateIMEIProductId'
    }),
    // async updateIMEIProductId (data) {
    //     const result = await Util.post('/api/warehouse/v1/inventoryItem/updateIMEIProductId', data)
    //     return result
    // },
    // async findProductModelByKeyword (data) {
    //     const result = await Util.post('/api/product/v1/product/findProductModelByKeyword', data)
    //     return result
    // },
    findProductModelByKeyword: Util.createClass({
        method: 'post',
        url: '/api/product/v1/product/findProductModelByKeyword'
    }),
    /*
    * new inventory log
    * */
    async findInventoryItemDetailsByCondition (data) {
        const result = await Util.post('/api/warehouse/v1/inventoryItem/findInventoryItemDetailsByCondition', data)
        return result
    },
    /*
    * require inventory
    * */
    async createInventoryRequieApplication (data) {
        const result = await Util.post('/api/store/v1/inventory-require/create-inventory-requie-application', data)
        return result
    },
    async currentUser () {
        const result = await Util.post('/api/store/v1/inventory-require/current-user')
        return result
    },
    async queryProduct (data) {
        const result = await Util.post('/api/store/v1/inventory-require/query-product', data)
        return result
    },
    async listShopMgr (data) {
        const result = await Util.post('/api/store/v1/inventory-require/list-shop-mgr', data)
        return result
    },
    async findInventoryRequieApplication (data) {
        const result = await Util.post('/api/store/v1/inventory-require/find-inventory-requie-application', data)
        return result
    },
    async updateInventoryRequieApplication (data) {
        const result = await Util.post('/api/store/v1/inventory-require/update-inventory-requie-application', data)
        return result
    },
    async deleteInventoryRequieApplication (data) {
        const result = await Util.post('/api/store/v1/inventory-require/delete-inventory-requie-application', data)
        return result
    },
    async withdrawApplication (data) {
        const result = await Util.post('/api/store/v1/inventory-require/withdraw-application', data)
        return result
    },
    async toApproveByMgr (data) {
        const result = await Util.post('/api/store/v1/inventory-require/to-approve-by-mgr', data)
        return result
    },
    async auditAppByMgr (data) {
        const result = await Util.post('/api/store/v1/inventory-require/audit-app-by-mgr', data)
        return result
    },
    async toApproveByKeeper (data) {
        const result = await Util.post('/api/store/v1/inventory-require/to-approve-by-keeper', data)
        return result
    },
    async auditAppByKeeper (data) {
        const result = await Util.post('/api/store/v1/inventory-require/audit-app-by-keeper', data)
        return result
    },
    findBrandList: Util.createClass({
        method: 'post',
        url: '/api/product/v1/brandController/findBrandList'
    }),
    queryAllModel: Util.createClass({
        method: 'post',
        url: '/api/product/v1/product/queryAllModel'
    }),
    findImeiProductByConditions: Util.createPageClass({
        method: 'post',
        url: '/api/warehouse/v1/ImeiManage/findImeiProductByConditions'
    }),
    exportImeiProductByConditions: Util.createClass({
        method: 'getDownloadPost',
        url: '/api/warehouse/v1/ImeiManage/exportImeiProductByConditions'
    }),
    async getRequirePermission () {
        const result = await Util.post('/warehouse/control/getRequirePermission')
        return result
    },
    async quaryInvLog (data) {
        const result = await Util.post('/api/warehouse/v1/inventoryItem/quaryInvLog', data)
        return result
    },
    async whoseHavingInv () {
        const result = await Util.get('/api/workflow/v1/account-checking/whose-having-inv')
        return result
    },
    async checkUserHasStoreManage () {
        const result = await Util.get('/warehouse/control/checkUserHasStoreManage')
        return result
    }
}

