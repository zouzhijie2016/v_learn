
var routes = [
    {path: '/', name: 'default', component: r => require(['~user-components/login/login'], r), alias: '/login', meta: {keepAlive: false}},
    {path: '/test', name: 'test', component: r => require(['~user-components/test'], r), meta: {keepAlive: false}}
]
// export default routes
module.exports = routes
