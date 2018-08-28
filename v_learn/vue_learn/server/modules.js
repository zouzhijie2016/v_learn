// var babel = require("babel-core");
var path= require("path")

var httpProxy = require(path.join(__dirname,"../src/modules/http_proxy/router.js"));
var orderWeb = require(path.join(__dirname,'../src/modules/order_web/router.js'));
var productWeb = require(path.join(__dirname,'../src/modules/product_web/router.js'));
var reportWeb = require(path.join(__dirname,'../src/modules/report_web/router.js'));
var settingWeb = require(path.join(__dirname,'../src/modules/setting_web/router.js'));
var storeWeb = require(path.join(__dirname,'../src/modules/store_web/router.js'));
var userWeb = require(path.join(__dirname,'../src/modules/user_web/router.js'));
var warehouseWeb = require(path.join(__dirname,'../src/modules/warehouse_web/router.js'));

exports = module.exports = {
    httpProxy:httpProxy,
    orderWeb:orderWeb,
    productWeb:productWeb,
    reportWeb:reportWeb,
    settingWeb:settingWeb,
    storeWeb:storeWeb,
    userWeb:userWeb,
    warehouseWeb:warehouseWeb
}
