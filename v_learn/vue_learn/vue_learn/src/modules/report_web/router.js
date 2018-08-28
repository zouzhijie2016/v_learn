
var routes = [
    {path: '/', name: 'default', component: r => require(['~report-components/index.vue'], r), alias: '/index', meta: {keepAlive: true}},
    {path: '/salesReturnReport', name: 'salesReturnReport', component: r => require(['~report-components/index.vue'], r)},
    {path: '/salesReturnReportList', name: 'salesReturnReportList', component: r => require(['~report-components/financeSalesReturnReport.vue'], r)},
    {path: '/salesReport', name: 'salesReport', component: r => require(['~report-components/salesReport.vue'], r)},
    {path: '/operatorSalesReport', name: 'operatorSalesReport', component: r => require(['~report-components/operatorSalesReport.vue'], r)},
    {path: '/stockoutReport', name: 'stockoutReport', component: r => require(['~report-components/stockoutReport.vue'], r)},
    {path: '/operatorStockoutReport', name: 'operatorStockoutReport', component: r => require(['~report-components/operatorStockoutReport.vue'], r)},
    {path: '/stockinReport', name: 'stockinReport', component: r => require(['~report-components/stockinReport/index.vue'], r)},
    {path: '/reportStockinReport', name: 'reportStockinReport', component: r => require(['~report-components/operatorStockinReport/index.vue'], r)},
    {path: '/incomeDeposit', name: 'incomeDeposit', component: r => require(['~report-components/incomeDeposit.vue'], r)},
    {path: '/depositSummary', name: 'depositSummary', component: r => require(['~report-components/depositSummary.vue'], r)},
    {path: '/auditIncomeDeposit', name: 'auditIncomeDeposit', component: r => require(['~report-components/auditIncomeDeposit.vue'], r)},
    {path: '/inventoryReport', name: 'inventoryReport', component: r => require(['~report-components/inventoryReport.vue'], r)},
    {path: '/operatorInventoryReport', name: 'operatorInventoryReport', component: r => require(['~report-components/operatorInventoryReport.vue'], r)},
    {path: '/dailyStatistics', name: 'dailyStatistics', component: r => require(['~report-components/dailyStatistics.vue'], r)}
]

// export default routes
module.exports = routes
