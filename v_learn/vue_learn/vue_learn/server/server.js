/* global require, module, process, path */

var path = require('path')
var webpack = require('webpack')
var proxyTable = require('../config/proxyTable')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('../config/webpack.dev.conf')
var speakeasy = require('speakeasy')


var express = require('express')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var utils = require('./utils')
var isLogin = utils.isLogin
var isDev = utils.isDev
var config = require('./config')

var _ = require('lodash')

// require('babel-core/register');

var port = 8080

var app = express()

// var LOGIN_PRIVATE_SECRET = "N52FCZZIEN2H2KDYGU2SYXRPJFRESMSE";

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    name:"express-sid",
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

app.use(cookieParser())

var isDev = process.env.NODE_ENV === 'development'
// console.log("isDev#### :"+isDev);
if(isDev){
    var compiler = webpack(webpackConfig)
    var devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true,
            chunks: false
        },
        quiet:true
    })
    var hotMiddleware = require('webpack-hot-middleware')(compiler,{
        log:() => {},
        heartbeat:1000
    })
    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
            hotMiddleware.publish({
                action: 'reload'
            })
            cb()
        })
    })
    app.use(devMiddleware)
    app.use(hotMiddleware)
    app.use('/static', express.static('./static'))
}else{
    app.use(express.static('./dist'))
}






var verify = require('./authenticator/verify')
app.use('/authenticator/verify', verify)

var login = require('./authenticator/login')
app.use('/authenticator/login', login)




app.use('/swagger-ui.html', (req,res) => {
    if(!isLogin(req,res)){return}
    var proxyHost = req.cookies.proxyHost
    var proxyPort = req.cookies.proxyPort
    proxyMiddleware("http://"+proxyHost+":"+proxyPort+"/swagger-ui.html",{changeOrigin: true})(req,res)

})

app.use('/swagger-resources', (req,res) => {
    if(!isLogin(req,res)){return}
    var proxyHost = req.cookies.proxyHost
    var proxyPort = req.cookies.proxyPort
    proxyMiddleware("http://"+proxyHost+":"+proxyPort+"/swagger-resources",{changeOrigin: true})(req,res)

})

app.use('/webjars', (req,res) => {
    if(!isLogin(req,res)){return}

    var proxyHost = req.cookies.proxyHost
    var proxyPort = req.cookies.proxyPort
    proxyMiddleware("http://"+proxyHost+":"+proxyPort+"/webjars",{changeOrigin: true})(req,res)

})

app.use('/v2/api-docs', (req,res) => {
    if(!isLogin(req,res)){return}
    var proxyHost = req.cookies.proxyHost
    var proxyPort = req.cookies.proxyPort
    proxyMiddleware("http://"+proxyHost+":"+proxyPort+"/v2/api-docs",{changeOrigin: true})(req,res)
})

app.use('/swagger-ui.html', (req,res) => {
    if(!isLogin(req,res)){return}
    var proxyHost = req.cookies.proxyHost
    var proxyPort = req.cookies.proxyPort
    proxyMiddleware("http://"+proxyHost+":"+proxyPort+"/swagger-ui.html",{changeOrigin: true})(req,res)
})


app.use('/druid', (req,res) => {
    if(!isLogin(req,res)){return}
    var proxyHost = req.cookies.proxyHost
    var proxyPort = req.cookies.proxyPort
    proxyMiddleware("http://"+proxyHost+":"+proxyPort+"/druid",{changeOrigin: true})(req,res)

})



var commProxy = require('./commProxy');
var staticFileProxy = commProxy.staticFileProxy;
var springAdminProxy = commProxy.springAdminProxy;
var consulProxy = commProxy.consulProxy;
// var apiProxy = commProxy.apiProxy;

// app.use('/*.js', staticProxy);
// app.use('/*.css', staticProxy);
// app.use('/*.html', staticProxy);
// app.use('/*.png', staticProxy);
// app.use('/*.gif', staticProxy);
// app.use('/*.ttf', staticProxy);
// app.use('/**/*.woff2', staticProxy);
// app.use('/**/*.woff', staticProxy);
app.use(staticFileProxy)

app.use('/ui', consulProxy)
app.use('/v1', consulProxy)

app.use("/third-party/font-awesome/fonts/", springAdminProxy)
app.use("/third-party/googlefonts/", springAdminProxy)
app.use("/img/platform-spring-boot.png", springAdminProxy)
app.use("/img/spring-logo.png", springAdminProxy)
app.use('/__springAdmin', springAdminProxy)
app.use('/api/notifications/filters', springAdminProxy)
app.use('/api/applications', springAdminProxy)
app.use('/api/journal', springAdminProxy)




app.use('/verifyDcCenter', (req,res) => {
    if(!isLogin(req,res)){return}

    var springBootAdminList = config.SPRING_BOOT_ADMIN_LIST
    var consulProxyList = config.CONSUL_PROXY_LIST

    var resObj = {}
    resObj.success = true
    resObj.springBootAdminList = springBootAdminList
    resObj.consulProxyList = consulProxyList
    resObj.choiceDc = req.session.choiceDc
    res.send(resObj)

})

app.use('/handleDcCenterChange', (req,res) => {
    if(!isLogin(req,res)){return}
    req.session.choiceDc = req.query.choiceDc
    var resObj = {}
    resObj.success = true
    resObj.ChoiceDc = req.query.ChoiceDc
    res.send(resObj)

})






var modules = require('./modules')
app.use('/__securityList', (req,res) => {
    // if(req.session.verify){
    var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    console.log(ip);

    // console.log(modules);

    var permissionArr = [];

    for (var _module in modules) {

      var moduleObj = {};
        moduleObj.module =_module

      var permission = [];

      var routers = modules[_module];
      for (var routerIndex in routers) {
          var router = routers[routerIndex];
          // console.log(router);
          var permission = router.meta && router.meta.permission;

          if(permission){
            moduleObj.permission = permission;
          }
          // console.log("router.meta  ############");
          // console.log(router.meta);
          // console.log(permission);
          // console.log("permission  ############");
      }

      permissionArr.push(moduleObj);

      // console.log(_module);
      // console.log(modules[_module].meta.permission);
    }

    var resObj = {}
    resObj.success = true;
    resObj.permissionList = permissionArr;
    res.send(resObj)
});

Object.keys(proxyTable).forEach(function(context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = {
            target: options,
            changeOrigin: true,
            cookieDomainRewrite:'localhost'
        }
    }
    app.use(context, (req,res) => {
        // if(req.session.verify){
        var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
        console.log(ip);
        //     console.log(context);
        proxyMiddleware(context,options)(req,res)
        // }else{
        //     console.log(1111);
        //   res.send(req.session.verify);
        // }
    })
})

// app.use('/api', apiProxy);







app.use(require('connect-history-api-fallback')())

module.exports = app.listen(port, '0.0.0.0', function(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
})
