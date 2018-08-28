
var routes = [
    {path: '/', name: 'default', component: r => require(['~product-components/index.vue'], r), alias: '/index', meta: {keepAlive: true}},
    {path: '/productsList', name: 'productsList', component: r => require(['~product-components/productsList.vue'], r)},
    {path: '/editProductPriceRules', name: 'editProductPriceRules', component: r => require(['~product-components/editProductPriceRules.vue'], r)},
    {path: '/category', name: 'category', component: r => require(['~product-components/category.vue'], r)},
    {path: '/createProduct', name: 'createProduct', component: r => require(['~product-components/createProduct.vue'], r)},
    {path: '/addProductFeature', name: 'addProductFeature', component: r => require(['~product-components/addProductFeature.vue'], r)}
]

// export default routes
module.exports = routes
