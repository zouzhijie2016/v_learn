
var routes = [
    {path: '/', name: 'default', component: r => require(['~store-components/index.vue'], r), alias: '/index', meta: {keepAlive: true}},
    {path: '/shipmentWarehouse', name: 'shipmentWarehouse', component: r => require(['~store-components/shipmentWarehouse.vue'], r)}
]

// export default routes
module.exports = routes
