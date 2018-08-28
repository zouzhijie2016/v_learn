
var routes = [
    {path: '/', name: 'default', component: r => require(['~setting-components/index.vue'], r), alias: '/index', meta: {keepAlive: true}},
    {path: '/companySetting', name: 'companySetting', component: r => require(['~setting-components/companySetting.vue'], r)},
    {path: '/storeSetting', name: 'storeSetting', component: r => require(['~setting-components/storeSetting.vue'], r)},
    {path: '/roleSetting', name: 'roleSetting', component: r => require(['~setting-components/roleSetting.vue'], r)},
    {path: '/userSetting', name: 'userSetting', component: r => require(['~setting-components/userSetting.vue'], r)},
    {path: '/_dev', name: '_dev', component: r => require(['~setting-components/_dev/_dev.vue'], r)},
    {path: '/_devWebNav', name: '_devWebNav', component: r => require(['~setting-components/_dev/_devWebNav.vue'], r)},
    {path: '/_devDetil/:host/:port', name: '_devDetil', component: r => require(['~setting-components/_dev/_devDetil.vue'], r)},
    {path: '/_devAcessBinding', name: '_devAcessBinding', component: r => require(['~setting-components/_dev/_devAcessBinding.vue'], r)},
    {path: '/_devTreeBinding', name: '_devTreeBinding', component: r => require(['~setting-components/_dev/_devTreeBinding.vue'], r)},
    {path: '/_devAppConfig', name: '_devAppConfig', component: r => require(['~setting-components/_dev/_devAppConfig.vue'], r)}
]

// export default routes;
module.exports = routes
