
var utils = require('../utils')
var isLogin = utils.isLogin

exports = module.exports = (req,res) => {

    if(!isLogin(req,res)){return}

    var resObj = {}
    resObj.success = true
    res.send(resObj)
}
