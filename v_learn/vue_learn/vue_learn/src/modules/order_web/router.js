
var routes = [
    {path: '/', name: 'default', component: r => require(['~order-components/index.vue'], r), alias: '/index', meta: {keepAlive: true}},
    {path: '/salesReturn', name: 'salesReturn', component: r => require(['~order-components/salesReturn/index.vue'], r)},
    {path: '/salesReturnList', name: 'salesReturnList', component: r => require(['~order-components/salesReturn/salesReturnList.vue'], r)},
    {path: '/createSalesReturn', name: 'createSalesReturn', component: r => require(['~order-components/salesReturn/createSalesReturn.vue'], r)},
    {path: '/orderDetail', name: 'orderDetail', component: r => require(['~order-components/orderDetail.vue'], r)},
    {path: '/shippingDetail', name: 'shippingDetail', component: r => require(['~order-components/shippingDetail.vue'], r)},
    {path: '/orderList', name: 'orderList', component: r => require(['~order-components/orderList.vue'], r)}
]

// export default routes
module.exports = routes
