const routers = [
    {name: '/', path: '/', redirect: '/serviceList'},
    {name: 'login', path: '/login', component: r => require.ensure([], () => r(require('./components/home/login.vue')), 'login'), meta: {keepAlive: true}},
    {name: 'druidProxy', path: '/druidProxy/:host/:port', component: r => require.ensure([], () => r(require('./components/proxy/druidProxy.vue')), 'druidProxy')},
    {name: 'swaggerProxy', path: '/swaggerProxy/:host/:port', component: r => require.ensure([], () => r(require('./components/proxy/swaggerProxy.vue')), 'swaggerProxy')},
    {name: 'serviceList', path: '/serviceList', component: r => require.ensure([], () => r(require('./components/proxy/serviceList.vue')), 'serviceList')},
    {name: 'serverList', path: '/serverList', component: r => require.ensure([], () => r(require('./components/proxy/serverList.vue')), 'serverList')},
    {name: 'springAdminProxy', path: '/springAdminProxy', component: r => require.ensure([], () => r(require('./components/proxy/springAdminProxy.vue')), 'springAdminProxy')},
    {name: 'consulProxy', path: '/consulProxy', component: r => require.ensure([], () => r(require('./components/proxy/consulProxy.vue')), 'consulProxy')},
    {name: 'securityList', path: '/securityList', component: r => require.ensure([], () => r(require('./components/security/securityList.vue')), 'securityList'), meta: {permission: ['ddd', 'dasdas']}}
]

module.exports = routers
