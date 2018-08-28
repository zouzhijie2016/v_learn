/**
 * Created by qinghua.gong on 2017/10/26.
 */
var orderNavInfo = {
    linkUrl: '/ordermgr/control/findSalesOrders',
    name: 'Search Orders',
    selected: false,
    childNode: [
        {linkUrl: '/order_web/index.html#/salesReturn', name: 'Sales Return', selected: 'true', shortName: 'Sales Return'}]
}
var reportNavInfo = {
    linkUrl: '/report/control/BANSalesReport',
    name: 'Report',
    selected: false,
    childNode: [
        {linkUrl: '/report_web/index.html#/salesReturnReportList', name: 'Sales Return Report', selected: 'true', shortName: 'Sales Return Report'}]
}
var storeNavInfo = {
    linkUrl: '/Store/control/main',
    name: 'Store',
    selected: false,
    childNode: [
        {linkUrl: '/Store/control/main', name: 'Store', selected: 'true', shortName: 'Store'},
        {linkUrl: '/Store/control/FindProductStoreRoles', name: 'Role', selected: 'false', shortName: 'Role'}]
}
var warehouseShippingNavInfo = {
    linkUrl: '/warehouse_web/index.html#/shippingNeedOrderList',
    name: 'Shipping',
    selected: false,
    shortName: 'Shipping'
}
exports = module.exports = {
    orderNavInfo,
    reportNavInfo,
    storeNavInfo,
    warehouseShippingNavInfo
}
