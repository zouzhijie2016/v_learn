import Util from './index'

export default {
    async getStoreGroupListData () {
        const result = await Util.post('/api/order/v1/returnReport/storeList')
        return result
    },
    async getProductEanOrImeiData (data) {
        const result = await Util.post('/api/order/v1/returnReport/relatedInfo', data)
        return result
    },
    async getReturnReportByCondition (data) {
        const result = await Util.post('/api/order/v1/returnReport/list', data)
        return result
    },
    async searchSalesReportDetails (data) {
        const result = await Util.post('/api/order/v1/order/searchSalesReportDetails', data)
        return result
    },
    async searchOperatorSalesReportDetails (data) {
        const result = await Util.post('/api/order/v1/order/searchOperatorSalesReportDetails', data)
        return result
    },
    async queryPaymentSummary (data) {
        const result = await Util.post('/api/order/v1/order/queryPaymentSummary', data)
        return result
    },
    async queryStoreGroupList (data) {
        const result = await Util.post('/api/order/v1/order/queryStroeGroupList', data)
        return result
    },
    async findActiveProductBykeyWord (data) {
        const result = await Util.post('/api/product/v1/product/findActiveProductBykeyWord', data)
        return result
    },
    async reportPermission () {
        const result = await Util.post('/api/order/v1/order/reportPermission')
        return result
    },
    async findAllPermissionFacility () {
        const result = await Util.get('/api/party/v1/facility/findAllPermissionFacility')
        return result
    },
    async findStockOutReport (data) {
        const result = await Util.post('/api/warehouse/v1/stockOutReport/findStockOutReport', data)
        return result
    },
    async findAllPermissionFacilityOrderByEgatee () {
        const result = await Util.get('/api/party/v1/facility/findAllPermissionFacilityOrderByEgatee')
        return result
    },
    /**
     * 导出Stock In Report
     */
    exportReceivedData: Util.createClass({
        method: 'get',
        url: '/api/warehouse/v1/stockInReport/exportReceivedData'
    }),
    exportXReceivedData: Util.createClass({
        method: 'getDownload',
        url: '/api/warehouse/v1/stockInReport/exportXReceivedData'
    }),
    findActiveProductBykeyWordModel: Util.createClass({
        method: 'post',
        url: '/api/product/v1/product/findActiveProductBykeyWord'
    }),
    findAllPermissionFacility: Util.createClass({
        method: 'get',
        url: '/api/party/v1/facility/findAllPermissionFacility'
    }),
    queryOperatorReportData: Util.createPageClass({
        method: 'post',
        url: '/api/warehouse/v1/stockInReport/queryOperatorReportData'
    }),
    async printSalesReportShopDetails (data) {
        const result = await Util.post('/api/order/v1/order/printSalesReportShopDetails', data)
        return result
    },
    queryReportData: Util.createPageClass({
        method: 'post',
        url: '/api/warehouse/v1/stockInReport/queryReportData'
    }),
    /*
    **  income deposit
    */
    async findAccountCheckingSheets (data) {
        const result = await Util.post('/api/workflow/v1/account-checking/find-account-checking-sheets', data)
        return result
    },
    async createOrEditSheet (data) {
        const result = await Util.post('/api/workflow/v1/account-checking/create-or-edit-sheet', data)
        return result
    },
    async findAccountCheckingSheet (data) {
        const result = await Util.post('/api/workflow/v1/account-checking/find-account-checking-sheet', data)
        return result
    },
    async findDepositSummary (data) {
        const result = await Util.post('/api/workflow/v1/account-checking/find-deposit-summary', data)
        return result
    },
    async delAccountCheckingSheet (data) {
        const result = await Util.post('/api/workflow/v1/account-checking/del-account-checking-sheet', data)
        return result
    },
    async auditSheet (data) {
        const result = await Util.post('/api/workflow/v1/account-checking/audit-sheet', data)
        return result
    },
    async exportDepositSummary (data) {
        const result = await Util.getDownload('/api/workflow/v1/account-checking/export-deposit-summary', data)
        return result
    },
    async whoseHavingRole () {
        const result = await Util.get('/api/workflow/v1/account-checking/whose-having-role')
        return result
    },
    async findNotices () {
        const result = await Util.post('/api/workflow/v1/account-checking/find-notices')
        return result
    },
    async fileUpload () {
        const result = await Util.post('/api/workflow/v1/file/upload')
        return result
    },
    async updateNoticesAsRead (data) {
        const result = await Util.post('/api/workflow/v1/account-checking/update-notices-as-read', data)
        return result
    },
    async findAuditAccountCheckingSheets (data) {
        const result = await Util.post('/api/workflow/v1/account-checking/find-audit-account-checking-sheets', data)
        return result
    },
    /*
    * inventory report
    * */
    async exportReportData (data) {
        const result = await Util.getDownload('/api/warehouse/v1/inventoryReportNew/exportReportData', data)
        return result
    },
    async findReportData (data) {
        const result = await Util.post('/api/warehouse/v1/inventoryReportNew/findReportData', data)
        return result
    },
    /*
    * sales report
    * */
    async exportSalesReportDetails (data) {
        const result = await Util.getDownload('/api/order/v1/order/exportSalesReportDetailsV2', data)
        return result
    },
    async exportPaymentSummary (data) {
        const result = await Util.getDownload('/api/order/v1/order/exportPaymentSummaryV2', data)
        return result
    }
}

