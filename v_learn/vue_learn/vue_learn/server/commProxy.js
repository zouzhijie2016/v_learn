
var proxyMiddleware = require('http-proxy-middleware')
var config = require('./config')
var _ = require('lodash')
var utils = require('./utils')
var isLogin = utils.isLogin
var isDev = utils.isDev



// function getspringAdminUrl(choiceDc){
//     if(choiceDc){
//         var springBootAdminList = config.SPRING_BOOT_ADMIN_LIST
//         var choiceDcObj = _.find(springBootAdminList, function(o) { return o.name == choiceDc })
//         if(choiceDcObj){
//             var targetUrl = choiceDcObj.targetUrl
//             return targetUrl
//         }
//     }
//     return null
// }

// function getconsulUrl(choiceDc){
//     if(choiceDc){
//         var consulProxyList = config.CONSUL_PROXY_LIST
//         var choiceDcObj = _.find(consulProxyList, function(o) { return o.name == choiceDc })
//         if(choiceDcObj){
//             var targetUrl = choiceDcObj.targetUrl
//             return targetUrl
//         }
//     }
//     return null
// }

// function getApiProxyUrl(choiceDc){
//     if(choiceDc){
//         var zuulGatewayList = config.ZUUL_GATEWAY_LIST
//         var choiceDcObj = _.find(zuulGatewayList, function(o) { return o.name == choiceDc })
//         if(choiceDcObj){
//             var targetUrl = choiceDcObj.targetUrl
//             return targetUrl
//         }
//     }
//     return null
// }



var staticFileProxy = (req,res,next) => {
    if(req.headers.referer && req.headers.referer.indexOf("__springAdmin") > -1){
        var choiceDc =req.session.choiceDc
        // var targetUrl = getspringAdminUrl(choiceDc)
        var springBootAdmin = config.SPRING_BOOT_ADMIN;
        if(springBootAdmin){
            proxyMiddleware(springBootAdmin,{
                changeOrigin: true,
                pathRewrite: {
                    '^/__springAdmin': '/'
                }})(req,res)
            return
        }
        // var resObj ={}
        // resObj.success = false
        // resObj.message = "nofound springBootAdmin";
        // res.send(resObj)
        // return
    }
    next()
}

var springAdminProxy = (req,res,next) => {
    if(!isLogin(req,res)){return}
    // var resObj = {}
    // var choiceDc =req.session.choiceDc
    // if(!choiceDc){
    //     resObj.success = false
    //     resObj.message = "请选择一个数据中心"
    //     res.send(resObj)
    //     return
    // }
    // var targetUrl = getspringAdminUrl(choiceDc)



    var springBootAdmin = config.SPRING_BOOT_ADMIN;
    // console.log(springBootAdmin);
    // if(springBootAdmin){
        proxyMiddleware(springBootAdmin,{
            changeOrigin: true,
            pathRewrite: {
                '^/__springAdmin': '/'
            }})(req,res)
    // }else{
    //     resObj.success = false;
    //     res.send(resObj)
    //     resObj.message = "nofound springBootAdmin :";
    //     return
    // }
}


var consulProxy = (req,res,next) => {
    if(!isLogin(req,res)){return}

    // var choiceDc =req.session.choiceDc
    // if(!choiceDc){
    //     resObj.success = false
    //     resObj.message = "请选择一个数据中心"
    //     res.send(resObj)
    //     return
    // }
    // var targetUrl = getconsulUrl(choiceDc)
    var consulProxy = config.CONSUL_PROXY;
    // if(consulProxy){
        proxyMiddleware(consulProxy,{
            changeOrigin: true
        })(req,res)
    // }else{
    //     var resObj = {}
    //     resObj.success = false;
    //     resObj.message = "nofound consulProxy";
    //     res.send(resObj)
    //     return
    // }
}


var apiProxy = (req,res,next) => {
    if(!isLogin(req,res)){return}

    var devZuul = config.DEV_ZUUL
    if(devZuul){
        proxyMiddleware(devZuul,{
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api'
            }})(req,res)
        return
    }


    // var resObj = {}
    // var choiceDc =req.session.choiceDc
    // if(!choiceDc){
    //     resObj.success = false
    //     resObj.message = "请选择一个数据中心"
    //     res.send(resObj)
    //     return
    // }
    //
    // var targetUrl = getApiProxyUrl(choiceDc)
    // if(targetUrl){
    //     proxyMiddleware(targetUrl,{
    //         changeOrigin: true,
    //     })(req,res)
    //     return
    // }
    // resObj.success = false
    // resObj.message = "nofound choiceDc :"+choiceDc
    // res.send(resObj)
    // return

}


exports = module.exports = {
    staticFileProxy,
    springAdminProxy,
    consulProxy,
    apiProxy
}
